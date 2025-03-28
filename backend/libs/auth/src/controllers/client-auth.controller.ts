import { CUSTOMER_ROLE, UserEntity } from '@app/db';
import { GlobalConfigService } from '@app/global-config';
import { API_TAGS, Public, Roles } from '@app/shared';
import { GetUserService } from '@app/user';
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Ip, Logger, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { REF_TOKEN_COOKIE_NAME } from '../constants';
import { ApiKeyLoginDto, AzpType, RefreshTokenDto } from '../dtos';
import { AppThrottlerGuard } from '../guards';
import { LoginProcessor } from '../login';
import { AuthCommonService, AuthHelperService, LoginService, TokenService } from '../services';

@Controller({ version: '1', path: 'client/auth' })
@ApiTags(API_TAGS.AUTHENTICATION)
export class ClientAuthController {
  constructor(
    private readonly helper: AuthHelperService,
    private readonly globalConfigService: GlobalConfigService,
    private readonly tokenService: TokenService,
    private readonly loginService: LoginService,
    private readonly getUserService: GetUserService,
    private readonly authCommonService: AuthCommonService,
  ) {}

  // User Profile
  @Get('profile')
  @Roles(...CUSTOMER_ROLE)
  async getMyProfile(@Req() req) {
    const data = await this.getUserService.getBy({ id: Number(req.user.uid) });
    return data;
  }
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  async login(@Body() dto: ApiKeyLoginDto, @Req() req, @Ip() ip, @Res({ passthrough: true }) res: Response) {
    const device = this.globalConfigService.getUa(req);
    const realm = 'CUSTOMER'; //this.helper.getAccessRealm(req);
    const payload = new LoginProcessor(dto, { channel: 'API', ip, realm, device });
    const result = await this.loginService.login(payload);
    if (result && result.success) {
      const azp: AzpType = 'tms-customer-api';

      const { refreshToken, ...resp } = await this.tokenService.createTokenPair(result.data['user'] as UserEntity, azp);
      if (refreshToken) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(refreshToken, req);
        res.setHeader('set-cookie', refresh_cookie);
      }
      return { ...resp, success: true, statusCode: 200, message: 'Login Successful' };
    }
    return result;
  }
  // Refresh Access Token
  @Post('refresh')
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async refresh(@Body() refreshDto: RefreshTokenDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const azp: AzpType = 'tms-customer-api';
      refreshDto.refreshToken = req.cookies[REF_TOKEN_COOKIE_NAME];

      const result = await this.authCommonService.refreshAccessToken(refreshDto, azp);

      const { refreshToken, ...resp } = result;
      if (result?.refreshToken) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(result.refreshToken, req);
        res.setHeader('set-cookie', refresh_cookie);
        Logger.log({
          message: `{ ...resp, success: true, statusCode: 200, message: 'OK' }`,
          meta: { ...resp, success: true, statusCode: 200, message: 'OK' },
          context: ClientAuthController.name,
        });

        return { ...resp, success: true, statusCode: 200, message: 'OK' };
      }
      Logger.log({ message: 'should not reach here....', meta: {}, context: ClientAuthController.name });
      return { ...resp, refreshToken, success: true, statusCode: 200, message: 'OK' };
    } catch (error) {
      const refresh_cookie = this.helper.getLogoutRefreshTokenCookie(req);

      res.setHeader('set-cookie', refresh_cookie);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error?.message || error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  // Logout
  @Post('logout')
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async logout(@Body() refreshDto: RefreshTokenDto, @Req() req, @Res({ passthrough: true }) res: Response) {
    let refresh_cookie;
    try {
      const azp: AzpType = 'tms-customer-api';

      refreshDto.refreshToken = refreshDto.refreshToken;
      const result = await this.authCommonService.logoutRefreshToken(refreshDto, azp);
      refresh_cookie = this.helper.getLogoutRefreshTokenCookie(req);

      res.setHeader('set-cookie', refresh_cookie);

      return result;
    } catch (error) {
      res.setHeader('set-cookie', refresh_cookie);

      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error?.message || error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  //   // Refresh Access Token
  //   @Post('refresh')
  //   @Public()
  //   @HttpCode(HttpStatus.CREATED)
  //   @UsePipes(ValidationPipe)
  //   async refresh(@Body() refreshDto: RefreshTokenDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
  //     try {
  //       const origin = req.headers.origin;
  //       if (this.authHelper.isWebAccess(req)) {
  //         throw new UnauthorizedException(`The value '${origin}' is not a valid api request origin`);
  //       }
  //       const azp: AzpType = 'evd-customer-api';
  //       refreshDto.refreshToken = refreshDto.refreshToken;
  //       const result = await this.authCommonService.refreshAccessToken(refreshDto, azp);

  //       return new DetailResponse(result);
  //     } catch (error) {
  //       if (error instanceof HttpException) {
  //         throw error;
  //       } else {
  //         throw new HttpException(error?.message || error, HttpStatus.INTERNAL_SERVER_ERROR);
  //       }
  //     }
  //   }

  //   // Logout
  //   @Post('logout')
  //   @Public()
  //   @HttpCode(HttpStatus.CREATED)
  //   @UsePipes(ValidationPipe)
  //   async logout(@Body() refreshDto: RefreshTokenDto, @Req() req, @Res({ passthrough: true }) res: Response) {
  //     try {
  //       const origin = req.headers.origin;
  //       if (this.authHelper.isWebAccess(req)) {
  //         throw new UnauthorizedException(`The value '${origin}' is not a valid api request origin`);
  //       }
  //       const result = await this.authCommonService.logoutRefreshToken(refreshDto, 'evd-customer-api');
  //       const refresh_cookie = this.authHelper.getLogoutRefreshTokenCookie(req);

  //       res.setHeader('set-cookie', refresh_cookie);

  //       return result;
  //     } catch (error) {
  //       if (error instanceof HttpException) {
  //         throw error;
  //       } else {
  //         throw new HttpException(error?.message || error, HttpStatus.INTERNAL_SERVER_ERROR);
  //       }
  //     }
  //   }

  // register client

  // update client
}
