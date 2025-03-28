import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DetailResponse } from '@app/shared';
import { DataSource } from 'typeorm';
import { UserEntity } from '@app/db';
import { UserNotificationService } from '@app/notification';
import { GetUserService } from '@app/user';
import { ResetWebLoginPayload } from '../dtos';

@Injectable()
export class ResetUserPasswordService {
  constructor(private readonly ds: DataSource, private readonly notify: UserNotificationService, private readonly getUserService: GetUserService) {}

  public async reset(payload: ResetWebLoginPayload): Promise<DetailResponse<UserEntity> | undefined> {
    const qryR = this.ds.createQueryRunner();
    try {
      await qryR.connect();
      await qryR.startTransaction();

      const { userId, ua } = await payload.getRequestDto();
      const user = await this.getUserService.getByUserId(qryR.manager, userId);

      const _user = await payload.getUpdatedUserDetail(user);
      const updatedUser = await qryR.manager.save(_user);

      await qryR.commitTransaction();
      const smsDetail = payload.getSMSDetail();
      await this.notify.sendAuthSMS(smsDetail);
      await this.notify.sendResetPasswordEmail(updatedUser, smsDetail.password, ua);

      return new DetailResponse(updatedUser);
    } catch (error) {
      await qryR.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error?.message || error?.code, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } finally {
      await qryR.release();
    }
  }
}
