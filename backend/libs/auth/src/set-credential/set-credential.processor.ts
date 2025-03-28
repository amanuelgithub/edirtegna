import { AccessDeviceEntity, UserAccessEntity, UserEntity } from '@app/db';
import { DetailResponse, IRequestInfo, IsValidMsisdn, getPhoneFormatNational, isEmailValid } from '@app/shared';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPreviousAndNewCredential } from '../change-credential';
import { SetPasswordDto, SetPinCodeDto } from './set-credential.dto';

export class SetCredentialProcessor {
  private _phone: string;
  private _email: string;
  private _deviceUuid: string;

  private _previousAndNewCredential: IPreviousAndNewCredential;

  // Request user details...
  private _requestInfo: IRequestInfo;
  // target user
  private _userAccess: UserAccessEntity;
  private _user: UserEntity;

  private _detailResponse: DetailResponse<any>;
  constructor(dto: SetPinCodeDto | SetPasswordDto, requestInfo: IRequestInfo) {
    this._requestInfo = requestInfo;
    this._previousAndNewCredential = dto.getPreviousAndNewCredential();

    if ('pinCode' in dto) {
      const { phone, deviceUuid } = dto;
      if (!new IsValidMsisdn().validate(phone.trim())) {
        throw new BadRequestException(`The value '${phone}' is not valid for the field 'phone'`);
      }

      this._phone = getPhoneFormatNational(phone.trim());
      this._deviceUuid = deviceUuid;
    } else {
      const { identifier } = dto;
      const validEmail = isEmailValid(identifier.trim());
      const validPhone = new IsValidMsisdn().validate(identifier);
      if (!validPhone && !validEmail) {
        this._detailResponse = new DetailResponse(null, `Value '${identifier}' is not valid email or phone number`, false, 401);
        throw new UnauthorizedException(`Value '${identifier}' is not valid email or phone number`);
      }
      if (validEmail) {
        this._email = identifier.trim();
      }
      if (validPhone) {
        this._phone = getPhoneFormatNational(identifier.trim());
      }
      this._deviceUuid = 'requestOrigin';
    }
  }
  private userExists() {
    if (!this._user) {
      this._detailResponse = new DetailResponse(null, `Account not registered for the service`, false, 401);
      throw new UnauthorizedException(`Account not registered for the service`);
    }
  }
  private userAccessExists() {
    if (!this._userAccess) {
      this._detailResponse = new DetailResponse(null, `Account not registered for the service or channel`, false, 401);
      throw new UnauthorizedException(`Account not registered for the service or channel`);
    }
  }
  private isValidUserStatus() {
    if (['BLOCKED', 'SUSPENDED'].includes(this._user.status) || ['BLOCKED', 'SUSPENDED'].includes(this._userAccess.status)) {
      this._detailResponse = new DetailResponse(null, `Account is disabled or suspended`, false, 401);
      throw new UnauthorizedException(`Account is disabled or suspended`);
    }
  }
  private async doesTempCredentialMatch() {
    const { tempSecretHash, secretHash } = this._userAccess;
    const { previousCredential } = this._previousAndNewCredential;
    const prevPasswordMatch = (tempSecretHash || secretHash) && (await bcrypt.compare(previousCredential, tempSecretHash || secretHash));
    if (!prevPasswordMatch) {
      this._detailResponse = new DetailResponse(null, `Invalid Account Access Detail(s) provided`, false, 401);
      throw new UnauthorizedException(`Invalid Account Access Detail(s) provided`);
    }
  }
  private async isCredentialSimilarToPrevious() {
    const { tempSecretHash, secretHash } = this._userAccess;
    const { newCredential } = this._previousAndNewCredential;
    const newPasswordMatch = tempSecretHash && (await bcrypt.compare(newCredential, tempSecretHash || secretHash));
    console.log('newPasswordMatch: ', newPasswordMatch);
    if (newPasswordMatch) {
      this._detailResponse = new DetailResponse(null, `Failed to set your new password. Please provide a diffrent password from your previous one.`, false, 401);
      throw new UnauthorizedException(`Failed to set your new password. Please provide a diffrent password from your previous one.`);
    }
  }

  public async isValidSetCredential(user: UserEntity): Promise<boolean | undefined> {
    try {
      this._user = user;
      this._userAccess = user?.userAccesses.find((o) => o.accessChannel === this._requestInfo.channel);

      this.userExists();
      this.userAccessExists();
      this.isValidUserStatus();
      await this.doesTempCredentialMatch();
      await this.isCredentialSimilarToPrevious();
      //////
      // web device...
      // if (this._requestInfo.channel === 'WEB' && this._userAccess.deviceUuid !== this._deviceUuid) {
      //   console.log('here...');
      //   throw new UnauthorizedException(`New Device Access detected. Please verify your OTP code for the new device`);

      //   // return {
      //   //   success: false,
      //   //   message: `New Device Access detected. Please verify your OTP code for the new device`,
      //   //   statusCode: 416, //'NEW_DEVICE_LOGIN',
      //   //   user: existingUser,
      //   // };
      // }
      //////

      this._userAccess.secretHash = await bcrypt.hash(this._previousAndNewCredential.newCredential, 12);
      this._detailResponse = new DetailResponse(null, `Password set successfully`, true, 200);
      return true;
    } catch (error) {
      console.log('error: isvalidcredset', error);
      this._detailResponse = new DetailResponse(null, error?.message || error?.code, false, 401);
      // return false;
      throw error;
    }
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
    this._userAccess.status = 'ACTIVE';
    this._userAccess.tempSecretHash = '';
    this._user.status = 'ACTIVE';

    this._user.userAccesses = [...this._user.userAccesses, this._userAccess];
    return this._user;
  }

  public getRequestDto() {
    return { phone: this._phone, email: this._email, realm: this._requestInfo.realm };
  }
  public getDetailRespDto() {
    return this._detailResponse;
  }
}
