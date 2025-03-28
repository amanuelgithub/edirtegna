import { AccessDeviceEntity, UserAccessEntity, UserEntity } from '@app/db';
import { IRequestInfo } from '@app/shared';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ChangeOwnPasswordDto } from './change-own-password.dto';
import { IPreviousAndNewCredential } from './previous-new-credential';

export class ChangeOwnCredentialProcessor {
  private _previousAndNewCredential: IPreviousAndNewCredential;
  private _requestInfo: IRequestInfo;

  // target user
  private _userAccess: UserAccessEntity;
  private _user: UserEntity;

  constructor(dto: ChangeOwnPasswordDto, requestInfo: IRequestInfo) {
    this._previousAndNewCredential = dto.getPreviousAndNewCredential();
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
  private async doesExistingCredentialMatch() {
    const { secretHash } = this._userAccess;
    const { previousCredential } = this._previousAndNewCredential;
    const isMatchingPassword = await bcrypt.compare(previousCredential, secretHash);
    if (!isMatchingPassword) {
      throw new UnauthorizedException(`Invalid Account Access Detail(s) provided`);
    }
  }
  private async isCredentialSimilarToPrevious() {
    const { tempSecretHash } = this._userAccess;
    const { newCredential } = this._previousAndNewCredential;
    const newPasswordMatch = tempSecretHash && (await bcrypt.compare(newCredential, tempSecretHash));
    if (newPasswordMatch) {
      throw new UnauthorizedException(`Failed to set your new password. Please provide a diffrent password from your previous one.`);
    }
  }

  public async isValidChangeCredential(user: UserEntity): Promise<boolean | undefined> {
    this._user = user;
    this._userAccess = user?.userAccesses.find((o) => o.accessChannel === this._requestInfo.channel);

    this.userExists();
    this.userAccessExists();
    this.isValidUserStatus();
    await this.doesExistingCredentialMatch();
    await this.isCredentialSimilarToPrevious();
    this._userAccess.secretHash = await bcrypt.hash(this._previousAndNewCredential.newCredential, 12);

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
    // this._userAccess.status = 'ACTIVE';
    // this._user.status = 'ACTIVE';

    this._user.userAccesses = [...this._user.userAccesses, this._userAccess];
    return this._user;
  }

  public getRequestDto() {
    return { userId: this._requestInfo.createdBy };
  }
}
