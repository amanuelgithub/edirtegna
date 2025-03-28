import { IReqInfo } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { REF_TOKEN_COOKIE_NAME } from '../constants';
import { TokenService } from './token.service';

@Injectable()
export class AuthHelperService {
  // private WEB_ACCESS_ADMIN_ORIGINS = [];
  // private WEB_ACCESS_CUSTOMER_ORIGINS = [];
  // private WEB_ACCESS_ORIGINS = [];
  constructor(private readonly tokenService: TokenService, private readonly conf: ConfigService) {
    // const isDevelopmentEnv = this.conf.get('NODE_ENV') === 'development';
    // this.WEB_ACCESS_ADMIN_ORIGINS = isDevelopmentEnv ? ['http://localhost', 'http://localhost:4200'] : [`${this.conf.get('app').webAdminUrl}`];
    // this.WEB_ACCESS_CUSTOMER_ORIGINS = isDevelopmentEnv
    //   ? ['http://localhost:8081', 'http://localhost:4201', 'http://127.0.0.1:4201', 'http://localhost:4242']
    //   : [`${this.conf.get('app').webCustomerUrl}`];
    // this.WEB_ACCESS_ORIGINS = [...this.WEB_ACCESS_ADMIN_ORIGINS, ...this.WEB_ACCESS_CUSTOMER_ORIGINS];
  }

  public async _getRefreshTokenCookie(refreshToken: string, req: Request) {
    const { exp } = await this.tokenService.decodeRefreshToken(refreshToken);
    const baseURL = req.protocol + '://' + req.headers.host + '/';
    const parsedURL = new URL(req.url, baseURL);
    const domain = parsedURL.hostname;
    const secure = parsedURL.protocol === 'https:';
    const expires = new Date(0).setUTCSeconds(exp);
    return `${REF_TOKEN_COOKIE_NAME}=${refreshToken}; expires='${expires}'; httpOnly=true; Secure=${secure}; sameSite=Lax; domain=${domain}; path=/`;
  }
  public async getRefreshTokenCookie(refreshToken: string, req: IReqInfo) {
    const { exp } = await this.tokenService.decodeRefreshToken(refreshToken);
    const { protocol, headerHost, url } = req;
    const baseURL = protocol + '://' + headerHost + '/';
    const parsedURL = new URL(url, baseURL);
    const domain = parsedURL.hostname;
    const secure = parsedURL.protocol === 'https:';
    const expires = new Date(0).setUTCSeconds(exp);
    return `${REF_TOKEN_COOKIE_NAME}=${refreshToken}; expires='${expires}'; httpOnly=true; Secure=${secure}; sameSite=Lax; domain=${domain}; path=/`;
  }

  public _getLogoutRefreshTokenCookie(req: Request) {
    const baseURL = req.protocol + '://' + req.headers.host + '/';
    const parsedURL = new URL(req.url, baseURL);
    const domain = parsedURL.hostname;
    const secure = parsedURL.protocol === 'https:';
    const expires = new Date(0).setUTCSeconds(0);
    return `${REF_TOKEN_COOKIE_NAME}=''; expires='${expires}'; httpOnly=true; Secure=${secure}; sameSite=Lax; domain=${domain}; path=/`;
  }
  public getLogoutRefreshTokenCookie(req: IReqInfo) {
    const { protocol, headerHost, url } = req;
    const baseURL = protocol + '://' + headerHost + '/';
    const parsedURL = new URL(url, baseURL);
    const domain = parsedURL.hostname;
    const secure = parsedURL.protocol === 'https:';
    const expires = new Date(0).setUTCSeconds(0);
    return `${REF_TOKEN_COOKIE_NAME}=''; expires='${expires}'; httpOnly=true; Secure=${secure}; sameSite=Lax; domain=${domain}; path=/`;
  }
  // public isWebAccess(req: Request) {
  //   const origin = req.headers.origin;
  //   return origin && (this.WEB_ACCESS_ORIGINS.includes(origin) || origin.includes('.ngrok-free.app'));
  // }

  // public getAccessRealm(req: Request) {
  //   const origin = req.headers.origin;
  //   return this.WEB_ACCESS_ADMIN_ORIGINS.includes(origin) ? 'ADMIN' : 'CUSTOMER';
  // }
  // public getAccessChannel(req: Request) {
  //   return this.isWebAccess(req) ? 'WEB' : 'APP';
  // }
  // public validateChannel(req: Request, channel: 'WEB' | 'APP') {
  //   const origin = req.headers.origin;
  //   if ((channel !== 'WEB' && this.isWebAccess(req)) || (channel !== 'APP' && !this.isWebAccess(req))) {
  //     throw new UnauthorizedException(`The value '${origin}' is not a valid ${channel} request origin`);
  //   }
  // }
  // public getAzp(req: Request) {
  //   const origin = req.headers.origin;
  //   let azp: AzpType;
  //   if (this.isWebAccess(req)) {
  //     azp = this.WEB_ACCESS_ADMIN_ORIGINS.includes(origin) ? 'te-manager-web' : 'te-customer-web';
  //   } else {
  //     azp = 'te-customer-app';
  //   }
  //   return azp;
  // }
}
