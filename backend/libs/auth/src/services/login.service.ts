import { UserEntity } from '@app/db';
import { DetailResponse } from '@app/shared';
import { GetUserService } from '@app/user';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LoginProcessor } from '../login';

@Injectable()
export class LoginService {
  constructor(private readonly ds: DataSource, private readonly getUserService: GetUserService) {}

  public async login(processor: LoginProcessor): Promise<DetailResponse<{ user: UserEntity }> | DetailResponse<string> | undefined> {
    const qryR = this.ds.createQueryRunner();
    try {
      await qryR.connect();
      await qryR.startTransaction();
      const { phone, email, realm, userId } = await processor.getRequestDto();

      console.log('login processor', phone, email, realm, userId);

      const user = userId ? await this.getUserService.getByUserId(qryR.manager, userId) : await this.getUserService.getByPhoneEmailAndRealm(qryR.manager, realm, phone, email);
      const result = await processor.processUserLogin(user);
      await qryR.commitTransaction();
      if (result?.success) {
        return new DetailResponse({ user });
      }
      return result;
    } catch (error) {
      await qryR.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error?.message || error?.code || error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } finally {
      await qryR.release();
    }
  }
}
