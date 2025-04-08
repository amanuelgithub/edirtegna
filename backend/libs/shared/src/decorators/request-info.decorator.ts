import { AccessTokenPayload, AzpType } from '@app/auth';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import * as requestIp from '@supercharge/request-ip';
import { UAParser } from 'ua-parser-js';
import { AccessUserAgent, IRequestDetail } from '../dtos';
import { Channel, Realm } from '../enums';
const getChannelFromAzp = (azp: AzpType): Channel => {
  if (!azp) return 'WEB';
  const azpArr = azp.split('-');
  return `${azpArr[azpArr.length - 1].toUpperCase()}` as Channel;
};
const getChannelFromUrl = (requestUrl: string): Channel => {
  // e.g. '/api/app/auth/login'
  let _channel: Channel = 'WEB';
  if (!requestUrl) return _channel;
  const urlParts = requestUrl?.split('/')?.map((o) => o?.toLowerCase()) || [];
  _channel = urlParts?.includes('app') ? 'APP' : _channel;
  _channel = urlParts?.some((o) => ['web', 'manage'].includes(o)) ? 'WEB' : _channel;
  _channel = urlParts?.includes('client') ? 'API' : _channel;
  return _channel;
};
const getChannel = (requestUrl: string, azp: AzpType): Channel => {
  let _channel: Channel = getChannelFromAzp(azp);
  if (!azp && requestUrl) {
    _channel = getChannelFromUrl(requestUrl);
  }
  return _channel;
};
const getRealmFromAzp = (azp: AzpType): Realm | '' => {
  if (!azp) return '';
  const azpArr = azp.split('-');
  if (azpArr && azpArr.length >= 2) {
    switch (azpArr[1].toUpperCase()) {
      case 'MANAGER':
        return 'ADMIN';
      case 'CUSTOMER':
        return 'CUSTOMER';
      case 'EUSER':
        return 'CUSTOMER';
      default:
        return '';
    }
  }
  return '';
};
const getRealmFromOrigin = (origin: string, adminUrlConfig: string): Realm => {
  if (!origin) return 'CUSTOMER';
  const ADMIN_ORIGINS = ['http://localhost:5173', 'http://localhost'];
  if (adminUrlConfig) ADMIN_ORIGINS.push(adminUrlConfig);
  if (ADMIN_ORIGINS.includes(origin)) return 'ADMIN';
  return 'CUSTOMER';
};

type RequestInfoParamType = Partial<keyof IRequestDetail>;

//////
////// START TYPES //////
export type ClassDecorator = <T extends (...args: any[]) => any>(target: T) => T | void;

export declare type PropertyDecorator = (target: object, propertyKey: string | symbol) => void;

export declare type MethodDecorator = <T>(target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;

export declare type ParameterDecorator = (target: object, propertyKey: string | symbol, parameterIndex: number) => void;

//////  END TYPES //////
//////

export const RequestInfo = createParamDecorator<any, any, IRequestDetail>((param: RequestInfoParamType, ctx: ExecutionContext): IRequestDetail => {
  const request = ctx.switchToHttp().getRequest();
  const contentType = request.header('Content-Type');
  const protocol = request.protocol;
  const headerHost = request.headers.host;
  const headerOrigin = request.headers.origin;
  const hostName = request.hostname;
  const url = request.url;
  const cookies = request.cookies;
  const reqInfo = {
    origin: request.get('origin'),
    referer: request.header('Referer'),
    clientUrl: request.hostname + request.originalUrl,
    ipAddresses: request.header('x-forwarded-for') || request.socket.remoteAddress,
    contentType,
    protocol,
    headerHost,
    headerOrigin,
    hostName,
    url,
    cookies,
  };

  // user
  const user = request.user as AccessTokenPayload;

  // user agent
  const agent = request.get('user-agent');
  const ua = new UAParser(agent);
  const device = new AccessUserAgent(ua.getResult());

  // ip
  const ip = requestIp.getClientIp(request);

  // channel
  const channel = request.channel || getChannel(reqInfo.url, user?.azp);

  // realm
  const realm = request.headers.realm || getRealmFromAzp(user?.azp) || getRealmFromOrigin(headerOrigin, request.app.webAdminUrl);
  console.log('realm ---- >', request.realm, getRealmFromAzp(user?.azp), getRealmFromOrigin(headerOrigin, request.app.webAdminUrl));
  const result = { device, user, ip, channel, realm, createdBy: user?.uid, reqInfo };
  return param ? result[param] : result;
});
