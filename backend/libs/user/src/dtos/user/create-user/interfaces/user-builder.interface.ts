import { UserEntity } from '@app/db';
import { IAccountSMS } from '@app/notification';
import { Channel } from '@app/shared';
import { EntityManager } from 'typeorm';

export interface IUserBuilder {
  getUser(m?: EntityManager): Promise<UserEntity>;
  getNotificationDetail(userId: number): IAccountSMS;
}
