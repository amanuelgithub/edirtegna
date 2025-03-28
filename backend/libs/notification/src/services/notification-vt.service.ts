import { NotificationEntity } from '@app/db';
import { DetailResponse, paginate, Paginated, PaginateQuery, selectOne, SelectOneOpts } from '@app/shared';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, FindOptionsWhere } from 'typeorm';
import { CreateNotificationDto, NotificationPageConfig, NotificationSelectOneConfig, UpdateNotificationDto } from '../dtos';

@Injectable()
export class NotificationV2Service {
  constructor(private ds: DataSource) {}

  private _get(opts: SelectOneOpts<NotificationEntity>): Promise<NotificationEntity> {
    const source = opts.m || this.ds;
    return selectOne(opts.query, source.getRepository(NotificationEntity), { ...NotificationSelectOneConfig, where: opts.where }, opts.setPessimisticLock);
  }

  public getAll(query: PaginateQuery, where?: FindOptionsWhere<NotificationEntity> | FindOptionsWhere<NotificationEntity>[]): Promise<Paginated<NotificationEntity>> {
    return paginate(query, this.ds.getRepository(NotificationEntity), { ...NotificationPageConfig, where });
  }

  public async getOneBy(options: Partial<{ id: number; status: string; userId: number }>, m?: EntityManager, setPessimisticLock = false): Promise<NotificationEntity> | undefined {
    const where = {} as any;
    if (options.id) where.id = options.id;
    if (options.status) where.status = options.status;
    if (options.userId) where.userId = options.userId;
    return this._get({ m, setPessimisticLock, where });
  }

  public async create(dto: CreateNotificationDto): Promise<DetailResponse<NotificationEntity> | undefined> {
    const _data = this.ds.getRepository(NotificationEntity).create({ ...dto });
    await this.ds.getRepository(NotificationEntity).save(_data);
    return new DetailResponse(_data);
  }

  public async update(id: number, options: UpdateNotificationDto) {
    const _data = await this.ds.getRepository(NotificationEntity).preload({ id, ...options });
    if (!_data) throw new BadRequestException('Requested Record Not Found');
    await this.ds.getRepository(NotificationEntity).save(_data);
    return new DetailResponse(_data.toDto());
  }
}
