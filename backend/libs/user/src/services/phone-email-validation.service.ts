import { Realm } from '@app/shared';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PhoneEmailValidationPayload, PhoneEmailValidationRespDto } from '../dtos';
import { CommonUserService } from './common-user.service';

@Injectable()
export class PhoneAndEmailValidationService {
  constructor(private readonly ds: DataSource, private readonly common: CommonUserService) {}

  public async validate(payload: PhoneEmailValidationPayload): Promise<PhoneEmailValidationRespDto | undefined> {
    const qryR = this.ds.createQueryRunner();
    try {
      await qryR.connect();
      const { id, email, phone, realm } = await payload.getParameters();
      let isPhoneUsed = false,
        isEmailUsed = false;
      if (phone) {
        isPhoneUsed = await this.common.isPhoneAlreadyUsed(qryR.manager, realm as Realm, phone, id);
      }
      if (email) {
        isEmailUsed = await this.common.isEmailAlreadyUsed(qryR.manager, realm as Realm, email, id);
      }
      return { email: isEmailUsed, phone: isPhoneUsed };
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
