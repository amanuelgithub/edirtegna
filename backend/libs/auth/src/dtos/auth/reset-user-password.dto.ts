import { UserAccessEntity, UserEntity } from '@app/db';
import { IAccountSMS } from '@app/notification';
import { IRequestInfo, generateSecret } from '@app/shared';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ResetWebLoginDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  userId: number;
}

export class ResetWebLoginPayload {
  private _userId?: number;

  private _password: string;
  // Request user details...
  private _requestInfo: IRequestInfo;

  // target user
  private _userAccess: UserAccessEntity;
  private _user: UserEntity;

  constructor(dto: ResetWebLoginDto, requestInfo: IRequestInfo) {
    const { userId } = dto;
    this._userId = userId;
    this._requestInfo = requestInfo;
  }
  private userExists() {
    if (!this._user) {
      throw new UnauthorizedException(`Account not registered for the service`);
    }
  }
  private userAccessExists() {
    if (!this._userAccess) {
      throw new UnauthorizedException(`Account not registered for the service or channel`);
    }
  }
  private isValidUserStatus() {
    if (['BLOCKED', 'SUSPENDED'].includes(this._user.status) || ['BLOCKED', 'SUSPENDED'].includes(this._userAccess.status)) {
      throw new UnauthorizedException(`Account is disabled or suspended`);
    }
  }

  public async getUpdatedUserDetail(user: UserEntity): Promise<UserEntity> {
    this._user = user;
    this._userAccess = user?.userAccesses.find((o) => o.accessChannel === this._requestInfo.channel);
    // some validation
    this.userExists();
    this.userAccessExists();
    this.isValidUserStatus();

    // set temporary credential...
    this._password = generateSecret(6);
    this._userAccess.tempSecretHash = await bcrypt.hash(this._password, 12);

    this._user.userAccesses = [...this._user.userAccesses, this._userAccess];
    return this._user;
  }

  public getRequestDto() {
    return { userId: this._userId, ua: this._requestInfo.device };
  }
  public getSMSDetail(): IAccountSMS {
    if (!this._user) {
      throw new BadRequestException(`Could not locate user detail`);
    }
    const fullName = `${this._user?.userProfile?.firstName} ${this._user?.userProfile?.middleName || ''} ${this._user?.userProfile?.lastName || ''}`?.trim();

    return {
      name: fullName,
      destination: this._user.phone,
      subject: `RESET_CREDENTIAL`,
      password: this._password,
      userId: this._user.id,
    };
  }
}
