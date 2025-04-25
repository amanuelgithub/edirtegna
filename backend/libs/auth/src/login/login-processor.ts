import { ApiKeyLoginDto, IApiKeyParts, PasswordLoginDto, PinLoginDto } from '@app/auth/login';
import { UserAccessEntity, UserEntity } from '@app/db';
import { compareApiKeys, DetailResponse, ERR_RESET_CREDENTIAL, ERR_VERIFY_OTP, getPhoneFormatNational, IRequestInfo, isEmailValid, IsValidMsisdn } from '@app/shared';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export class LoginProcessor {
  private _identifier?: string;
  private _credential?: string;
  private _deviceUuid?: string;

  private _userId?: number;
  private _phone?: string;
  private _email?: string;

  // Request user details...
  private _requestInfo: IRequestInfo;

  // target user
  private _userAccess: UserAccessEntity;
  private _user: UserEntity;

  constructor(dto: PinLoginDto | PasswordLoginDto | ApiKeyLoginDto, requestInfo: IRequestInfo) {
    this._requestInfo = requestInfo;
    if ('pinCode' in dto) {
      const { phone, pinCode, deviceUuid } = dto;
      if (!new IsValidMsisdn().validate(phone.trim())) {
        throw new BadRequestException(`The value '${phone}' is not valid for the field 'phone'`);
      }
      this._phone = getPhoneFormatNational(phone.trim());
      this._deviceUuid = deviceUuid;
      this._identifier = `${this._phone}`;
      this._credential = `${pinCode}`;
    } else if ('key' in dto) {
      const { key } = dto;
      const { userId } = this.getParsedApiKey(key);
      this._credential = `${key}`;
      this._userId = userId;
      ////
    } else {
      const { identifier, password } = dto;
      const validEmail = isEmailValid(identifier.trim());
      const validPhone = new IsValidMsisdn().validate(identifier);
      if (!validPhone && !validEmail) {
        throw new UnauthorizedException(`Value '${identifier}' is not valid email or phone number`);
      }
      if (validEmail) {
        this._email = identifier.trim();
        this._identifier = this._email;
      }
      if (validPhone) {
        this._phone = getPhoneFormatNational(identifier.trim());
        this._identifier = this._phone;
      }
      // this._password = password;
      this._credential = `${password}`;
    }
  }

  /////
  // API Access
  private getParsedApiKey(apiKey: string): IApiKeyParts {
    if (!apiKey) throw new BadRequestException(`Invalid API Key`);
    const parts = Buffer.from(apiKey, 'base64').toString('utf8').split(':');
    if (!parts || parts.length !== 3) {
      throw new UnauthorizedException(`1-Invalid API Key`);
    }
    const userId = parts[0]; // userid
    const apiClientId = parts[1]; // apiClientId
    const key = parts[2]; // secret

    const regexExpV4 = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    // console.log('--------------------------------------------', parts);
    if (isNaN(Number(userId)) || !regexExpV4.test(apiClientId) || key.length !== 32) {
      throw new UnauthorizedException(`2-Invalid API Key`);
    }
    return { apiClientId, userId: +userId, key };
  }
  private doesApiCredentialMatch() {
    const { secretHash } = this._userAccess;
    const isMatchingApiKey = compareApiKeys(secretHash, this._credential);

    if (!isMatchingApiKey) {
      throw new UnauthorizedException(`5-Invalid Account Access Detail(s) provided`);
    }
    return this.isApiUrlValid();
  }
  private isApiUrlValid() {
    const { allowedUrls } = this._userAccess;
    const { ip } = this._requestInfo;

    // check source url
    const isRegisteredIp = allowedUrls.split(',').includes(ip);
    // console.log('isRegisteredIp', isRegisteredIp);
    const isRegisteredOrigin = allowedUrls.split(',').includes(origin);
    // console.log('isRegisteredOrigin', isRegisteredOrigin);
    const isRegisteredUrl = isRegisteredIp || isRegisteredOrigin;
    // console.log('isRegisteredUrl', isRegisteredUrl);
    // console.log('ipAddress', ipAddress);

    const isDevelopmentEnv = process.env.NODE_ENV === 'development';
    // console.log('isDevelopmentEnv', isDevelopmentEnv);
    //  const isDevOrigin = isDevelopmentEnv && ['::ffff:172.18.0.1'].includes(ip);
    // console.log(`['::ffff:172.18.0.1'].includes(ipAddress)`, ['::ffff:172.18.0.1'].includes(ipAddress));

    if (!isRegisteredUrl && !isDevelopmentEnv) {
      throw new UnauthorizedException(`Invalid Credential Provided / Not Registered Client`);
    }

    // if (!isMatchingApiKey) {
    //   throw new UnauthorizedException(`2-Invalid Account Access Detail(s) provided`);
    // }
    return new DetailResponse(null);
  }

  /////

  private userExists() {
    if (!this._user) {
      throw new UnauthorizedException(`1-Invalid Account Access Detail(s) provided`);
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
  public isAccountVerified() {
    if (['PENDING'].includes(this._user.status) || ['PENDING'].includes(this._userAccess.status)) {
      return new DetailResponse({ identifier: this._identifier }, `Account not verified. Please verify and activate your account access`, false, ERR_VERIFY_OTP);
    }
    return new DetailResponse(null);
  }

  // public isNewDeviceLogin() {
  //   ////
  //   const { accessChannel } = this._userAccess;
  //   console.log(`\n accessChannel:`, accessChannel);
  //   const deviceWithHash = this._requestInfo.device.getFormatedUserAgent(this._userAccess.id);
  //   console.log(`\n deviceWithHash:`, deviceWithHash);
  //   const accDevice = this._userAccess?.accessDevices.find((o) => o.deviceHash === deviceWithHash?.deviceHash);
  //   // const { deviceUuid } = this._userAccess;
  //   // app...
  //   if (accessChannel === 'APP' && this._userAccess?.deviceUuid !== this._deviceUuid) {
  //     console.log(`\n APP----accDevice:`, accDevice);
  //     // throw new UnauthorizedException(`New Device Access detected. Please verify your OTP code for the new device`);
  //     return new DetailResponse({ identifier: this._identifier }, `New Device Access detected. Please verify your OTP code for the new device`, false, 416);
  //   }
  //   // web...
  //   if (accessChannel === 'WEB' && accDevice?.deviceHash !== deviceWithHash?.deviceHash && !accDevice) {
  //     console.log(`\n WEB------accDevice:`, accDevice);
  //     // throw new UnauthorizedException(`New Device Access detected. Please verify your OTP code for the new device`);
  //     return new DetailResponse({ identifier: this._identifier }, `New Device Access detected. Please verify your OTP code for the new device`, false, 416);
  //   }
  //   return new DetailResponse(null);
  // }
  public isValidCredentialSet() {
    const { secretHash, tempSecretHash, accessChannel } = this._userAccess;
    if (!['WEB', 'API', 'APP'].includes(accessChannel)) {
      throw new UnauthorizedException(`Account Access not permitted for the channel`);
    }
    if (!secretHash && tempSecretHash) {
      return new DetailResponse({ identifier: this._identifier }, `Account_ access credential reset required`, false, ERR_RESET_CREDENTIAL);
    }
    return new DetailResponse(null);
  }

  private async doesCredentialMatch() {
    const { secretHash, tempSecretHash, accessChannel } = this._userAccess;
    console.log(`\n secretHash:`, secretHash);
    console.log(`\n tempSecretHash:`, tempSecretHash);
    console.log(`\n accessChannel:`, accessChannel);
    console.log(`\n this._credential:`, this._credential);
    if (accessChannel === 'API') {
      return this.doesApiCredentialMatch();
    }
    const isMatchingPassword = secretHash && (await bcrypt.compare(this._credential, secretHash));
    // user is logging in with new resetted pass
    const isMatchingTempPassword = tempSecretHash && (await bcrypt.compare(this._credential, tempSecretHash));
    console.log('...', isMatchingPassword, isMatchingTempPassword);
    if (!isMatchingPassword && !isMatchingTempPassword) {
      // throw new UnauthorizedException(`2-Invalid Account Access Detail(s) provided`);
      return new DetailResponse({ identifier: this._identifier }, `2-Invalid Account Access Detail(s) provided`, false, 401);
    }
    if (!isMatchingPassword && isMatchingTempPassword) {
      if (['PENDING'].includes(this._user.status) || ['PENDING'].includes(this._userAccess.status)) {
        return new DetailResponse({ identifier: this._identifier }, `Account not verified. Please verify and activate your account access`, false, ERR_VERIFY_OTP);
      }
      return new DetailResponse({ identifier: this._identifier }, `-Account access credential reset required`, false, ERR_RESET_CREDENTIAL);
    }
    return new DetailResponse(null);
  }
  public async processUserLogin(user: UserEntity): Promise<DetailResponse<string>> {
    this._user = user;
    this._userAccess = user?.userAccesses.find((o) => o.accessChannel === this._requestInfo.channel);
    console.log('....... user access....', this._userAccess);
    this.userExists();
    this.userAccessExists();
    this.isValidUserStatus();
    const isVerified = this.isAccountVerified();
    const isCredValid = this.isValidCredentialSet();

    console.log('isVerified', isVerified);
    console.log('isCredValid', isCredValid);
    const doesCredMatch = await this.doesCredentialMatch();
    console.log('doesCredMatch', doesCredMatch);
    // const isNewDevice = this.isNewDeviceLogin();
    // console.log('isNewDevice', isNewDevice);
    // if (!isVerified.success) {
    if (!isVerified.success && doesCredMatch.success) {
      return isVerified;
    }
    if (!isCredValid.success && doesCredMatch.success) {
      return isCredValid;
    }
    // const doesCredMatch = await this.doesCredentialMatch();
    if (!doesCredMatch.success) {
      return doesCredMatch;
    }
    // if (!isNewDevice.success) {
    // return isNewDevice;
    // }
    return new DetailResponse('valid');
  }
  public getRequestDto() {
    return { phone: this._phone, email: this._email, realm: this._requestInfo.realm, userId: this._userId };
  }
}
