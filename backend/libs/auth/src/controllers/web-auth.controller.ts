import { ROLE, UserEntity } from '@app/db';
import { UserNotificationService } from '@app/notification';
import { API_TAGS, ActivityTitle, IRequestDetail, Public, RequestInfo, Roles } from '@app/shared';
import { CreateUserService, GetUserService, PhoneAndEmailValidationService, PhoneEmailValidationDto, PhoneEmailValidationPayload } from '@app/user';
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query, Req, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { ChangeOwnCredentialProcessor, ChangeOwnPasswordDto } from '../change-credential';
import { REF_TOKEN_COOKIE_NAME } from '../constants';
import { AzpType, PasswordLoginDto, RefreshTokenDto, ResendOtpDto, ResendOtpPayload, ResetWebLoginDto, ResetWebLoginPayload, VerifyOtpDto, VerifyOtpPayload } from '../dtos';
import { AppThrottlerGuard } from '../guards';
import { LoginProcessor } from '../login';
import {
  AuthCommonService,
  AuthHelperService,
  ChangeOwnCredentialService,
  LoginService,
  ResendOtpService,
  ResetUserPasswordService,
  SetCredentialService,
  TokenService,
  VerifyOTPService,
} from '../services';
import { SetCredentialProcessor, SetPasswordDto } from '../set-credential';

@Controller({ version: '1', path: 'web/auth' })
@ApiTags(API_TAGS.AUTHENTICATION)
export class WebAuthController {
  constructor(
    private readonly resendOtpService: ResendOtpService,
    private readonly helper: AuthHelperService,
    private readonly authCommonService: AuthCommonService,
    private readonly verifyOTPService: VerifyOTPService,
    private readonly getUserService: GetUserService,
    private readonly tokenService: TokenService,
    private readonly loginService: LoginService,
    private readonly setCredentialService: SetCredentialService,
    private readonly changeOwnCredentialService: ChangeOwnCredentialService,
    private readonly resetUserPasswordService: ResetUserPasswordService,
    private readonly notify: UserNotificationService,
    private readonly createUserService: CreateUserService,
    private readonly phoneAndEmailValidationService: PhoneAndEmailValidationService,
  ) {}

  // User Profile
  @Get('profile')
  getMyProfile(@RequestInfo() info: IRequestDetail) {
    return this.getUserService.getBy({ id: info?.user?.uid });
  }

  // Validate Phone or Email
  @Get('/validate-registration')
  @Public()
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  validateRegistration(@Query(new ValidationPipe({ transform: true })) dto: PhoneEmailValidationDto) {
    const payload = new PhoneEmailValidationPayload(dto);
    return this.phoneAndEmailValidationService.validate(payload);
  }

  // @Post('register')
  // @HttpCode(HttpStatus.CREATED)
  // @UsePipes(ValidationPipe)
  // @Public()
  // @Throttle({ default: { limit: 10, ttl: 60000 } })
  // @UseGuards(AppThrottlerGuard)
  // @ActivityTitle('End user self register')
  // async selfRegister(@Body() dto: RegisterEUserDto, @RequestInfo() info: IRequestDetail) {
  //   const builder = CustomerFactory.get({ ...dto, role: PARTNER_ADMIN }, info);
  //   const user = await this.createUserService.createUser(builder);
  //   // send notifications
  //   const smsWebAccess = builder.getNotificationDetail(user.id, 'WEB');
  //   const smsAppAccess = builder.getNotificationDetail(user.id, 'APP');
  //   await Promise.all([
  //     this.notify.sendAuthSMS(smsWebAccess),
  //     this.notify.sendAuthSMS(smsAppAccess),
  //     this.notify.sendWelcomeEmail(user, smsWebAccess.otpCode, smsWebAccess.password),
  //   ]);
  //   return new DetailResponse(null);
  // }

