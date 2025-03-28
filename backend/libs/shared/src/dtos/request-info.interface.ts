import { AccessTokenPayload } from '@app/auth';
import { Channel, Realm } from '../enums';
import { AccessUserAgent } from './user-agent.dto';

export interface IRequestInfo {
  realm: Realm;
  channel: Channel;
  ip: string;
  createdBy?: number;
  device?: AccessUserAgent;
  user?: AccessTokenPayload;
}

export interface IReqInfo {
  protocol?: string;
  headerHost?: string;
  headerOrigin?: string;
  hostName?: string;
  url?: string;
  cookies?: any;
  origin?: string;
  referer?: string;
  clientUrl?: string;
  ipAddresses?: string;
}
export interface IRequestDetail {
  realm: Realm;
  channel: Channel;
  ip: string;
  contentType?: string;
  user?: AccessTokenPayload;
  device?: AccessUserAgent;
  reqInfo?: IReqInfo;
}
