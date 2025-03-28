import { ActivityLogEntity } from '@app/db';
import { BasePageOptionsDto, FilterOperator, PaginateConfig } from '@app/shared';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ActivityLogPageOptionsDto extends BasePageOptionsDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  logTitle?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  userId?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  partnerId?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  parentUserId?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  logText?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  channel?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userFullname?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  createdAtRange?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ipAddress?: string;
}

export class CreateActivityLogDto {
  @IsString()
  logText: string;

  @IsString()
  logTitle: string;

  @IsString()
  ipAddress: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  channel?: string;

  // RELATIONS

  @IsNumber()
  userId: number;
}

export const ActivityLogPageConfig: PaginateConfig<ActivityLogEntity> = {
  sortableColumns: ['id', 'logTitle', 'logText', 'ua', 'user.id', 'createdAt'],
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['id', 'logTitle', 'user.id', 'user.userProfile.id'],
  select: [
    'id',
    'logTitle',
    'logText',
    'ua',
    'ipAddress',
    'userId',
    'createdAt',
    'user.id',
    'user.userProfile.firstName',
    'user.userProfile.lastName',
    ,
    'user.userProfile.middleName',
    'user.userProfile.partnerId',
    'user.userProfile.partner.partnerName',
  ],
  filterableColumns: {
    id: [FilterOperator.EQ],
    userId: [FilterOperator.EQ],
    logTitle: [FilterOperator.ILIKE],
    'user.userProfile.partnerId': [FilterOperator.EQ],
  },
  relations: ['user', 'user.userProfile', 'user.userProfile.partner'],
};
