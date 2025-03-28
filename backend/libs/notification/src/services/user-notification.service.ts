import { UserEntity } from '@app/db';
import { GlobalConfigService, NotificationConfigDto } from '@app/global-config';
import { AccessUserAgent, IEMail, IResendOtp, IResetPasswordMail, ISMSPayload, IWelcomeUser } from '@app/shared';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { IAccountSMS, IAccountSMSBody } from '../dtos';

@Injectable()
export class UserNotificationService {
  constructor(
    private readonly CONF: ConfigService,
    private readonly globalConfigService: GlobalConfigService,
    @InjectQueue('SMSProcessor') private readonly smsQueue: Queue,
    @InjectQueue('MailProcessor') private readonly mailQueue: Queue,
  ) {}
  //   SMS PARTS
  private _dear_name = (name: string) => `Dear ${name},`;
  private _your_otp = (otpCode: number) => `\nVerification code: ${otpCode}`;
  private _your_password = (password: string) => `\nWeb login: ${password}`;
  private _your_pin = (pinCode: number) => `\nLogin PIN code: ${pinCode}`;
  private _closing = () => `\nThank you for choosing ${this.CONF.get('app').name}!`;

  private _makeSMSBody(data: IAccountSMSBody): string {
    const { name, otpCode, password, pinCode, msg } = data;
    const namePart = name ? this._dear_name(name) : '';
    const msgPart = msg ? msg : '';
    const otpPart = otpCode ? this._your_otp(otpCode) : '';
    const pinPart = pinCode ? this._your_pin(pinCode) : '';
    const passwordPart = password ? this._your_password(password) : '';
    const closingPart = this._closing();

    const message = `${namePart} ${msgPart} ${otpPart} ${pinPart} ${passwordPart} ${closingPart}`;

    return message;
  }
  private async _getNotificationConfig() {
    const config = (await this.globalConfigService.getConfigByKey<NotificationConfigDto>('notification')) as NotificationConfigDto;
    return config;
  }
  public async sendAuthSMS(data: IAccountSMS) {
    const { destination, subject, userId, ...body } = data;
    const notificationConfig = await this._getNotificationConfig();

    const text = await this._makeSMSBody(body);

    if (notificationConfig?.isSmsNotificationInSimulation) {
      for (let i = 0; i < notificationConfig?.smsNotificationSimulationDestinations.length; i++) {
        const to = notificationConfig?.smsNotificationSimulationDestinations[i];
        const notification: ISMSPayload = { to, text, subject, userId };
        await this.smsQueue.add('sendSms', notification);
      }
    } else {
      const to = `251${destination}`;
      const notification: ISMSPayload = { to, text, subject, userId };
      await this.smsQueue.add('sendSms', notification);
    }
  }
  public async sendWelcomeEmail(data: UserEntity, otpCode: number, password: string) {
    if (data.email) {
      const loginUrl = data?.realm === 'ADMIN' ? `${this.CONF.get('app').webAdminUrl}` : `${this.CONF.get('app').webCustomerUrl}`;
      const fullName = `${data?.userProfile?.firstName} ${data?.userProfile?.middleName || ''} ${data?.userProfile?.lastName || ''}`?.trim();
      const payload: IEMail<IWelcomeUser> = {
        to: data.email,
        userId: data.id,
        context: { loginUrl, fullName, otpCode, password },
      };
      await this.mailQueue.add('sendWelcomeMail', payload);
    }
  }
  public async sendResendOTPEmail(data: UserEntity, otpCode: number, ua: AccessUserAgent) {
    if (data.email) {
      const browserName = `${ua.browser?.name} ${ua?.browser?.version} ${ua?.browser?.major}`?.trim();
      const operatingSystem = `${ua?.os?.name} ${ua?.os?.version}`?.trim();
      const fullName = `${data?.userProfile?.firstName} ${data?.userProfile?.middleName || ''} ${data?.userProfile?.lastName || ''}`?.trim();
      const payload: IEMail<IResendOtp> = {
        to: data.email,
        userId: data.id,
        context: {
          browserName,
          operatingSystem,
          supportUrl: this.CONF.get('app').supportUrl,
          fullName,
          otpCode,
        },
      };
      await this.mailQueue.add('sendResendOTPMail', payload);
    }
  }
  public async sendResetPasswordEmail(data: UserEntity, password: string, ua: AccessUserAgent) {
    if (data.email) {
      const browserName = `${ua.browser?.name} ${ua?.browser?.version} ${ua?.browser?.major}`?.trim();
      const operatingSystem = `${ua?.os?.name} ${ua?.os?.version}`?.trim();
      const loginUrl = data?.realm === 'ADMIN' ? `${this.CONF.get('app').webAdminUrl}` : `${this.CONF.get('app').webCustomerUrl}`;
      const fullName = `${data?.userProfile?.firstName} ${data?.userProfile?.middleName || ''} ${data?.userProfile?.lastName || ''}`?.trim();
      const payload: IEMail<IResetPasswordMail> = {
        to: data.email,
        userId: data.id,
        context: {
          browserName,
          operatingSystem,
          supportUrl: this.CONF.get('app').supportUrl,
          fullName,
          password,
          loginUrl,
        },
      };
      await this.mailQueue.add('sendResetPasswordMail', payload);
    }
  }
}