  // Web Login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  async login(@Body() dto: PasswordLoginDto, @RequestInfo() info: IRequestDetail, @Res({ passthrough: true }) res: Response) {
    console.log('Are we here?');
    const payload = new LoginProcessor(dto, info);
    const result = await this.loginService.login(payload);
    if (result && result.success) {
      const azp: AzpType = info.realm && info.realm === 'ADMIN' ? 'tms-manager-web' : 'tms-customer-web';
      const { refreshToken, ...resp } = await this.tokenService.createTokenPair(result.data['user'] as UserEntity, azp);
      if (refreshToken) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(refreshToken, info.reqInfo);
        res.setHeader('set-cookie', refresh_cookie);
      }
      return { ...resp, success: true, statusCode: 200, message: 'Login Successful' };
    }
    return result;
  }

  // WEB - Verify OTP Code
  @Post('verify-otp')
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  verifyUserOtp(@Body() dto: VerifyOtpDto, @RequestInfo() info: IRequestDetail) {
    const payload = new VerifyOtpPayload(dto, { channel: 'WEB', ip: info.ip, realm: info.realm, device: info.device });
    return this.verifyOTPService.verify(payload);
  }

  // Set Password
  @Post('set-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async setUserPassword(@Body() dto: SetPasswordDto, @RequestInfo() info: IRequestDetail, @Res({ passthrough: true }) res: Response) {
    const payload = new SetCredentialProcessor(dto, { channel: 'WEB', ip: info.ip, realm: info.realm, device: info.device });
    const { data, ...msgResponse } = await this.setCredentialService.setCredential(payload);
    const payloadResp = payload?.getDetailRespDto();
    if (data && msgResponse?.success) {
      const azp: AzpType = info.realm && info.realm === 'ADMIN' ? 'tms-manager-web' : 'tms-customer-web';
      const { refreshToken, ...resp } = await this.tokenService.createTokenPair(data, azp);

      if (refreshToken) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(refreshToken, info.reqInfo);
        res.setHeader('set-cookie', refresh_cookie);
      }
      return { ...resp, success: true, statusCode: 200, message: 'OK' };
    }
    return payloadResp;
  }

  // Change Own Password
  @Post('change-my-password')
  @Roles(...ROLE)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Change own Password')
  async changeMyPassword(@Body() dto: ChangeOwnPasswordDto, @RequestInfo() info: IRequestDetail, @Res({ passthrough: true }) res: Response) {
    const realm = info.realm;
    const userId = Number(info.user.uid);
    const payload = new ChangeOwnCredentialProcessor(dto, { channel: 'WEB', ip: info.ip, realm: info.realm, device: info.device, createdBy: userId });
    const { data, ...msgResponse } = await this.changeOwnCredentialService.change(payload);

    if (data && msgResponse.success) {
      const azp: AzpType = realm && realm === 'ADMIN' ? 'tms-manager-web' : 'tms-customer-web';
      const { refreshToken, ...resp } = await this.tokenService.createTokenPair(data, azp);

      if (refreshToken) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(refreshToken, info.reqInfo);
        res.setHeader('set-cookie', refresh_cookie);
      }
      return { ...resp, success: true, statusCode: 200, message: 'OK' };
    }
    return msgResponse;
  }

  // Admin reset Password
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Roles(...ROLE)
  @ActivityTitle('Reset User Password')
  resetUserPassword(@Body() dto: ResetWebLoginDto, @RequestInfo() info: IRequestDetail) {
    if (info?.channel !== 'WEB') {
      throw new UnauthorizedException(`The value '${info?.reqInfo?.origin}' is not a valid WEB request origin`);
    }
    const payload = new ResetWebLoginPayload(dto, { channel: 'WEB', ip: info.ip, realm: info.realm, device: info.device });
    return this.resetUserPasswordService.reset(payload);
  }

  // Resend OTP Code
  @Post('resend-otp')
  @Public()
  @Throttle({ default: { limit: 1, ttl: 20000 } })
  @UseGuards(AppThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async resendUserOtp(@Body() dto: ResendOtpDto, @RequestInfo() info: IRequestDetail) {
    const payload = new ResendOtpPayload(dto, { channel: 'WEB', ip: info.ip, realm: info.realm, device: info.device });
    const result = await this.resendOtpService.resend(payload);
    return result;
  }

  // Refresh Access Token
  @Post('refresh')
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async refresh(@Body() refreshDto: RefreshTokenDto, @RequestInfo() info: IRequestDetail, @Res({ passthrough: true }) res: Response) {
    try {
      const isWebAccess = true;
      const azp: AzpType = info.realm && info.realm === 'ADMIN' ? 'tms-manager-web' : 'tms-customer-web';
      refreshDto.refreshToken = info?.reqInfo?.cookies[REF_TOKEN_COOKIE_NAME];
      const result = await this.authCommonService.refreshAccessToken(refreshDto, azp);

      const { refreshToken, ...resp } = result;
      if (isWebAccess && result?.refreshToken) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(result.refreshToken, info.reqInfo);
        res.setHeader('set-cookie', refresh_cookie);
        return { ...resp, success: true, statusCode: 200, message: 'OK' };
      }
      return { ...resp, refreshToken, success: true, statusCode: 200, message: 'OK' };
    } catch (error) {
      const refresh_cookie = this.helper.getLogoutRefreshTokenCookie(info.reqInfo);

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
  async logout(@Body() refreshDto: RefreshTokenDto, @Req() req, @RequestInfo() info: IRequestDetail, @Res({ passthrough: true }) res: Response) {
    let refresh_cookie;
    try {
      const azp: AzpType = info.realm && info.realm === 'ADMIN' ? 'tms-manager-web' : 'tms-customer-web';
      refreshDto.refreshToken = req.cookies[REF_TOKEN_COOKIE_NAME] ?? refreshDto.refreshToken;
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
}
