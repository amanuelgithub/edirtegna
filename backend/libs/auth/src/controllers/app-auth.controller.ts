import { CUSTOMER, CUSTOMER_ROLE, ROLES_SEED, UserEntity } from '@app/db';
import { ActivityTitle, API_TAGS, DetailResponse, IRequestDetail, IRequestInfo, Public, RequestInfo, Roles } from '@app/shared';
import { CreateUserService, CustomerFactory, GetUserService, RegisterCustomerDto } from '@app/user';
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Ip, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { REF_TOKEN_COOKIE_NAME } from '../constants';
import { AzpType, RefreshTokenDto, ResendOtpDto, ResendOtpPayload, VerifyOtpDto, VerifyOtpPayload } from '../dtos';
import { ForgotCredentialDto, ForgotCredentialProcessor } from '../forgot-credential';
import { AppThrottlerGuard } from '../guards';
import { LoginProcessor, PasswordLoginDto, PinLoginDto } from '../login';
import { AuthCommonService, AuthHelperService, ForgotCredentialService, LoginService, ResendOtpService, SetCredentialService, TokenService, VerifyOTPService } from '../services';
import { SetCredentialProcessor, SetPasswordDto, SetPinCodeDto } from '../set-credential';
import { GlobalConfigService } from '@app/global-config';
import { UserNotificationService } from '@app/notification';

@Controller({ version: '1', path: 'app/auth' })
@ApiTags(API_TAGS.AUTHENTICATION)
export class AppAuthController {
  constructor(
    private readonly resendOtpService: ResendOtpService,
    private readonly helper: AuthHelperService,
    private readonly authCommonService: AuthCommonService,
    private readonly globalConfigService: GlobalConfigService,
    private readonly verifyOTPService: VerifyOTPService,
    private readonly getUserService: GetUserService,
    private readonly tokenService: TokenService,
    private readonly forgotCredentialService: ForgotCredentialService,
    private readonly notify: UserNotificationService,

    private readonly loginService: LoginService,
    private readonly createUserService: CreateUserService,
    private readonly setCredentialService: SetCredentialService,
  ) {}

  // User Profile
  @Get('profile')
  @Roles(...CUSTOMER_ROLE)
  getMyProfile(@RequestInfo() info: IRequestDetail) {
    return this.getUserService.getBy({ id: info?.user?.uid });
  }

