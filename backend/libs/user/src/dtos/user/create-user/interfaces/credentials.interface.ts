import { Channel } from '@app/shared';

export interface ICredentials {
  channel?: Channel;
  otpCode?: number;
  pinCode?: number;
  password?: string;
}

export interface ITelebirrProfile {
  zoneRegionId: number;
  zoneRegionshortCode: number;
  shortCode: number;
  identifier: number;
  securityCredential: string;
}
