import { IResendOtp, IResetPasswordMail, IWelcomeUser } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { MailMessage } from '@squareboat/nest-mailman';

@Injectable()
export class MailMessageTemplateService {
  private productName = 'Transfer.et Operator Distribution Management';

  public welcomeMail(data: IWelcomeUser): MailMessage {
    const { fullName, loginUrl, otpCode, password } = data;
    return MailMessage.init()
      .greeting(`Hello ${fullName} 👋`)
      .line(`Thank you for choosing to use ${this.productName}.`)
      .line(`We’re thrilled to have you on board.`)
      .line(`For reference, here's your account activation information:`)
      .table([{ otpCode, 'Login Page URL': `${loginUrl}`, password }])
      .action('Get Started Now!', `${loginUrl}`)
      .line(`Cheers,`)
      .line(`${this.productName} team`)
      .subject(`Welcome on board!`);
  }

  public resetPasswordMail(data: IResetPasswordMail): MailMessage {
    const { fullName, loginUrl, operatingSystem, browserName, supportUrl, password } = data;
    return MailMessage.init()
      .greeting(`Hi ${fullName} 👋`)
      .line(`You recently requested to reset your password for your ${this.productName} account.`)
      .line(`Use the new password below to access your account.`)
      .table([{ 'Login Page URL': `${loginUrl}`, password }])
      .action('Log in to my Account', `${loginUrl}`)
      .line(`For security, this request was received from a ${operatingSystem} device using ${browserName}.`)
      .line(`If you did not request a password reset, please ignore this email or contact support ( ${supportUrl} ) if you have questions.`)
      .line(`Cheers,`)
      .line(`${this.productName} team`)
      .subject('Password Reset Request');
  }
  public resendOTPMail(data: IResendOtp): MailMessage {
    const { fullName, otpCode, operatingSystem, browserName, supportUrl } = data;
    return MailMessage.init()
      .greeting(`Hi ${fullName} 👋`)
      .line(`You recently requested to resend your verification (OTP) code for your ${this.productName} account.`)
      .line(`Your OTP Code is: ${otpCode}`)
      .line(`For security, this request was received from a ${operatingSystem} device using ${browserName}.`)
      .line(`If you did not request a resend of your OTP, please ignore this email or contact support ( ${supportUrl} ) if you have questions.`)
      .line(`Cheers,`)
      .line(`${this.productName} team`)
      .subject('Resend OTP Request');
  }

  public subscriptionExpiryNoticeMail(): MailMessage {
    return;
  }

  public subscriptionExpiredNoticeMail(): MailMessage {
    return;
  }

  public invoicePaidNotificationMail(): MailMessage {
    return;
  }
}
