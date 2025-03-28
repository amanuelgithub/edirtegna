import { NotificationEntity } from '@app/db';
import { CreateNotificationDto, NotificationService } from '@app/notification';
import { IEMail, IResendOtp, IResetPasswordMail, IWelcomeUser } from '@app/shared';
import { BullQueueEvents, OnQueueActive, OnQueueEvent, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Mailman } from '@squareboat/nest-mailman';
import { Job } from 'bull';
import { MailMessageTemplateService } from '../services';

@Processor('MailProcessor')
export class MailProcessor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly notificationService: NotificationService, private readonly mailMessageService: MailMessageTemplateService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`);
  }

  @OnQueueEvent(BullQueueEvents.COMPLETED)
  onComplete(job: Job, result: any) {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result)}`);
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
  }

  private async _createNotification(payload: Partial<CreateNotificationDto>): Promise<number | undefined> {
    const { destination, message, subject, userId } = payload;
    const notification = await this.notificationService.createNotification(
      new NotificationEntity({
        message,
        destination,
        status: 'PENDING',
        subject,
        type: 'EMAIL',
        userId,
      }),
    );
    return notification?.id;
  }

  @Process({ name: 'sendWelcomeMail' })
  async sendWelcomeMail(payload: Job<IEMail<IWelcomeUser>>) {
    this.logger.log('********************************');
    this.logger.log(`Starting Send Welcome Mail...'${payload.id}'`);
    this.logger.log('********************************');
    console.log('\n\ndata is ... ', payload.data, '\n');
    let notficationId;
    try {
      const { context, to, userId } = payload.data;

      notficationId = await this._createNotification({ message: JSON.stringify(context), destination: to, subject: 'WELCOME_EMAIL', userId: userId || 2 });

      const mail = this.mailMessageService.welcomeMail(context);
      await Mailman.init().to(to).send(mail);
      await this.notificationService.updateStatus('SENT', notficationId);
    } catch (error) {
      if (notficationId) {
        await this.notificationService.updateStatus('FAILED', notficationId);
      }
      this.logger.error(`Failed to Send Welcome Mail for '${payload.id}'`, error.stack);
    }
  }

  @Process({ name: 'sendResendOTPMail' })
  async sendResendOTPMail(payload: Job<IEMail<IResendOtp>>) {
    this.logger.log('********************************');
    this.logger.log(`Starting Send Resend OTP Mail...'${payload.id}'`);
    this.logger.log('********************************');
    console.log('\n\ndata is ... ', payload.data, '\n');
    let notficationId;
    try {
      const { context, to, userId } = payload.data;

      notficationId = await this._createNotification({ message: JSON.stringify(context), destination: to, subject: 'RESEND_OTP_EMAIL', userId: userId || 2 });

      const mail = this.mailMessageService.resendOTPMail(context);
      await Mailman.init().to(to).send(mail);
      await this.notificationService.updateStatus('SENT', notficationId);
    } catch (error) {
      if (notficationId) {
        await this.notificationService.updateStatus('FAILED', notficationId);
      }
      this.logger.error(`Failed to Send Resend OTP Mail for '${payload.id}'`, error.stack);
    }
  }

  @Process({ name: 'sendResetPasswordMail' })
  async sendResetPasswordMail(payload: Job<IEMail<IResetPasswordMail>>) {
    this.logger.log('********************************');
    this.logger.log(`Starting Send Reset Password Mail...'${payload.id}'`);
    this.logger.log('********************************');
    console.log('\n\ndata is ... ', payload.data, '\n');
    let notficationId;
    try {
      const { context, to, userId } = payload.data;

      notficationId = await this._createNotification({ message: JSON.stringify(context), destination: to, subject: 'RESET_PASSWORD_MAIL', userId: userId || 2 });

      const mail = this.mailMessageService.resetPasswordMail(context);
      await Mailman.init().to(to).send(mail);
      await this.notificationService.updateStatus('SENT', notficationId);
    } catch (error) {
      if (notficationId) {
        await this.notificationService.updateStatus('FAILED', notficationId);
      }
      this.logger.error(`Failed to Send Reset Password Mail for '${payload.id}'`, error.stack);
    }
  }
}
