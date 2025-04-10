import { Channel, UserAccessStatus } from '@/core/enums';
import { AccessDevice } from './access-device.model';

export interface UserAccess {
  accessChannel: Channel;
  clientName?: string;
  allowedUrls?: string;
  apiClientId?: string;
  deviceUuid?: string;
  otpCode?: number;
  secretHash?: string;
  tempSecretHash?: string;
  status: UserAccessStatus;
  userId: number;
  accessDevices?: AccessDevice[];
}
