import { UserEntity } from '@app/db';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IUserBuilder } from '../dtos';
import { CommonUserService } from './common-user.service';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly ds: DataSource,
    private readonly common: CommonUserService,
  ) {}

  public async createUser(builder: IUserBuilder): Promise<UserEntity | undefined> {
    const qryR = this.ds.createQueryRunner();
    try {
      await qryR.connect();
      await qryR.startTransaction();
      const _user = await builder.getUser(qryR.manager);
      if (_user.id) {
        await qryR.commitTransaction();
        console.log('existing _user', JSON.stringify(_user));
        return _user;
      }

      if (await this.common.isEmailAlreadyUsed(qryR.manager, _user?.realm, _user.email)) {
        throw new HttpException(`Email is already used`, HttpStatus.BAD_REQUEST);
      }

      if (await this.common.isPhoneAlreadyUsed(qryR.manager, _user?.realm, _user.phone)) {
        throw new HttpException(`Phone number is already used`, HttpStatus.BAD_REQUEST);
      }

      const user = await qryR.manager.save(UserEntity, _user);

      await qryR.commitTransaction();

      return user;
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