  // App Login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  async login(@Body() dto: PasswordLoginDto, @RequestInfo() info: IRequestDetail, @Res({ passthrough: true }) res: Response) {
    // console.log('login info', info);
    const payload = new LoginProcessor(dto, { ...info, channel: 'WEB' });
    console.log('login payload', payload);
    const result = await this.loginService.login(payload);
    if (result && result.success) {
      const azp: AzpType = 'tms-txn-customer-app';
      const { refreshToken, ...resp } = await this.tokenService.createTokenPair(result.data['user'] as UserEntity, azp);
      if (refreshToken) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(refreshToken, info.reqInfo);
        res.setHeader('set-cookie', refresh_cookie);
      }
      return { ...resp, refreshToken, success: true, statusCode: 200, message: 'Login Successful' };
    }
    return result;
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  @ActivityTitle('End user self register')
  async selfRegister(@Body() dto: RegisterCustomerDto, @RequestInfo() info: IRequestDetail) {
    // async selfRegister(@Body() dto: RegisterEUserDto, @RequestInfo() info: IRequestDetail) {
    console.log('selfRegister dto', dto);
    const builder = CustomerFactory.get({ ...dto, role: CUSTOMER }, info);
    const user = await this.createUserService.createUser(builder);
    // send notifications
    const smsWebAccess = builder.getNotificationDetail(user.id, 'WEB');
    const smsAppAccess = builder.getNotificationDetail(user.id, 'APP');
    await Promise.all([
      this.notify.sendAuthSMS(smsWebAccess),
      this.notify.sendAuthSMS(smsAppAccess),
      this.notify.sendWelcomeEmail(user, smsWebAccess.otpCode, smsWebAccess.password),
    ]);

    console.log('CUSTOMER CREATED: ', 'app access details: ', smsAppAccess, 'web access details: ', smsWebAccess);
    return new DetailResponse(null);
  }

  // @Post('register')
  // @HttpCode(HttpStatus.CREATED)
  // @UsePipes(ValidationPipe)
  // @Public()
  // @Throttle({ default: { limit: 10, ttl: 60000 } })
  // @UseGuards(AppThrottlerGuard)
  // @ActivityTitle('End user self register')
  // async register(@Body() dto: RegisterCustomerDto, @Ip() ip) {
  //   console.log('register dto', dto);
  //   // const device = this.globalConfigService.getUa(req);
  //   const requestInfo: IRequestInfo = { channel: 'APP', ip, realm: 'CUSTOMER' };
  //   // const requestInfo: IRequestInfo = { channel: 'APP', ip, realm: 'CUSTOMER' };

  //   const builder = CustomerFactory.get({ ...dto, role: CUSTOMER }, requestInfo);

  //   const user = await this.createUserService.createUser(builder);

  //   console.log('user: ', user);

  //   const smsPayload = builder.getNotificationDetail(user.id);
  //   await this.notify.sendAuthSMS(smsPayload);
  //   await this.notify.sendWelcomeEmail(user, smsPayload.otpCode, smsPayload.password);
  //   return new DetailResponse(smsPayload.otpCode);
  // }

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

  // Set Password Code
  @Post('set-password')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  async setPassword(@Body() dto: SetPasswordDto, @RequestInfo() info: IRequestDetail, @Ip() ip, @Req() req, @Res({ passthrough: true }) res: Response) {
    // this.helper.validateChannel(req, 'APP');
    // const device = this.globalConfigService.getUa(req);

    // const payload = new SetCredentialPayload(dto, { channel: 'WEB', ip, realm: 'CUSTOMER', device }, CredentialChangeType.SET_PASSWORD);
    const payload = new SetCredentialProcessor(dto, { channel: 'WEB', ip: info.ip, realm: 'CUSTOMER', device: info.device });
    const { data, ...msgResponse } = await this.setCredentialService.setCredential(payload);

    if (data && msgResponse.success) {
      // const azp: AzpType = realm && realm === 'CUSTOMER' ? 'wc-customer-app' : 'wc-euser-app';
      const azp: AzpType = 'tms-txn-customer-app';
      const { ...resp } = await this.tokenService.createTokenPair(data, azp);

      return { ...resp, success: true, statusCode: 200, message: 'OK' };
    }
    return msgResponse;
  }

  // Set PIN Code
  @Post('set-pin')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  async setCustomerPin(@Body() dto: SetPinCodeDto, @RequestInfo() info: IRequestDetail, @Req() req, @Res({ passthrough: true }) res: Response) {
    const payload = new SetCredentialProcessor(dto, { channel: 'APP', ip: info.ip, realm: 'CUSTOMER', device: info.device });
    const { data, ...msgResponse } = await this.setCredentialService.setCredential(payload);

    if (data && msgResponse.success) {
      const azp: AzpType = 'tms-txn-customer-app';
      const { refreshToken, ...resp } = await this.tokenService.createTokenPair(data, azp);

      if (refreshToken) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(refreshToken, req);
        res.setHeader('set-cookie', refresh_cookie);
      }
      return { ...resp, refreshToken, success: true, statusCode: 200, message: 'OK' };
    }
    return msgResponse;
  }

  // FORGOT PIN Code
  @Post('forgot-pin')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  async forgotCustomerPin(@Body() dto: ForgotCredentialDto, @RequestInfo() info: IRequestDetail) {
    try {
      const processor = new ForgotCredentialProcessor(dto, info);
      // const origin = req.headers.origin;
      // if (this.authHelper.isWebAccess(req)) {
      //   throw new UnauthorizedException(`The value '${origin}' is not a valid app request origin`);
      // }
      // const userAgent = this.authHelper.getUa(req);
      const response = await this.forgotCredentialService.resend(processor);
      return response;
    } catch (error) {
      throw new HttpException(error, error.statusCode || 500);
    }
  }

  // Resend OTP Code
  @Post('resend-otp')
  @Public()
  @Throttle({ default: { limit: 1, ttl: 20000 } })
  @UseGuards(AppThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  resendUserOtp(@Body() dto: ResendOtpDto, @RequestInfo() info: IRequestDetail) {
    const payload = new ResendOtpPayload(dto, { channel: 'APP', ip: info.ip, realm: info.realm, device: info.device });
    return this.resendOtpService.resend(payload);
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
      const isWebAccess = false;
      const azp: AzpType = 'tms-txn-customer-app';
      // here the refresh token is passed in the body for mobile app

      // refreshDto.refreshToken = info?.reqInfo?.cookies[REF_TOKEN_COOKIE_NAME];
      console.log('refresh token vale: ', refreshDto.refreshToken);

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
      const azp: AzpType = 'tms-txn-customer-app';
      // here the refresh token is passed in the body for mobile app
      // refreshDto.refreshToken = req.cookies[REF_TOKEN_COOKIE_NAME] ?? refreshDto.refreshToken;
      const result = await this.authCommonService.logoutRefreshToken(refreshDto, azp);
      // refresh_cookie = this.helper.getLogoutRefreshTokenCookie(req);

      // res.setHeader('set-cookie', refresh_cookie);

      return result;
    } catch (error) {
      // res.setHeader('set-cookie', refresh_cookie);

      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error?.message || error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
