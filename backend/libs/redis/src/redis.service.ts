import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';
import JSONCache from './json-lib/jsonCache';
import { REDIS_MODULE_OPTIONS } from './redis.constants';
import { RedisModuleOptions } from './redis.module';

@Injectable()
export class RedisService {
  private readonly connection: Redis;
  constructor(
    @Inject(REDIS_MODULE_OPTIONS)
    private readonly redisModuleOptions: RedisModuleOptions,
    private readonly configService: ConfigService,
  ) {
    this.connection = this.createConnection();
  }

  async getValue<T>(key: string, prefix = 'jc:'): Promise<T> {
    try {
      const jsonCache = new JSONCache<T>(this.connection, { prefix });
      const result = await jsonCache.get(key);
      return result;
    } catch (error) {
      Logger.error({
        message: `Exception @ getValue - ${error?.message}`,
        stack: error,
        context: RedisService.name,
      });
      return null;
    }
  }
  async putValue<T>(key: string, value: any, expireMs?: number, prefix = 'jc:'): Promise<boolean> {
    try {
      if (typeof value === 'string') {
        value = JSON.parse(value);
      }
      const jsonCache = new JSONCache<T>(this.connection, { prefix });
      const result = expireMs ? await jsonCache.set(key, value as T, { expire: expireMs }) : await jsonCache.set(key, value as T);
      return result === 'OK';
    } catch (error) {
      Logger.error({
        message: `Exception @ putValue - ${error?.message}`,
        stack: error,
        context: RedisService.name,
      });
      return false;
    }
  }
  async deleteEntry<T>(key: string, prefix = 'jc:'): Promise<boolean> {
    try {
      const jsonCache = new JSONCache<T>(this.connection, { prefix });
      const result = await jsonCache.del(key);
      console.log('result:', result);
      // const result = await this.connection.del(key);
      return result > 0;
    } catch (error) {
      Logger.error({
        message: `Exception @ deleteEntry - ${error?.message}`,
        stack: error,
        context: RedisService.name,
      });
      return false;
    }
  }

  getConnection(): Redis {
    return this.connection;
  }

  private createConnection(extraOptions: RedisOptions = {}): Redis {
    const host = this.redisModuleOptions?.host ?? this.configService.get('redis.host');
    const port = this.redisModuleOptions?.port ?? this.configService.get('redis.port');
    const username = this.redisModuleOptions?.username ?? this.configService.get('redis.user');
    const password = this.redisModuleOptions?.password ?? this.configService.get('redis.password');
    const db = this.redisModuleOptions?.db ?? this.configService.get('redis.db');
    const keyPrefix = this.redisModuleOptions?.keyPrefix ?? this.configService.get('redis.keyPrefix');
    return new Redis({
      port,
      host,
      username,
      password,
      db,
      keyPrefix,
      ...extraOptions,
    });
  }
}
