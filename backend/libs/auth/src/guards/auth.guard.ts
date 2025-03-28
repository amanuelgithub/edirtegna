import { CHANNEL, Channel, PUBLIC_ENDPOINT } from '@app/shared';
import { CanActivate, ExecutionContext, ForbiddenException, HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from '../services';

@Injectable()
export class AuthenticationGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly _reflector: Reflector, private readonly _tokenService: TokenService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean | undefined> {
    try {
      const request = context.switchToHttp().getRequest();
      // const { method, path } = request;
      let channel: Channel = 'WEB';

      // If @Public Decorator - Do not Authenticate
      const decoratorSkip = this._reflector.get(PUBLIC_ENDPOINT, context.getClass()) || this._reflector.get(PUBLIC_ENDPOINT, context.getHandler());

      // Web Application Access
      const authorizationHeader = request.header('Authorization');

      // Mobile Application Access
      const xAccessToken = request.header('x-access-token');

      // API Access
      const xApiToken = request.header('x-api-token');

      // Middleware API Access
      const xMiddlewareApiKey = request.header('x-middleware-api-key');

      // REQUEST CHANNEL
      if (xAccessToken) {
        channel = CHANNEL.APP;
      }
      if (xApiToken || xMiddlewareApiKey) {
        channel = CHANNEL.API;
      }

      //---------------------------------------------
      // Authorization Header
      //---------------------------------------------
      const authorizationHeaderParts = authorizationHeader ? authorizationHeader.split(' ') : [];
      const isAuthorizationPartsAvaliable = authorizationHeaderParts && authorizationHeaderParts.length === 2;
      const authorizationBearer: string = isAuthorizationPartsAvaliable ? authorizationHeaderParts[0] : '';
      const authorizationToken: string = isAuthorizationPartsAvaliable ? authorizationHeaderParts[1] : '';

      if (decoratorSkip) return true;

      if (channel === CHANNEL.WEB && (!isAuthorizationPartsAvaliable || !authorizationBearer || authorizationBearer.trim().toLowerCase() !== 'bearer')) {
        throw new HttpException('Authorization: Bearer <token> header empty or invalid', HttpStatus.BAD_REQUEST);
      }

      // Authenticate User
      let requestUser;
      switch (channel) {
        case CHANNEL.APP:
          requestUser = await this._tokenService.verifyAccessToken(xAccessToken);
          break;
        case CHANNEL.WEB:
          requestUser = await this._tokenService.verifyAccessToken(authorizationToken);
          break;
        case CHANNEL.API:
          requestUser = await this._tokenService.verifyAccessToken(xApiToken);
          break;
      }

      if (!requestUser) {
        throw new UnauthorizedException('Authorization: Invalid Credentials');
      }

      // Allowed Roles for the request...

      const allowedRoles = this._reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);
      const rolesDefinedForRoute = allowedRoles && allowedRoles.length > 0;
      const userHasRolePermission = (rolesDefinedForRoute && requestUser && requestUser?.roleId && allowedRoles.includes(requestUser?.roleId)) || !rolesDefinedForRoute;

      if (!userHasRolePermission) {
        throw new ForbiddenException('Unavailable or Forbidden resource access');
      }

      // SET REQUEST ...
      request['user'] = requestUser;
      request['channel'] = channel;

      // ALL good !
      return true;
    } catch (e) {
      Logger.error({ message: `msg: ${e?.message}`, stack: e, context: AuthenticationGuard.name });

      throw e;
    }
  }
}
