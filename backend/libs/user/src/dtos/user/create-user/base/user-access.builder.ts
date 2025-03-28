import { UserAccessEntity } from '@app/db';
import { generateSecret } from '@app/shared';
import * as bcrypt from 'bcrypt';
import { ICredentials } from '../interfaces';

export class UserAccessBuilder {
  private userAccess: UserAccessEntity;

  private otpCode?: number; // OTP Verfification - Verify Phone
  private pinCode?: number; // PIN Auth - Set By User
  private password?: string; // Pass Auth - Set By User

  constructor(accessChannel: 'WEB' | 'APP') {
    this.userAccess = new UserAccessEntity({ status: 'PENDING' });
    this.otpCode = Math.floor(1000 + Math.random() * 9000);
    this.userAccess.otpCode = this.otpCode;
    this.userAccess.accessChannel = accessChannel;
  }
  setDeviceUuid(value: string): this {
    this.userAccess.deviceUuid = value;
    return this;
  }
  private async setPassword(value?: string): Promise<void> {
    this.password = value ? value : generateSecret(6);
    const hash = await bcrypt.hash(this.password, 12);

    if (value) {
      this.userAccess.secretHash = hash;
    } else {
      this.userAccess.tempSecretHash = hash;
    }
    this.userAccess.accessChannel = 'WEB';
  }
  private async setPinCode(value?: number): Promise<void> {
    this.pinCode = typeof value !== 'undefined' ? value : Math.floor(1000 + Math.random() * 9000);
    const hash = await bcrypt.hash(`${this.pinCode}`, 12);
    if (value) {
      this.userAccess.secretHash = hash;
    } else {
      this.userAccess.tempSecretHash = hash;
    }
    this.userAccess.accessChannel = 'APP';
  }

  getCredentials(): ICredentials {
    return { channel: this.userAccess?.accessChannel, otpCode: this.otpCode, password: this.password, pinCode: this.pinCode };
  }
  async build(): Promise<UserAccessEntity> {
    this.userAccess?.accessChannel === 'WEB' ? await this.setPassword() : await this.setPinCode();
    return this.userAccess;
  }
}
