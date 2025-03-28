import { ActivityLogEntity } from '@app/db';
import { DetailResponse, PageDto, PageMetaDto, PaginateQuery, Paginated, getStartAndEndDates, paginate } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { ActivityLogPageConfig, ActivityLogPageOptionsDto } from '../dtos';

@Injectable()
export class ActivityLogService {
  constructor(private readonly ds: DataSource) {}

  public getAllActivityLogs(query: PaginateQuery, where?: FindOptionsWhere<ActivityLogEntity> | FindOptionsWhere<ActivityLogEntity>[]): Promise<Paginated<ActivityLogEntity>> {
    return paginate(query, this.ds.getRepository(ActivityLogEntity), { ...ActivityLogPageConfig, where });
  }

  private async getActivityLog(options: Partial<{ id: number; userId: number; parentUserId: number }>): Promise<DetailResponse<ActivityLogEntity> | undefined> {
    const qb = this.ds.createQueryBuilder(ActivityLogEntity, 'activityLog');
    qb.leftJoinAndSelect('activityLog.user', 'user');
    qb.leftJoinAndSelect('user.userProfile', 'userProfile');
    qb.leftJoinAndSelect('userProfile.company', 'company');

    if (options.id) {
      qb.andWhere('activityLog.id = :id', { id: options.id });
    }
    if (options.userId) {
      qb.andWhere('activityLog.userId = :userId', { userId: options.userId });
    }
    return new DetailResponse(await qb.getOne());
  }
  public async getActivityLogById(options: Partial<{ id: number; userId: number; parentUserId: number }>): Promise<DetailResponse<ActivityLogEntity> | undefined> {
    const activityLog = await this.getActivityLog(options);
    return activityLog;
  }
  public async getActivityLogs(pageOptionsDto: ActivityLogPageOptionsDto): Promise<PageDto<ActivityLogEntity> | undefined> {
    const qb = this.ds.createQueryBuilder(ActivityLogEntity, 'activityLog');
    qb.leftJoinAndSelect('activityLog.user', 'user');
    qb.leftJoinAndSelect('user.userProfile', 'userProfile');

    if (pageOptionsDto.userId) {
      qb.andWhere('activityLog.userId = :userId', { userId: pageOptionsDto.userId });
    }
    if (pageOptionsDto.channel) {
      qb.andWhere('activityLog.channel = :channel', { channel: pageOptionsDto.channel });
    }
    if (pageOptionsDto.parentUserId) {
      qb.andWhere('user.parentUserId = :parentUserId', { parentUserId: pageOptionsDto.parentUserId });
    }
    if (pageOptionsDto.partnerId) {
      qb.andWhere('userProfile.partnerId = :partnerId', { partnerId: pageOptionsDto.partnerId });
    }
    if (pageOptionsDto.userFullname) {
      qb.andWhere(`userProfile.firstName LIKE :userFullname`, { userFullname: `%${pageOptionsDto.userFullname}%` });
    }
    if (pageOptionsDto.id) {
      qb.andWhere('activityLog.id LIKE :id', { id: `%${pageOptionsDto.id}%` });
    }
    if (pageOptionsDto.logTitle) {
      qb.andWhere('activityLog.logTitle LIKE :logTitle', { logTitle: `%${pageOptionsDto.logTitle}%` });
    }
    if (pageOptionsDto.logText) {
      qb.andWhere(`activityLog.logText LIKE :logText`, { logText: `%${pageOptionsDto.logText}%` });
    }
    if (pageOptionsDto.ipAddress) {
      qb.andWhere(`activityLog.ipAddress LIKE :ipAddress`, { ipAddress: `%${pageOptionsDto.ipAddress}%` });
    }
    if (pageOptionsDto.createdAtRange) {
      const { start, end } = getStartAndEndDates(pageOptionsDto.createdAtRange);
      qb.andWhere(`activityLog.createdAt BETWEEN :start AND :end`, { start, end });
    }

    // sort
    if (pageOptionsDto.sort && pageOptionsDto.sort === 'userFullname') {
      qb.orderBy(`userProfile.firstName`, pageOptionsDto.order);
    } else {
      qb.orderBy(`activityLog.${pageOptionsDto.sort || 'createdAt'}`, pageOptionsDto.order);
    }
    const [activityLogs, activityLogsCount] = await qb
      .skip((pageOptionsDto.page - 1) * pageOptionsDto.take)
      .take(pageOptionsDto.take)
      .getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: activityLogsCount,
    });
    const data = await activityLogs.map((la) => la.toDto());
    return new PageDto(data, pageMetaDto);
  }
}
