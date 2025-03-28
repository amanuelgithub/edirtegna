import { UserEntity } from '@app/db';
import { DetailResponse } from '@app/shared';
import { GetUserService } from '@app/user';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ChangeOwnCredentialProcessor } from '../change-credential';

@Injectable()
export class ChangeOwnCredentialService {
  constructor(private readonly ds: DataSource, private readonly getUserService: GetUserService) {}

  public async change(payload: ChangeOwnCredentialProcessor): Promise<DetailResponse<UserEntity> | undefined> {
    const qryR = this.ds.createQueryRunner();
    try {
      await qryR.connect();
      await qryR.startTransaction();

      const { userId } = await payload.getRequestDto();
      const user = await this.getUserService.getByUserId(qryR.manager, userId);
      let updatedUser;
      if (await payload.isValidChangeCredential(user)) {
        const verifiedUser = payload.getUpdatedUserDetail();
        updatedUser = await qryR.manager.save(verifiedUser);
      }
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
}
