import { AccessDeviceEntity, UserAccessEntity, UserEntity } from '@app/db';
import { DetailResponse, IRequestInfo, IsValidMsisdn, generateSecret, getPhoneFormatNational, isEmailValid } from '@app/shared';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPreviousAndNewCredential } from '../change-credential';
import { ForgotCredentialDto } from './set-credential.dto';

export class NewDeviceDetectedException extends HttpException {
  constructor() {
    super(`New Device Access detected. Please verify your OTP code for the new device`, 416);
  }
}

export class ForgotCredentialProcessor {
  private _phone: string;
  private _email: string;
  private _deviceUuid: string;
  private _password: string;
  private _pinCode: string;

  private _previousAndNewCredential: IPreviousAndNewCredential;

  // Request user details...
  private _requestInfo: IRequestInfo;
  // target user
  private _userAccess: UserAccessEntity;
  private _user: UserEntity;

  private _detailResponse: DetailResponse<any>;
  constructor(dto: ForgotCredentialDto, requestInfo: IRequestInfo) {
    this._requestInfo = requestInfo;
    // this._previousAndNewCredential = dto.getPreviousAndNewCredential();

    // if ('pinCode' in dto) {
    //   const { phone } = dto;
    //   if (!new IsValidMsisdn().validate(phone.trim())) {
    //     throw new BadRequestException(`The value '${phone}' is not valid for the field 'phone'`);
    //   }

    //   this._phone = getPhoneFormatNational(phone.trim());
    // } else {
    const { identifier, deviceUuid } = dto;
    this._deviceUuid = deviceUuid;
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
    // }
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
    const { tempSecretHash } = this._userAccess;
    const { previousCredential } = this._previousAndNewCredential;
    const prevPasswordMatch = tempSecretHash && (await bcrypt.compare(previousCredential, tempSecretHash));
    if (!prevPasswordMatch) {
      this._detailResponse = new DetailResponse(null, `Invalid Account Access Detail(s) provided`, false, 401);
      throw new UnauthorizedException(`Invalid Account Access Detail(s) provided`);
    }
  }
  private async isCredentialSimilarToPrevious() {
    const { tempSecretHash } = this._userAccess;
    const { newCredential } = this._previousAndNewCredential;
    const newPasswordMatch = tempSecretHash && (await bcrypt.compare(newCredential, tempSecretHash));
    if (newPasswordMatch) {
      this._detailResponse = new DetailResponse(null, `Failed to set your new password. Please provide a diffrent password from your previous one.`, false, 401);
      throw new UnauthorizedException(`Failed to set your new password. Please provide a diffrent password from your previous one.`);
    }
  }

  public async isValidSetCredential(user: UserEntity): Promise<boolean | undefined> {
    try {
      this._user = user;
      this._userAccess = user?.userAccesses.find((o) => o.accessChannel === this._requestInfo.channel);

      // check if user exists
      this.userExists();
      this.userAccessExists();
      this.isValidUserStatus();
      // Check if user is allowed APP channel

      //
      //
      //
      //
      //
      //
      // WEB Access Set password
      if (this._requestInfo.channel === 'WEB') {
        // New device login for web login
        // const { deviceHash } = formatUserAgent(userAgent, existingUser.id);
        const deviceWithHash = this._requestInfo.device.getFormatedUserAgent(this._userAccess.id);

        // if (userAccess.deviceHash !== deviceHash) {
        //   throw new NewDeviceDetectedException();
        // }

        this._password = generateSecret(6);
        // userAccess.passwordHash = await bcrypt.hash(this._password, 12);
        this._userAccess.tempSecretHash = await bcrypt.hash(this._password, 12);
        // userAccess.type = CredentialType.SYS_SET;
      }
      // App Access set pin
      //   if (accessChannel === 'APP') {
      if (this._requestInfo.channel === 'APP') {
        // PIN and phone required
        // if (identifierType !== 'PHONE') {
        if (!this._phone) {
          //   return {
          //     success: false,
          //     message: `Operation requires a valid identifying phone number`,
          //     statusCode: 414, // 'PHONE_AND_PIN_REQUIRED',
          //     // user: existingUser,
          //   };
        }
        if (!this._deviceUuid) {
          console.log(`..... Operation requires a valid device uuid...`);
          // return {
          //   success: false,
          //   message: `Operation requires a valid device uuid`,
          //   statusCode: 426, // 'MISSIG_DEVICE_ID',
          //   // user: existingUser,
          // };
        }
        // New device login for app login
        if (this._userAccess.deviceUuid !== this._deviceUuid) {
          throw new NewDeviceDetectedException();
        }

        // existingUser.tempPinCode = tempPinCode;
        // existingUser.pinCode = null;
        this._pinCode = `${Math.floor(1000 + Math.random() * 9000)}`;
        // userAccess.type = CredentialType.SYS_SET;
        // userAccess.pinCode = pinCode;
        this._userAccess.tempSecretHash = await bcrypt.hash(`${this._pinCode}`, 12);
      }

      //
      //
      //
      //
      //
      //
      //   await this.doesTempCredentialMatch();
      //   await this.isCredentialSimilarToPrevious();
      //   this._userAccess.secretHash = await bcrypt.hash(this._previousAndNewCredential.newCredential, 12);

      this._detailResponse = new DetailResponse(null, `Password set successfully`, true, 200);
      return true;
    } catch (error) {
      console.log('error: isvalidcredset', error);
      this._detailResponse = new DetailResponse(null, error?.message || error?.code, false, 401);
      return false;
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
    // this._userAccess.status = 'ACTIVE';
    // this._userAccess.tempSecretHash = '';
    // this._user.status = 'ACTIVE';

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
