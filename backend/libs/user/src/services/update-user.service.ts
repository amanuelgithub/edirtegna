import { UserEntity } from '@app/db';
import { DetailResponse, ObjectUtil } from '@app/shared';
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UpdateUserPayload, UpdateUserStatusPayload } from '../dtos';
import { CommonUserService } from './common-user.service';
import { GetUserService } from './get-user.service';

@Injectable()
export class UpdateUserService {
  constructor(private readonly ds: DataSource, private readonly common: CommonUserService, private readonly getUserService: GetUserService) {}

  public async updateUser(payload: UpdateUserPayload): Promise<DetailResponse<UserEntity> | undefined> {
    const qryR = this.ds.createQueryRunner();

    try {
      await qryR.connect();
      await qryR.startTransaction();

      const updatePayload = payload.getUpdatePayload();
      const user = await this.getUserService.getByUserId(qryR.manager, updatePayload.id);
      const _user = ObjectUtil.deepMerge(user, updatePayload);

      if (!user) {
        throw new BadRequestException(`Requested user not found`);
      }
      let isPhoneUsed = false,
        isEmailUsed = false;
      if (updatePayload.phone) {
        isPhoneUsed = await this.common.isPhoneAlreadyUsed(qryR.manager, user?.realm, updatePayload.phone, user.id);
      }
      if (updatePayload.email) {
        isEmailUsed = await this.common.isEmailAlreadyUsed(qryR.manager, user?.realm, updatePayload.email, user.id);
      }

      payload.validateUpdate(user, isPhoneUsed, isEmailUsed);
      const updatedUser = await qryR.manager.save(UserEntity, { ..._user });
      await qryR.commitTransaction();
      // payload.deleteOldProfilePic();
      return new DetailResponse(updatedUser);
    } catch (error) {
      await qryR.rollbackTransaction();
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error?.message || error?.code, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } finally {
      await qryR.release();
    }
  }

  public async updateUserStatus(payload: UpdateUserStatusPayload) {
    const qryR = this.ds.createQueryRunner();
    try {
      await qryR.connect();
      await qryR.startTransaction();

      const updatePayload = await payload.getUpdateStatusPayload();
      const user = await this.getUserService.getByUserId(qryR.manager, updatePayload.id);
      const _user = await qryR.manager.preload(UserEntity, { id: updatePayload.id, ...updatePayload });

      if (!user) {
        throw new BadRequestException(`Requested user not found`);
      }

      const updatedUser = await qryR.manager.save(UserEntity, { ..._user });

      await qryR.commitTransaction();

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

  public async delete(id: number): Promise<DetailResponse<UserEntity> | undefined> {
    const qryR = this.ds.createQueryRunner();
    try {
      await qryR.connect();
      await qryR.startTransaction();

      const user = await this.getUserService.getByUserId(qryR.manager, id);

      if (!user) {
        throw new BadRequestException(`Requested user not found`);
      }

      await qryR.manager.getRepository(UserEntity).softDelete(id);

      await qryR.commitTransaction();

      return new DetailResponse(user);
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
