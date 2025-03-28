import { NotificationEntity } from '@app/db';
import { BasePageOptionsDto, DetailResponse, NotificationStatus, PageDto, PageMetaDto } from '@app/shared';
import { PaginateQuery, Paginated, paginate } from '@app/shared/paginate';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Router } from 'express';
import { ReadStream } from 'fs';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { CreateNotificationDto, NotificationPageConfig } from '../dtos';

export interface IEndPointDto {
  endPoint?: string;

  method?: string;

  path?: string;
}
export class EndPointDto {
  endPoint?: string;
  method?: string;
  path?: string;
  constructor(data: IEndPointDto) {
    this.endPoint = data.endPoint;
    this.path = data.path;
    this.method = data.method;
  }
}
export class EndPointPageOptionsDto extends BasePageOptionsDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  endPoint?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  method?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  path?: string;
}
@Injectable()
export class NotificationService {
  // private resourceList: IPermission[];
  constructor(
    // private readonly collectionsPermissionService: OperationResourceDiscoveryService,
    private readonly ds: DataSource,
  ) {}

  ingestStream(stream: ReadStream): Promise<any[]> {
    const chunks: any[] = [];
    return new Promise((ok, fail) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', fail);
      stream.on('end', () => ok(chunks));
    });
  }

  public async findAll(query: PaginateQuery, where?: FindOptionsWhere<NotificationEntity> | FindOptionsWhere<NotificationEntity>[]): Promise<Paginated<NotificationEntity>> {
    // const meta = this.ds.getMetadata('users');
    // console.log('meta', meta);
    // const testdata = await this.ds.manager.find(meta.target);
    // console.log('testdata', testdata);
    // const cols = meta.columns.map((col) => col.propertyName);
    // console.log('cols', cols);
    // const cols2 = meta.columns.map((col) => col.propertyAliasName);
    // console.log('cols2', cols2);

    // const ids = testdata.map((x) => x.id);
    // console.log('ids', ids);

    // const pool = this.ds.manager.connection.options;
    // console.log('pool', pool);

    // Stream data:
    // const stream = await this.ds.createQueryBuilder().from(meta.target, 'dummy').select('id').stream();
    // const streamedEntities = await this.ingestStream(stream);
    //-----------------------------------------------------
    // this.resourceList = await this.collectionsPermissionService.allPermissionList();
    // console.log('resourceList', JSON.stringify(this.resourceList));

    /* 
    [
  {
    "moduleName": "Station Products (Lube & Services) Management",
    "endpoints": [
      {
        "methodName": "Get All Station Product Prices",
        "method": "GET",
        "url": "notifications"
      }
    ]
  }
]

    */
    return paginate(query, this.ds.getRepository(NotificationEntity), { ...NotificationPageConfig, where });
  }
  public async getEndpoints(pageOptionsDto: EndPointPageOptionsDto, router: Router): Promise<PageDto<EndPointDto> | undefined> {
    const now = performance.now();
    let endpoints = router.stack
      .map((layer) => {
        if (layer.route) {
          return new EndPointDto({
            path: layer.route?.path,
            method: layer.route?.stack[0].method,
            endPoint: `${layer.route?.stack[0].method.toUpperCase()} ${layer.route?.path}`,
          });
        }
      })
      .filter((item) => item !== undefined)
      .filter(
        (item) =>
          !item?.path
            ?.split('/')
            .some((a) =>
              [
                'manage',
                'auth',
                'global-configs',
                'telebirr_callback',
                'banks',
                'cities',
                'distributors',
                'payment-methods',
                'products',
                'regions',
                'vehicle-brands',
                'vehicle-models',
                'spare-part-categories',
                'spare-part-sub-categories',
                'spare-part-items',
              ].includes(a),
            ),
      )
      .filter((item) => ['put', 'post'].includes(item.method));
    if (pageOptionsDto.endPoint) {
      endpoints = endpoints.filter((o) => o.endPoint.includes(pageOptionsDto.endPoint));
    }
    if (pageOptionsDto.method) {
      endpoints = endpoints.filter((o) => o.method.includes(pageOptionsDto.method));
    }
    if (pageOptionsDto.path) {
      endpoints = endpoints.filter((o) => o.path.includes(pageOptionsDto.path));
    }
    const paginated = this.paginate(endpoints, pageOptionsDto.page, pageOptionsDto.take);
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: endpoints.length,
    });
    endpoints.forEach((d) => console.log(d));
    console.log('\nendpoints:', endpoints, '\n');
    const respTime = `${performance.now() - now}ms`;
    console.log('\nrespTime:', respTime, '\n');
    return new PageDto(paginated.items, pageMetaDto);
  }
  public async getEndpoints2(pageOptionsDto: EndPointPageOptionsDto, router: Router): Promise<EndPointDto[] | undefined> {
    const now = performance.now();
    let endpoints = router.stack
      .map((layer) => {
        if (layer.route) {
          // console.log('mount path:', layer.route?.path);
          // console.log('mount path:', layer.route.PATH_METADATA);
          return new EndPointDto({
            path: layer.route?.path,
            method: layer.route?.stack[0].method,
            endPoint: `${layer.route?.stack[0].method.toUpperCase()} ${layer.route?.path}`,
          });
        }
      })
      .filter((item) => item !== undefined)
      .filter(
        (item) =>
          !item?.path?.split('/').some((a) =>
            [
              // 'manage',
              // 'auth',
              // 'global-configs',
              // 'telebirr_callback',
              // 'banks',
              // 'cities',
              // 'distributors',
              // 'payment-methods',
              // 'products',
              // 'regions',
              // 'vehicle-brands',
              // 'vehicle-models',
              // 'spare-part-categories',
              // 'spare-part-sub-categories',
              // 'spare-part-items',
            ].includes(a),
          ),
      )
      .filter((item) => ['put', 'post'].includes(item.method));
    if (pageOptionsDto.endPoint) {
      endpoints = endpoints.filter((o) => o.endPoint.includes(pageOptionsDto.endPoint));
    }
    if (pageOptionsDto.method) {
      endpoints = endpoints.filter((o) => o.method.includes(pageOptionsDto.method));
    }
    if (pageOptionsDto.path) {
      endpoints = endpoints.filter((o) => o.path.includes(pageOptionsDto.path));
    }
    // const paginated = this.paginate(endpoints, pageOptionsDto.page, pageOptionsDto.take);
    // const pageMetaDto = new PageMetaDto({
    //   pageOptionsDto,
    //   itemCount: endpoints.length,
    // });
    endpoints.forEach((d) => console.log(d));
    console.log('\nendpoints:', endpoints, '\n');
    const respTime = `${performance.now() - now}ms`;
    console.log('\nrespTime:', respTime, '\n');
    return endpoints;
  }
  paginate = <T>(items: T[], page = 1, perPage = 10) => {
    const offset = perPage * (page - 1);
    const totalPages = Math.ceil(items.length / perPage);
    const paginatedItems = items.slice(offset, perPage * page);

    return {
      previousPage: page - 1 ? page - 1 : null,
      nextPage: totalPages > page ? page + 1 : null,
      total: items.length,
      totalPages: totalPages,
      items: paginatedItems,
    };
  };
  private async getNotification(options: Partial<{ id: number; isActive: string }>): Promise<NotificationEntity | undefined> {
    const qb = this.ds
      .getRepository(NotificationEntity)
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user')
      .leftJoinAndSelect('user.userProfile', 'userProfile');
    if (options.id) {
      qb.andWhere('notification.id = :id', { id: options.id });
    }
    return qb.getOne();
  }
  public async getNotificationById(id: number): Promise<DetailResponse<NotificationEntity> | undefined> {
    const result = await this.getNotification({ id });
    return new DetailResponse(result);
  }

  public async createNotification(dto: CreateNotificationDto): Promise<NotificationEntity | undefined> {
    return this.ds.getRepository(NotificationEntity).save(new NotificationEntity(dto));
  }

  public async updateStatus(status: NotificationStatus, id: number): Promise<NotificationEntity | undefined> {
    const data = await this.ds.getRepository(NotificationEntity).preload({ id, status });
    if (!data) throw new BadRequestException('Requested Notification Not Found');
    await this.ds.getRepository(NotificationEntity).save(data);
    return this.getNotification({ id });
  }
}
