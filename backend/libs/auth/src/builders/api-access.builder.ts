import { UserAccessEntity } from '@app/db';
import { UserAccessStatus, generateApiKeyHash, generateSecret } from '@app/shared';
import { v4 as uuidv4 } from 'uuid';

export interface IApiCredentials {
  apiClientId: string;
  clientSecret: string;
}

export class UserApiAccessBuilder {
  private userAccess: UserAccessEntity;

  private apiClientId?: string;
  private clientSecret?: string;

  constructor(userId: number, userAccess?: UserAccessEntity) {
    const key = generateSecret(32, false);
    this.apiClientId = uuidv4();
    const payload = `${userId}:${this.apiClientId}:${key}`;
    const buffer = Buffer.from(payload);
    // the API Key
    this.clientSecret = buffer.toString('base64');
    const secretHash = generateApiKeyHash(this.clientSecret);
    if (!userAccess) {
      this.userAccess = new UserAccessEntity({
        accessChannel: 'API',
        apiClientId: this.apiClientId,
        secretHash,
        status: 'ACTIVE',
        userId,
      });
    } else {
      // update
      this.userAccess = userAccess;
      this.userAccess.apiClientId = this.apiClientId;
      this.userAccess.secretHash = secretHash;
      this.userAccess.status = 'ACTIVE';
    }
  }
  setClientName(value: string): this {
    if (value) this.userAccess.clientName = value;
    return this;
  }
  setAllowedUrls(value: string): this {
    if (value) this.userAccess.allowedUrls = value;
    return this;
  }
  setDeviceUuid(value: string): this {
    if (value) this.userAccess.deviceUuid = value;
    return this;
  }
  setStatus(value: UserAccessStatus): this {
    if (value) this.userAccess.status = value;
    return this;
  }

  getApiCredentials(): IApiCredentials {
    return { apiClientId: this.apiClientId, clientSecret: this.clientSecret };
  }
  async build(): Promise<UserAccessEntity> {
    return this.userAccess;
  }
}
