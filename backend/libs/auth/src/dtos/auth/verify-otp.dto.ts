import { AccessDeviceEntity, UserAccessEntity, UserEntity } from '@app/db';
import { AccessUserAgent, getPhoneFormatNational, IRequestDetail, IRequestInfo, isEmailValid, IsValidMsisdn } from '@app/shared';
import { UnauthorizedException } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  identifier: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  deviceUuid?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1000)
  @Max(9999)
  otp: number;
}
export class VerifyOtpPayload {
  private _phone: string;
  private _email: string;
  private _deviceUuid: string;
  private _otp: number;

  // Request user details...
  private _requestInfo: IRequestInfo;

  // identifications
  userAgent?: AccessUserAgent;
  requestOrigin?: string;
  // target user
  private _userAccess: UserAccessEntity;
  private _user: UserEntity;

  constructor(dto: VerifyOtpDto, requestInfo: IRequestDetail) {
    const { otp, identifier, deviceUuid } = dto;
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
    this._requestInfo = requestInfo;
    this._otp = otp;
    this._deviceUuid = deviceUuid ? deviceUuid : requestInfo?.reqInfo?.origin;
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
  private isVerificationRequested() {
    const { otpCode } = this._userAccess;
    if (!otpCode) {
      throw new UnauthorizedException(`No OTP verification requested or OTP already verified`);
    }
  }
  private async doesOTPVerifyCodeMatch() {
    const { otpCode } = this._userAccess;

    if (otpCode !== this._otp) {
      throw new UnauthorizedException(`Invalid OTP verification code`);
    }
  }
  public getRequestDto() {
    return { phone: this._phone, email: this._email, realm: this._requestInfo.realm };
  }
  public async isValidOTPVerification(user: UserEntity): Promise<boolean | undefined> {
    this._user = user;
    this._userAccess = user?.userAccesses.find((o) => o.accessChannel === this._requestInfo.channel);

    this.userExists();
    this.userAccessExists();
    this.isValidUserStatus();
    this.isVerificationRequested();
    await this.doesOTPVerifyCodeMatch();
    return true;
  }
  public getVerifiedUserDetail(): UserEntity {
    const deviceWithHash = this._requestInfo.device.getFormatedUserAgent(this._userAccess.id);
    const verifiedAccessDevice: AccessDeviceEntity = new AccessDeviceEntity({
      ...deviceWithHash,
    });
    const existingDevice = this._userAccess.accessDevices?.find((o) => o.deviceHash === verifiedAccessDevice.deviceHash);
    if (!existingDevice) {
      this._userAccess.accessDevices = [...this._userAccess.accessDevices, verifiedAccessDevice];
    }
    this._userAccess.status = 'ACTIVE';
    this._userAccess.deviceUuid = this._deviceUuid;
    this._user.status = 'ACTIVE';

    this._userAccess.otpCode = null;
    this._user.userAccesses = [...this._user.userAccesses, this._userAccess];
    return this._user;
  }
}
