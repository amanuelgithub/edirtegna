import { GlobalConfigEntity } from '@app/db';
import { RedisService } from '@app/redis';
import { AccessUserAgent, PageDto, PageMetaDto } from '@app/shared';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { UAParser } from 'ua-parser-js';
import {
  AuthConfigDto,
  ChunkSizeConfigDto,
  CONFIG_INIT,
  GeneralConfigDto,
  GlobalConfigAdapter,
  GlobalConfigPageOptionsDto,
  NotificationConfigDto,
  SystemConfigDto,
  UpdateGlobalConfigDto,
} from '../dto';

@Injectable()
export class GlobalConfigService {
  constructor(
    private readonly ds: DataSource,
    private readonly redisService: RedisService,
  ) {}

  public async initConfig(): Promise<any | undefined> {
    const queryRunner = this.ds.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const data = [];
      Object.keys(CONFIG_INIT).forEach((key) => {
        const group = Object.keys(CONFIG_INIT[key]).map((configKey) => ({ category: key, key: configKey, value: CONFIG_INIT[key][configKey] }));
        data.push(...group);
      });
      const configs = queryRunner.manager.create(GlobalConfigEntity, data);
      const result = await queryRunner.manager.save(GlobalConfigEntity, configs);

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.status === HttpStatus.BAD_REQUEST || error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } finally {
      await queryRunner.release();
    }
  }
  public async isGlobalConfigsInitialized(): Promise<boolean | undefined> {
    const qb = this.ds.createQueryBuilder(GlobalConfigEntity, 'globalConfig');
    return (await qb.getCount()) > 0;
  }

  public async getGlobalConfigById(key: string): Promise<GlobalConfigEntity | undefined> {
    return this.ds.createQueryBuilder(GlobalConfigEntity, 'globalConfig').andWhere('globalConfig.key = :key', { key }).getOne();
  }

  public async getGlobalConfigs(pageOptionsDto: GlobalConfigPageOptionsDto): Promise<PageDto<GlobalConfigEntity> | undefined> {
    const qb = this.ds.createQueryBuilder(GlobalConfigEntity, 'globalConfig');
    const [globalConfigs, globalConfigsCount] = await qb
      .skip((pageOptionsDto.page - 1) * pageOptionsDto.take)
      .take(pageOptionsDto.take)
      .orderBy(`globalConfig.${pageOptionsDto.sort || 'updatedAt'}`, pageOptionsDto.order)
      .getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: globalConfigsCount,
    });
    const data = await globalConfigs.map((la) => la.toDto());
    return new PageDto(data, pageMetaDto);
  }

  public async getAllGlobalConfigs(): Promise<GlobalConfigEntity[] | undefined> {
    const qb = this.ds.createQueryBuilder(GlobalConfigEntity, 'globalConfig');
    return qb.getMany();
  }

  public async createGlobalConfig(createGlobalConfig): Promise<GlobalConfigEntity | undefined> {
    const globalConfig = new GlobalConfigEntity(createGlobalConfig);
    await this.ds.getRepository(GlobalConfigEntity).save(new GlobalConfigEntity(createGlobalConfig));
    return globalConfig;
  }

  public async updateGlobalConfig(updateGlobalConfigDto: UpdateGlobalConfigDto, key: string): Promise<GlobalConfigEntity | undefined> {
    const globalConfig = await this.getGlobalConfigById(key);

    if (!globalConfig) {
      throw new HttpException('Requested GlobalConfig Not Found', HttpStatus.BAD_REQUEST);
    }
    const qb = this.ds.createQueryBuilder(GlobalConfigEntity, 'globalConfig');
    await qb
      .update()
      .set({
        ...updateGlobalConfigDto,
      })
      .where('key = :key', { key })
      .execute();
    return this.getGlobalConfigById(key);
  }

  //////////////////////////
  private async getCacheConfigByKey<T>(key: keyof SystemConfigDto): Promise<T | undefined> {
    try {
      const data = await this.redisService.getValue<T>(key);
      return data;
    } catch (error) {
      Logger.error({
        message: `Exception @ getCacheConfigByKey - ${error?.message}`,
        meta: { key },
        stack: error,
        context: GlobalConfigService.name,
      });
      return;
    }
  }
  public async getConfigByKey<T>(key: keyof SystemConfigDto): Promise<T | undefined> {
    try {
      const cache = await this.getCacheConfigByKey<T>(key);
      if (!cache) {
        const configs = await this.getAllGlobalConfigs();

        const keyConfig = configs.find((c) => c.key === key);

        if (keyConfig && keyConfig.value) {
          await this.redisService.putValue<T>(key, JSON.parse(keyConfig.value));
          return this.getCacheConfigByKey<T>(key);
        } else {
          await this.saveConfig<T>(key, CONFIG_INIT[`${key}`]);
          return this.getCacheConfigByKey<T>(key);
        }
      }

      return cache;
    } catch (error) {
      Logger.error({
        message: `Exception @ getConfigByKey - ${error?.message}`,
        meta: { key },
        stack: error,
        context: GlobalConfigService.name,
      });
      return;
    }
  }
  public async getConfigs(): Promise<SystemConfigDto | undefined> {
    try {
      const general = await this.getConfigByKey<GeneralConfigDto>('general');
      const notification = await this.getConfigByKey<NotificationConfigDto>('notification');
      const auth = await this.getConfigByKey<AuthConfigDto>('auth');
      const chunkSize = await this.getConfigByKey<ChunkSizeConfigDto>('chunkSize');
      return { auth, general, notification, chunkSize };
    } catch (error) {
      Logger.error({
        message: `Exception @ getConfigs - ${error?.message}`,
        stack: error,
        context: GlobalConfigService.name,
      });
      return;
    }
  }

  public async saveConfig<T>(key: string, globalConfigDto: GlobalConfigAdapter): Promise<any | undefined> {
    const queryRunner = this.ds.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const config = globalConfigDto.getConfigs();
      await queryRunner.manager.upsert(GlobalConfigEntity, config, { conflictPaths: ['key'] });
      await queryRunner.commitTransaction();
      const data = await this.redisService.putValue<T>(key, config.value);
      return data;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.status === HttpStatus.BAD_REQUEST || error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } finally {
      await queryRunner.release();
    }
  }
  public getUa(req: Request) {
    const agent = req.get('user-agent');
    const ua = new UAParser(agent);
    const userAgent = plainToInstance(AccessUserAgent, ua.getResult() as object, { enableImplicitConversion: true });
    return userAgent;
  }
}
