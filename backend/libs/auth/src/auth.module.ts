import { GlobalConfigModule } from '@app/global-config';
import { NotificationModule } from '@app/notification';
import { UserModule } from '@app/user';
import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppAuthController, ClientAuthController, ManageAuthWebController, WebAuthController } from './controllers';
import {
  AuthCommonService,
  AuthHelperService,
  AuthWebService,
  ChangeOwnCredentialService,
  ForgotCredentialService,
  LoginService,
  ResendOtpService,
  ResetUserPasswordService,
  SetCredentialService,
  TokenService,
  VerifyOTPService,
} from './services';
import { JwtStrategy } from './strategies';
const providers = [
  AuthCommonService,
  AuthHelperService,
  AuthWebService,
  ChangeOwnCredentialService,
  LoginService,
  ForgotCredentialService,
  ResendOtpService,
  ResetUserPasswordService,
  SetCredentialService,
  TokenService,
  VerifyOTPService,
  // strategies
  JwtStrategy,
];

const controllers = [ManageAuthWebController, WebAuthController, AppAuthController, ClientAuthController];

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return { ...configService.get('jwt') };
      },
      inject: [ConfigService],
    }),
    forwardRef(() => NotificationModule),
    forwardRef(() => GlobalConfigModule),
    forwardRef(() => UserModule),
  ],
  providers,
  controllers,
  exports: providers,
})
export class AuthModule {}
