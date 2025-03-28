import { UserApiAccessBuilder } from '@app/auth/builders';
import { UserAccessEntity } from '@app/db';
import { DetailResponse, PageDto, PageMetaDto } from '@app/shared';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CleantAccessPageOptionsDto, CreateClientAccessDto, UpdateClientAccessDto } from '../dtos';
export type ClientAccessWithCredentials = UserAccessEntity & { apiClientId: string; clientSecret: string };
@Injectable()
export class ClientAccessService {
  constructor(private ds: DataSource) {}

  private async getClientAccess(options: Partial<{ id: number; userId: number }>): Promise<UserAccessEntity | undefined> {
    const qb = this.ds.getRepository(UserAccessEntity).createQueryBuilder('ua');
    qb.select(['ua.id', 'ua.apiClientId', 'ua.clientName', 'ua.allowedUrls', 'ua.status', 'ua.userId', 'ua.createdAt']);
    qb.andWhere(`ua.accessChannel = 'API'`);
    if (options.id) {
      qb.andWhere('ua.id = :id', { id: options.id });
    }
    if (options.userId) {
      qb.andWhere('ua.userId = :userId', { userId: options.userId });
    }
    return qb.getOne();
  }

  public async getClientAccessById(options: Partial<{ id: number; userId: number }>): Promise<DetailResponse<UserAccessEntity> | undefined> {
    const data = await this.getClientAccess(options);
    return new DetailResponse(data);
  }

  public async getClientAccesses(pageOptionsDto: CleantAccessPageOptionsDto): Promise<PageDto<UserAccessEntity> | undefined> {
    const qb = this.ds.getRepository(UserAccessEntity).createQueryBuilder('ua');
    qb.select(['ua.id', 'ua.apiClientId', 'ua.clientName', 'ua.allowedUrls', 'ua.status', 'ua.userId', 'ua.createdAt']);

    qb.andWhere(`ua.accessChannel = 'API'`);
    if (typeof pageOptionsDto.userId !== 'undefined') {
      qb.andWhere(`ua.userId = :userId`, { userId: pageOptionsDto.userId });
    }
    qb.orderBy(`ua.${pageOptionsDto.sort || 'createdAt'}`, pageOptionsDto.order);
    const [clientAccesses, clientAccessesCount] = await qb
      .skip((pageOptionsDto.page - 1) * pageOptionsDto.take)
      .take(pageOptionsDto.take)
      .getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: clientAccessesCount,
    });
    console.log('qry', clientAccesses, '\n');
    const data = await clientAccesses.map((la) => la.toDto());
    console.log('qry', data);

    return new PageDto(data, pageMetaDto);
  }

  public async createClientAccess(dto: CreateClientAccessDto): Promise<DetailResponse<ClientAccessWithCredentials> | undefined> {
    const builder = new UserApiAccessBuilder(dto.userId).setAllowedUrls(dto.allowedUrls).setClientName(dto.clientName);
    const { apiClientId, clientSecret } = builder.getApiCredentials();
    const access = await builder.build();
    await this.ds.getRepository(UserAccessEntity).save(access);
    return new DetailResponse({ ...access, apiClientId, clientSecret } as ClientAccessWithCredentials);
  }

  public async updateClientAccess(dto: UpdateClientAccessDto, id: number): Promise<DetailResponse<UserAccessEntity> | undefined> {
    const data = await this.getClientAccess({ id });
    if (!data) {
      throw new HttpException('Requested Client Access Not Found', HttpStatus.BAD_REQUEST);
    }
    const builder = new UserApiAccessBuilder(dto.userId, data).setAllowedUrls(dto.allowedUrls);
    const { apiClientId, clientSecret } = builder.getApiCredentials();
    const access = await builder.build();
    await this.ds.getRepository(UserAccessEntity).save(access);
    return new DetailResponse({ ...access, apiClientId, clientSecret } as ClientAccessWithCredentials);
  }
}
