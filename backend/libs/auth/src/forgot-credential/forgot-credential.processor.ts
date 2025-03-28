import { UserAccessEntity, UserEntity } from '@app/db';
import { IAccountSMS } from '@app/notification';
import { generateSecret, getPhoneFormatNational, IRequestDetail, isEmailValid, IsValidMsisdn } from '@app/shared';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ForgotCredentialDto } from './forgot-credential.dto';

export class ForgotCredentialProcessor {
  private _phone: string;
  private _email: string;
  private _deviceUuid: string;
  private _tempPassword: string;
  private _tempPinCode: number;

  // target user
  private _userAccess: UserAccessEntity;
  private _user: UserEntity;

  constructor(private dto: ForgotCredentialDto, private requestInfo: IRequestDetail) {
    const { identifier, deviceUuid } = dto;
    this._deviceUuid = deviceUuid;

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

  /////
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
  /////
  public async process(user: UserEntity): Promise<UserEntity | undefined> {
    this._user = user;
    this._userAccess = user?.userAccesses.find((o) => o.accessChannel === this.requestInfo.channel);

    this.userExists();
    this.userAccessExists();
    this.isValidUserStatus();

    if (this.requestInfo.channel === 'WEB') {
      const deviceWithHash = this.requestInfo.device.getFormatedUserAgent(this._userAccess.id);
      const accDevice = this._userAccess?.accessDevices.find((o) => o.deviceHash === deviceWithHash?.deviceHash);
      if (accDevice?.deviceHash !== deviceWithHash?.deviceHash && !accDevice)
        throw new UnauthorizedException(`New Device Access detected. Please verify your OTP code for the new device`);
      // all good
      this._tempPassword = generateSecret(6);
      const hash = await bcrypt.hash(this._tempPassword, 12);
      this._userAccess.tempSecretHash = hash;
      // prepare for persistence
      this._user.userAccesses = [...this._user.userAccesses, this._userAccess];
    }
    if (this.requestInfo.channel === 'APP') {
      if (!this._phone) throw new BadRequestException(`Operation requires a valid identifying phone number`);
      if (!this._deviceUuid) throw new BadRequestException(`Operation requires a valid device uuid`);

      const deviceWithHash = this.requestInfo.device.getFormatedUserAgent(this._userAccess.id);
      const accDevice = this._userAccess?.accessDevices.find((o) => o.deviceHash === deviceWithHash?.deviceHash);
      if (this._userAccess?.deviceUuid !== this._deviceUuid && !accDevice)
        throw new UnauthorizedException(`New Device Access detected. Please verify your OTP code for the new device`);
      // all good
      this._tempPinCode = Math.floor(1000 + Math.random() * 9000);
      const hash = await bcrypt.hash(`${this._tempPinCode}`, 12);
      this._userAccess.tempSecretHash = hash;
      // prepare for persistence
      this._user.userAccesses = [...this._user.userAccesses, this._userAccess];
    }
    return this._user;
  }
  public getRequestDto() {
    return { phone: this._phone, email: this._email, realm: this.requestInfo.realm, ua: this.requestInfo.device };
  }
  public getSMSDetail(): IAccountSMS {
    if (!this._user) {
      throw new BadRequestException(`Could not locate user detail`);
    }
    const fullName = `${this._user?.userProfile?.firstName} ${this._user?.userProfile?.middleName || ''} ${this._user?.userProfile?.lastName || ''}`?.trim();

    return {
      name: fullName,
      destination: this._user.phone,
      msg: `Your reset request is processed successfully!`,
      subject: `FORGOT_CREDENTIAL`,
      realm: this.requestInfo.realm,
      password: this._tempPassword,
      pinCode: this._tempPinCode,
      // otpCode: this._otpCode,
      userId: this._user.id,
    };
  }

  /* 

  FORGOT PASSWORD FLOW

  Input: { identifier: string, deviceUuid?: string }
  Public User Access

  1. identifier should be a valid email / phone
  2. get the user & user access from the db using identifier (email / phone)
  3. do checks
    - user must exist
    - user should be allowed to access the channel
    - user must not be blocked or suspended
  4. If current access channel is WEB
    - make sure that the current device hash === web channel device's hash !! (if not throw exception)
    - generate a new password, hash it & store it on the userAccess.tempSecretHash
  5. If current access channel is APP
    - identifier must be phone number
    - deviceUuid must be provided
    - if userAccess.deviceUuid !== deviceUuid !! throw exception
    - generate a new pinCode, hash it & store it on the userAccess.tempSecretHash
  6. persist changes from 4 & 5
  7. send an SMS or Email to the user (the new password or pin)
  8. Respond with 'operation successful'

  CHANGE WEB PASSWORD

  Input:
    {
      identifier: string;
      previousPassword: string;
      newPassword: string;
      confirmPassword: string;
    }
  Authenticated user access

  1. validate the request origin to ensure Web Access
  2. identifier should be a valid email / phone
  3. get the user from the db using identifier (email / phone)
  4. do checks
   - user must exist
   - user should be allowed to access the channel
   - user must not be blocked or suspended
   - newPassword should be equal to confirmPassword
   - if (userAccess.deviceHash !== deviceHash) throw device verification required
   - check if previousPassword matches userAccess.passwordHas else throw invalidPhoneOrEmail error
  5. If all the above goes well, proceed to password change...
     userAccess.passwordHash = await bcrypt.hash(newPassword, 12)
  6. Persist the change at 5 to the db.
  7. Return password updated successfully
  8. Re-issue a new access & refresh tokens

  */
  // private userExists() {
  //   if (!this._user) {
  //     throw new UnauthorizedException(`Account not registered for the service`);
  //   }
  // }
  // private userAccessExists() {
  //   if (!this._userAccess) {
  //     throw new UnauthorizedException(`Account not registered for the service or channel`);
  //   }
  // }
  // private isValidUserStatus() {
  //   if (['BLOCKED', 'SUSPENDED'].includes(this._user.status) || ['BLOCKED', 'SUSPENDED'].includes(this._userAccess.status)) {
  //     throw new UnauthorizedException(`Account is disabled or suspended`);
  //   }
  // }
  // private async doesExistingCredentialMatch() {
  //   const { secretHash } = this._userAccess;
  //   const { previousCredential } = this._previousAndNewCredential;
  //   const isMatchingPassword = await bcrypt.compare(previousCredential, secretHash);
  //   if (!isMatchingPassword) {
  //     throw new UnauthorizedException(`Invalid Account Access Detail(s) provided`);
  //   }
  // }
  // private async isCredentialSimilarToPrevious() {
  //   const { tempSecretHash } = this._userAccess;
  //   const { newCredential } = this._previousAndNewCredential;
  //   const newPasswordMatch = tempSecretHash && (await bcrypt.compare(newCredential, tempSecretHash));
  //   if (newPasswordMatch) {
  //     throw new UnauthorizedException(`Failed to set your new password. Please provide a diffrent password from your previous one.`);
  //   }
  // }

  // public async isValidChangeCredential(user: UserEntity): Promise<boolean | undefined> {
  //   this._user = user;
  //   this._userAccess = user?.userAccesses.find((o) => o.accessChannel === this._requestInfo.channel);

  //   this.userExists();
  //   this.userAccessExists();
  //   this.isValidUserStatus();
  //   await this.doesExistingCredentialMatch();
  //   await this.isCredentialSimilarToPrevious();
  //   this._userAccess.secretHash = await bcrypt.hash(this._previousAndNewCredential.newCredential, 12);

  //   return true;
  // }

  // public getUpdatedUserDetail(): UserEntity {
  //   const deviceWithHash = this._requestInfo.device.getFormatedUserAgent(this._userAccess.id);
  //   const verifiedAccessDevice: AccessDeviceEntity = new AccessDeviceEntity({
  //     ...deviceWithHash,
  //   });
  //   const existingDevice = this._userAccess.accessDevices?.find((o) => o.deviceHash === verifiedAccessDevice.deviceHash);
  //   if (!existingDevice) {
  //     this._userAccess.accessDevices = [...this._userAccess.accessDevices, verifiedAccessDevice];
  //   }
  //   this._userAccess.status = 'ACTIVE';
  //   this._user.status = 'ACTIVE';

  //   this._user.userAccesses = [...this._user.userAccesses, this._userAccess];
  //   return this._user;
  // }

  // public getRequestDto() {
  //   return { userId: this._requestInfo.createdBy };
  // }
}
