import { NotificationEntity } from '@app/db';
import { KeysOf, NOTIFICATION_STATUS, NOTIFICATION_TYPE, NotificationStatus, NotificationType } from '@app/shared';
import { copyConfig, FilterOperator, PaginateConfig, SelectOneConfig } from '@app/shared/paginate';
import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateNotificationDto {
  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsString()
  destination: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsIn(KeysOf(NOTIFICATION_TYPE))
  type?: NotificationType;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsIn(KeysOf(NOTIFICATION_STATUS))
  status?: NotificationStatus;

  @IsNumber()
  @Type(() => Number)
  userId?: number;
}

export class UpdateNotificationDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsIn(KeysOf(NOTIFICATION_STATUS))
  status?: NotificationStatus;
}

export const NotificationPageConfig: PaginateConfig<NotificationEntity> = {
  sortableColumns: ['id', 'subject', 'destination', 'type', 'status', 'createdAt', 'updatedAt'],
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['subject', 'type', 'destination', 'status'],
  select: ['id', 'subject', 'type', 'destination', 'status', 'user.id', 'user.userProfile.firstName', 'user.userProfile.middleName', 'user.userProfile.lastName', 'createdAt'],
  filterableColumns: {
    destination: [FilterOperator.ILIKE],
    createdAt: [FilterOperator.BTW],
    subject: [FilterOperator.ILIKE],
    id: [FilterOperator.ILIKE],
    type: [FilterOperator.EQ],
    status: [FilterOperator.EQ],
    'user.userProfile.firstName': [FilterOperator.ILIKE],
    'user.userProfile.middleName': [FilterOperator.ILIKE],
    'user.userProfile.lastName': [FilterOperator.ILIKE],
  },
  relations: ['user', 'user.userProfile'],
};

export const NotificationSelectOneConfig = copyConfig(NotificationPageConfig) as SelectOneConfig<NotificationEntity>;
