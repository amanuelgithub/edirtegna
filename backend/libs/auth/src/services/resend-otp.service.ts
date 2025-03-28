import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DetailResponse } from '@app/shared';
import { DataSource } from 'typeorm';
import { ResendOtpPayload } from '../dtos';
import { UserNotificationService } from '@app/notification';
import { UserEntity } from '@app/db';
import { GetUserService } from '@app/user';

@Injectable()
export class ResendOtpService {
  constructor(private readonly ds: DataSource, private readonly notify: UserNotificationService, private readonly getUserService: GetUserService) {}

  public async resend(payload: ResendOtpPayload): Promise<DetailResponse<UserEntity> | undefined> {
    const qryR = this.ds.createQueryRunner();
    try {
      await qryR.connect();
      await qryR.startTransaction();

      const { realm, phone, email, ua } = await payload.getRequestDto();
      const user = await this.getUserService.getByPhoneEmailAndRealm(qryR.manager, realm, phone, email);
      let updatedUser;
      if (await payload.isValidResend(user)) {
        const verifiedUser = payload.getUpdatedUserDetail();
        updatedUser = await qryR.manager.save(verifiedUser);
      }
      await qryR.commitTransaction();
      const smsDetail = payload.getSMSDetail();
      await this.notify.sendAuthSMS(smsDetail);
      await this.notify.sendResendOTPEmail(updatedUser, smsDetail.otpCode, ua);
      return new DetailResponse();
    } catch (error) {
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
