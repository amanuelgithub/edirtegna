# User Management & Auth
appId: 
1027397761925069

appSecret:
c735b00e8fff555b979182e7aa2bc5f7

## Authentication

- All features should start with /auth endpoint

- When a customer is registered:
  
    id
    idp_id
    email
    full_name
    phone
    pin_code
    access_channels
    password_hash
    device_uuid
    otp_code
    realm
    role
    created_at
    updated_at
    created_by
    status
    customer_profile_id

    id
    e_topup_commission
    evd_commission
    cash_wallet_balance
    evd_wallet_balance
    e_topup_wallet_balance
    customer_level
    region_id
    area_id
    parent_customer_id

    ```json
    // Company User
    // When a user gets created, 
    //  - otp_code generated and sent
    //  - password_hash generated and password sent
    {
        "email":"'test@teleportet.com",
        "full_name":"testUser",
        "phone":"911756708",
        "access_channels":"WEB",
        "device_uuid":"http://localhost",
        "realm":"ADMIN",
        "role":"ADMIN"
    }

    ```

```typescript
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  HttpException,
  HttpStatus,
  HttpCode,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  Res,
  Ip,
  Logger,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  AuthCommonService,
  AuthHelperService,
  AuthWebService,
  ChangeOwnCredentialService,
  LoginService,
  ResendOtpService,
  ResetUserPasswordService,
  SetCredentialService,
  SocialAuthService,
  TokenService,
  VerifyOTPService,
} from '../services';

import {
  AzpType,
  ChangeOwnCredentialPayload,
  ChangeOwnPasswordDto,
  LoginPayload,
  PasswordLoginDto,
  RefreshTokenDto,
  ResendOtpDto,
  ResendOtpPayload,
  ResetWebLoginDto,
  ResetWebLoginPayload,
  SetCredentialPayload,
  SetPasswordDto,
  VerifyOtpDto,
  VerifyOtpPayload,
} from '../dtos';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { AppThrottlerGuard } from '../guards';
import { UserEntity } from '@app/db';
import { Public, Roles, ActivityTitle, ROLE, KeysOf, IRequestInfo, DetailResponse } from '@app/shared';
import { CreateUserService, GetUserService, PhoneAndEmailValidationService } from '@app/user/services';
import { GlobalConfigService } from '@app/global-config';
import { AuthGuard } from '@nestjs/passport';
import { CustomerFactory, PhoneEmailValidationDto, PhoneEmailValidationPayload, RegisterEUserDto } from '@app/user';
import { UserNotificationService } from '@app/notification';
import { STRATEGY_NAME } from '../strategies/tg';
// import loginViaTelegram from '../strategies/tg2';

@Controller({version: '1', path:'web/auth'})
export class WebAuthController {
  private serverDns;
  constructor(
    private readonly conf: ConfigService,
    private readonly resendOtpService: ResendOtpService,
    private readonly helper: AuthHelperService,
    private readonly globalConfigService: GlobalConfigService,
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
    private readonly authWebService: AuthWebService,
    private readonly socialAuthService: SocialAuthService,
  ) {
    this.serverDns = this.conf.get('app').serverDns;
  }

  //================================================================================================
  // SOCIAL LOGIN
  //================================================================================================
  ///api/web/auth/google
  @UseGuards(AuthGuard('google'))
  @Get('google')
  @Public()
  async googleLogin() {
    // GoogleStrategy to redirect to Google login page
  }

  ///api/web/auth/oauth2/callback
  @UseGuards(AuthGuard('google'))
  @Get('oauth2/callback')
  @Public()
  async googleCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    // Generate JWT token based on the OAuth2 logged in user

    // create a new user and login...
    // const loginResult = await this.authService.login(req.user);
    //
    // Pass the token to client app
    //this.setAccessTokenCookie(res, loginResult.accessToken);
    //
    // angular url
    // http://localhost:4201/auth/login
    // http://localhost:4201/auth/oauth2/callback
    // res.redirect(`/auth/oauth2/callback?accessToken=${loginResult.accessToken}`);
    // res.redirect(`http://localhost:4201/auth/oauth2/callback?accessToken=${loginResult.accessToken}`);

    //-----------------------------------
    const user = req.user;
    if (user) {
      const azp: AzpType = 'te-customer-web';
      // console.log('\n', `result.data['subscription']`, result.data['subscription'], '\n');

      const { refreshToken, accessToken } = await this.tokenService.createTokenPair(user as UserEntity, azp);
      if (refreshToken) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(refreshToken, req);
        res.setHeader('set-cookie', refresh_cookie);
      }
      // return { ...resp, success: true, statusCode: 200, message: 'Login Successful' };
      // sendMessage(parentWindow, new Message("shakehand", true));

      /* 
      var url = new URL( document.referrer );
var target = url.protocol+"//"+url.host;
//opened window
window.opener.postMessage("message",target);
//iframe
window.parent.postMessage("message",target);
      */

      // Send the token back to the parent window
      //       res.send(`
      //   <script>
      //     window.parent.postMessage('${accessToken}', '*');
      //     window.close();
      //   </script>
      // `);
      //
      // setTimeout(function () {
      //   window.top.postMessage('${accessToken}', '*');
      //   window.close();
      //     }, 2000);
      return `
<script>
  

      window.addEventListener('load', function () {
        console.log(window.parent)
        console.log(window.opener)
        console.log(window.top)
        console.log('${accessToken}')
        window.top.postMessage('${accessToken}', '*');
        window.close();
      })
</script>`;

      //       return `
      //       <html><body>
      //       <script>
      // window.opener.postMessage('${accessToken}', 'http://localhost:4201');
      // </script></body></html>`;
    } else {
      return 'There was a problem signing in...';
    }
    // window.addEventListener("load", () => {
    //   setTimeout(function () {
    //     parent.postMessage('${accessToken}', 'http://localhost:4201/auth/login')
    //   }, 2000);
    // });
    // //-----------------------------------
    // const jwt: string = req.user.jwt;
    // if (jwt) {
    //   return `<html><body><script>window.opener.postMessage('${jwt}', 'http://localhost:4200')</script></body></html>`;
    // } else {
    //   return 'There was a problem signing in...';
    // }
  }
  ///api/web/auth/telegram
  //http://localhost:3000/api/web/auth/telegram
  @Public()
  @Get('telegram')
  async telegramtest() {
    //-----------------------------------

    try {
      //   // 6824594124:AAHKc02z7qam7FAuk3hJL35B5Vfggd_NK3Q
      //   const params = {
      //     botId: 6824594124, // telergam id of bot
      //     botNick: 'transfer_test_auth_bot', // telegram username of bot
      //     origin: 'https://2f6b-196-190-62-121.ngrok-free.app', // domain that is linked to your bot
      //     phone: '+251911756708', // phone number to auth
      //   };
      //   const tgUser = await loginViaTelegram(params);
      return 'tgUser';
    } catch (error) {
      console.error('Telegram auth error', error);
    }
  }
  @Public()
  // @UseGuards(AuthGuard('telegram'))
  @UseGuards(AuthGuard(STRATEGY_NAME))
  @Get('oauth2/telegram')
  async telegramCallback(@Query(new ValidationPipe({ transform: true })) data, @Req() req, @Res({ passthrough: true }) res: Response) {
    //-----------------------------------
    console.log('telegramCallback:data', data);
    console.log('telegramCallback', req.user);
    const user = req.user;
    if (user) {
      const azp: AzpType = 'te-customer-web';
      // console.log('\n', `result.data['subscription']`, result.data['subscription'], '\n');

      const { refreshToken, accessToken } = await this.tokenService.createTokenPair(user as UserEntity, azp);
      if (refreshToken) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(refreshToken, req);
        res.setHeader('set-cookie', refresh_cookie);
      }
      return `
<script>
  

      window.addEventListener('load', function () {
        console.log(window.parent)
        console.log(window.opener)
        console.log(window.top)
        console.log('${accessToken}')
        window.top.postMessage('${accessToken}', '*');
        window.close();
      })
</script>`;
    } else {
      return 'There was a problem signing in...';
    }
  }

  //================================================================================================
  // @Get('google/uri')
  // @Public()
  // async requestGoogleRedirectUri(): Promise<any> {
  //   return await this.socialAuthService.requestGoogleRedirectUri();
  // }

  // @Post('google/signin')
  // @Public()
  // async googleSignIn(@Req() req: Request): Promise<any> {
  //   return await this.socialAuthService.googleSignIn(req.body.code);
  // }
  //================================================================================================

  // @Post('google/token')
  // async requestJsonWebTokenAfterGoogleSignIn(@Req() req: Request): Promise<IToken> {
  //   return await this.socialAuthService.createToken(req.user);
  // }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      payload: req.user,
    };
  }

  //================================================================================================
  // User Profile
  // @Get('init')
  // @Public()
  // @Throttle({ default: { limit: 2, ttl: 60000 } })
  // @UseGuards(AppThrottlerGuard)
  // async init(@Req() req) {
  //   const data = await this.authWebService.initializeRootUser();
  //   return data;
  //   // curl http://localhost:3001/api/web/auth/init
  // }

  /* 
  Failed to execute ‘postMessage’ on ‘DOMWindow’: The target origin provided (‘http://localhost:4201’) does not match the recipient window’s origin (‘http://localhost:3000’)
  */
  // User Profile
  @Get('profile')
  @Roles(...KeysOf(ROLE))
  async getMyProfile(@Req() req) {
    const data = await this.getUserService.getBy({ id: Number(req.user.uid) });
    return data;
  }
  @Get('/validate-registration')
  @HttpCode(HttpStatus.OK)
  @Public()
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  async validateRegistration(@Query(new ValidationPipe({ transform: true })) dto: PhoneEmailValidationDto) {
    const payload = new PhoneEmailValidationPayload(dto);
    const result = await this.phoneAndEmailValidationService.validate(payload);
    return result;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  @ActivityTitle('End user self register')
  async selfRegister(@Body() dto: RegisterEUserDto, @Req() req, @Ip() ip) {
    const device = this.globalConfigService.getUa(req);
    const requestInfo: IRequestInfo = { channel: 'WEB', ip, realm: 'CUSTOMER', device };

    const builder = CustomerFactory.get({ ...dto, role: 'EUSER' }, requestInfo);
    const user = await this.createUserService.createUser(builder);
    const smsPayload = builder.getNotificationDetail(user.id);
    await this.notify.sendAuthSMS(smsPayload);
    await this.notify.sendWelcomeEmail(user, smsPayload.otpCode, smsPayload.password);
    return new DetailResponse(null);
  }

  // Web Login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  async login(@Body() dto: PasswordLoginDto, @Req() req, @Ip() ip, @Res({ passthrough: true }) res: Response) {
    this.helper.validateChannel(req, 'WEB');
    const device = this.globalConfigService.getUa(req);
    const realm = this.helper.getAccessRealm(req);
    console.log('......', { channel: 'WEB', ip, realm, device });
    const payload = new LoginPayload(dto, { channel: 'WEB', ip, realm, device });
    const result = await this.loginService.login(payload);
    if (result && result.success) {
      const azp: AzpType = realm && realm === 'ADMIN' ? 'te-manager-web' : 'te-customer-web';
      // console.log('\n', `result.data['subscription']`, result.data['subscription'], '\n');

      const { refreshToken, ...resp } = await this.tokenService.createTokenPair(result.data['user'] as UserEntity, azp);
      if (refreshToken) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(refreshToken, req);
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
  async verifyUserOtp(@Body() dto: VerifyOtpDto, @Req() req, @Ip() ip) {
    this.helper.validateChannel(req, 'WEB');
    const realm = this.helper.getAccessRealm(req);
    const device = this.globalConfigService.getUa(req);
    const payload = new VerifyOtpPayload(dto, { channel: 'WEB', ip, realm, device });
    const result = await this.verifyOTPService.verify(payload);
    return result;
  }

  // Set Password
  @Post('set-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async setUserPassword(@Body() dto: SetPasswordDto, @Req() req, @Ip() ip, @Res({ passthrough: true }) res: Response) {
    this.helper.validateChannel(req, 'WEB');
    const realm = this.helper.getAccessRealm(req);
    const device = this.globalConfigService.getUa(req);

    const payload = new SetCredentialPayload(dto, { channel: 'WEB', ip, realm, device });
    const { data, ...msgResponse } = await this.setCredentialService.setCredential(payload);

    if (data && msgResponse.success) {
      const azp: AzpType = realm && realm === 'ADMIN' ? 'te-manager-web' : 'te-customer-web';
      // const { refreshToken, ...resp } = await this.tokenService.createTokenPair(data, azp);
      const { refreshToken, ...resp } = await this.tokenService.createTokenPair(data, azp);

      if (refreshToken) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(refreshToken, req);
        res.setHeader('set-cookie', refresh_cookie);
      }
      return { ...resp, success: true, statusCode: 200, message: 'OK' };
    }
    return msgResponse;
  }

  // Change Own Password
  @Post('change-my-password')
  @Roles(...KeysOf(ROLE))
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Change own Password')
  async changeMyPassword(@Body() dto: ChangeOwnPasswordDto, @Req() req, @Ip() ip, @Res({ passthrough: true }) res: Response) {
    this.helper.validateChannel(req, 'WEB');
    const realm = this.helper.getAccessRealm(req);
    const device = this.globalConfigService.getUa(req);
    const userId = Number(req.user.uid);
    const payload = new ChangeOwnCredentialPayload(dto, { channel: 'WEB', ip, realm, device, createdBy: userId });
    const { data, ...msgResponse } = await this.changeOwnCredentialService.change(payload);

    if (data && msgResponse.success) {
      const azp: AzpType = realm && realm === 'ADMIN' ? 'te-manager-web' : 'te-customer-web';
      // const { refreshToken, ...resp } = await this.tokenService.createTokenPair(data, azp);
      const { refreshToken, ...resp } = await this.tokenService.createTokenPair(data, azp);

      if (refreshToken) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(refreshToken, req);
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
  @Roles(...KeysOf(ROLE))
  @ActivityTitle('Reset User Password')
  async resetUserPassword(@Body() dto: ResetWebLoginDto, @Req() req, @Ip() ip) {
    this.helper.validateChannel(req, 'WEB');
    const realm = this.helper.getAccessRealm(req);
    const device = this.globalConfigService.getUa(req);
    // const userId = Number(req.user.uid);
    const payload = new ResetWebLoginPayload(dto, { channel: 'WEB', ip, realm, device });

    const result = await this.resetUserPasswordService.reset(payload);
    return result;
  }

  // Resend OTP Code
  @Post('resend-otp')
  @Public()
  @Throttle({ default: { limit: 1, ttl: 20000 } })
  @UseGuards(AppThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async resendUserOtp(@Body() dto: ResendOtpDto, @Req() req, @Ip() ip) {
    this.helper.validateChannel(req, 'WEB');
    const realm = this.helper.getAccessRealm(req);
    const device = this.globalConfigService.getUa(req);
    // const userId = Number(req.user.uid);
    const payload = new ResendOtpPayload(dto, { channel: 'WEB', ip, realm, device });
    const result = await this.resendOtpService.resend(payload);
    return result;
  }

  // FORGOT Password
  // @Post('forgot-password')
  // @Public()
  // @HttpCode(HttpStatus.OK)
  // @UsePipes(ValidationPipe)
  // async forgotPassword(@Body() forgotPassword: ForgotCredentialDto, @Req() req) {
  //
  //     const isloadtest = req.headers.isloadtest;
  //     const origin = isloadtest ? `https://manage.${this.serverDns}` : req.headers.origin;

  //     if (!this.helper.isWebAccess(req) && !isloadtest) {
  //       throw new UnauthorizedException(`The value '${origin}' is not a valid web login request origin`);
  //     }
  //     const realm = isloadtest ? 'ADMIN' : this.helper.getAccessRealm(req);
  //     const userAgent = this.globalConfigService.getUa(req);
  //     const deviceUuid = forgotPassword.deviceUuid ? forgotPassword.deviceUuid : origin;
  //     const response = await this.forgotCredentialService.forgotCredential({
  //       ...forgotPassword,
  //       deviceUuid,
  //       realm,
  //       userAgent,
  //       accessChannel: 'WEB',
  //     });
  //     return response;
  //   } catch (error) {
  //     throw new HttpException(error, error.statusCode || 500);
  //   }
  // }

  // Refresh Access Token
  @Post('refresh')
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async refresh(@Body() refreshDto: RefreshTokenDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const isWebAccess = this.helper.isWebAccess(req);
      const origin = req.headers.origin;
      if (!isWebAccess) {
        throw new UnauthorizedException(`The value '${origin}' is not a valid web request origin`);
      }

      const azp: AzpType = this.helper.getAzp(req);
      // refreshDto.refreshToken = isWebAccess ? req.cookies?.ref_tr_et_token : refreshDto.refreshToken;
      Logger.log({ message: 'refreshDto', meta: refreshDto, context: WebAuthController.name });
      refreshDto.refreshToken = req.cookies?.ref_tr_et_token;
      Logger.log({ message: 'req.cookies?.ref_tr_et_token', meta: req.cookies?.ref_tr_et_token, context: WebAuthController.name });

      const result = await this.authCommonService.refreshAccessToken(refreshDto, azp);

      Logger.log({ message: 'result', meta: result, context: WebAuthController.name });
      const { refreshToken, ...resp } = result;
      if (isWebAccess && result?.refreshToken) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(result.refreshToken, req);
        res.setHeader('set-cookie', refresh_cookie);
        Logger.log({
          message: `{ ...resp, success: true, statusCode: 200, message: 'OK' }`,
          meta: { ...resp, success: true, statusCode: 200, message: 'OK' },
          context: WebAuthController.name,
        });

        return { ...resp, success: true, statusCode: 200, message: 'OK' };
      }
      Logger.log({ message: 'should not reach here....', meta: {}, context: WebAuthController.name });
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
      const isWebAccess = this.helper.isWebAccess(req);
      const origin = req.headers.origin;
      if (!isWebAccess) {
        throw new UnauthorizedException(`The value '${origin}' is not a valid web request origin`);
      }
      const azp: AzpType = this.helper.getAzp(req);

      refreshDto.refreshToken = isWebAccess ? req.cookies?.ref_tr_et_token : refreshDto.refreshToken;
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

```


## User Management

1. Company User Can register/update other company users

   Register: POST /manage/company-users
   Update  : PUT /manage/company-users

2. Company User Can register [AGENT, MERCHANT, SALES]

   Register: POST /manage/customers
   Update  : PUT /manage/customers

3. Customer User [AGENT, SUB-AGENT, MERCHANT, SALES], Can manage child customers [SUB-AGENT, RETAILER]

   /sub-agents
   /retailers
   /customers



## TG

https://oauth.telegram.org/auth?bot_id=YOUR_BOT_ID&scope=YOUR_SCOPE&public_key=YOUR_PUBLIC_KEY&nonce=YOUR_NONCE

// possible scopes: messages, photos, videos, documents, audio, voice, stickers, inline_queries, video_notes, and any combination of them separated by commas like photos, videos.

// for authentication, we can use the scope as : 

https://oauth.telegram.org/auth?bot_id=6824594124&scope=write

&public_key=YOUR_PUBLIC_KEY&nonce=YOUR_NONCE


https://api.telegram.org/bot6824594124:AAHKc02z7qam7FAuk3hJL35B5Vfggd_NK3Q/getMe


{
  "ok": true,
  "result": {
    "id": 6824594124,
    "is_bot": true,
    "first_name": "Test",
    "username": "transfer_test_auth_bot",
    "can_join_groups": true,
    "can_read_all_group_messages": false,
    "supports_inline_queries": false
  }
}
