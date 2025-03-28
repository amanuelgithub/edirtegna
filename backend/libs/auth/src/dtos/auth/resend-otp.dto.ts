import { AccessDeviceEntity, UserAccessEntity, UserEntity } from '@app/db';
import { IAccountSMS } from '@app/notification';
import { IRequestInfo, IsValidMsisdn, getPhoneFormatNational, isEmailValid } from '@app/shared';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResendOtpDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;
}

export class ResendOtpPayload {
  private _phone: string;
  private _email: string;

  private _otpCode?: number;
  private _requestInfo: IRequestInfo;

  // target user
  private _userAccess: UserAccessEntity;
  private _user: UserEntity;

  constructor(dto: ResendOtpDto, requestInfo: IRequestInfo) {
    this._requestInfo = requestInfo;
    if (this._requestInfo.channel === 'APP') {
      const { identifier } = dto;
      if (!new IsValidMsisdn().validate(identifier.trim())) {
        throw new BadRequestException(`The value '${identifier}' is not valid for the field 'phone'`);
      }
      this._phone = getPhoneFormatNational(identifier.trim());
    } else {
      const { identifier } = dto;
      const validEmail = isEmailValid(identifier.trim());
      const validPhone = new IsValidMsisdn().validate(identifier);
      if (!validPhone && !validEmail) {
        throw new UnauthorizedException(`Value '${identifier}' is not valid email or phone number`);
      }
      if (validEmail) {
        this._email = identifier.trim();
      }
      if (validPhone) {
        this._phone = getPhoneFormatNational(identifier.trim());
      }
    }
    this._otpCode = Math.floor(1000 + Math.random() * 9000);
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

  public async isValidResend(user: UserEntity): Promise<boolean | undefined> {
    this._user = user;
    this._userAccess = user?.userAccesses.find((o) => o.accessChannel === this._requestInfo.channel);

    this.userExists();
    this.userAccessExists();
    this.isValidUserStatus();
    return true;
  }

  public getUpdatedUserDetail(): UserEntity {
    const deviceWithHash = this._requestInfo.device.getFormatedUserAgent(this._userAccess.id);
    const verifiedAccessDevice: AccessDeviceEntity = new AccessDeviceEntity({
      ...deviceWithHash,
    });
    const existingDevice = this._userAccess.accessDevices?.find((o) => o.deviceHash === verifiedAccessDevice.deviceHash);
    if (!existingDevice) {
      this._userAccess.accessDevices = [...this._userAccess.accessDevices, verifiedAccessDevice];
    }
    this._userAccess.otpCode = this._otpCode;
    // this._userAccess.status = ACTIVE;
    // this._user.status = ACTIVE;

    this._user.userAccesses = [...this._user.userAccesses, this._userAccess];
    return this._user;
  }

  public getRequestDto() {
    return { phone: this._phone, email: this._email, realm: this._requestInfo.realm, ua: this._requestInfo.device };
  }
  public getSMSDetail(): IAccountSMS {
    if (!this._user) {
      throw new BadRequestException(`Could not locate user detail`);
    }
    const fullName = `${this._user?.userProfile?.firstName} ${this._user?.userProfile?.middleName || ''} ${this._user?.userProfile?.lastName || ''}`?.trim();

    return {
      name: fullName,
      destination: this._user.phone,
      // msg: `your account registration is successful!`,
      subject: `RESEND_OTP`,
      realm: this._requestInfo.realm,
      otpCode: this._otpCode,
      userId: this._user.id,
    };
  }
}
