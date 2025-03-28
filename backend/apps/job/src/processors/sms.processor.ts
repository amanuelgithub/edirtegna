import { NotificationService } from '@app/notification';
import { IRetrySMSPayload, ISMSPayload } from '@app/shared';
import { BullQueueEvents, OnQueueActive, OnQueueEvent, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { lastValueFrom } from 'rxjs';
import { SMSService } from '../services';

@Processor('SMSProcessor')
export class SMSProcessor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly smsService: SMSService, private readonly notificationService: NotificationService) {}

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

  @Process({ name: 'sendSms' })
  async sendSms(payload: Job<ISMSPayload>) {
    this.logger.log('********************************');
    this.logger.log(`Starting SEND SMS Process '${payload.id}'`);
    this.logger.log('********************************');
    console.log('\n\ndata is ... ', payload.data, '\n');
    let notficationId;
    try {
      const { text, to, subject, userId } = payload.data;
      const notification = await this.notificationService.createNotification({
        message: text,
        status: 'PENDING',
        type: 'SMS',
        destination: to,
        subject: subject || 'Not specified',
        userId: userId || 1,
      });
      notficationId = notification?.id;
      const smsGwResult = await lastValueFrom(this.smsService.sendSms(payload.data));
      console.log(smsGwResult);
      if (smsGwResult.status === 200) {
        await this.notificationService.updateStatus('SENT', notification.id);
      } else {
        await this.notificationService.updateStatus('FAILED', notification.id);
      }
    } catch (error) {
      if (notficationId) {
        await this.notificationService.updateStatus('FAILED', notficationId);
      }
      this.logger.error(`Failed to process SMS for '${payload.id}'`, error.stack);
    }
  }
  @Process({ name: 'retrySendSms' })
  async retrySendSms(payload: Job<IRetrySMSPayload>) {
    this.logger.log('********************************');
    this.logger.log(`Starting RETRY SEND SMS Process '${payload.id}'`);
    this.logger.log('********************************');
    console.log('\n\ndata is ... ', payload.data, '\n');
    let notficationId;
    try {
      if (!payload || !payload?.data || !payload?.data?.id) {
        this.logger.log(`Notification Id is required for RETRY SEND SMS Process.`);
        return;
      }
      notficationId = payload.data.id;
      const { data: _notification } = await this.notificationService.getNotificationById(notficationId);

      if (!_notification) {
        this.logger.log(`Notification record not found with id: ${notficationId}`);
        return;
      }
      if (_notification && _notification.status !== 'FAILED') {
        this.logger.log(`Notification record needs to be in FAILED state for retry`);
        return;
      }
      if (_notification && _notification.type !== 'SMS') {
        this.logger.log(`Notification record is not valid for this operation`);
        return;
      }

      const { id, destination, subject, userId, message } = _notification;
      notficationId = id;
      const _payload: ISMSPayload = { text: message, to: destination, subject: subject, userId };
      const smsGwResult = await lastValueFrom(this.smsService.sendSms(_payload));
      console.log(smsGwResult);
      if (smsGwResult.status === 200) {
        await this.notificationService.updateStatus('SENT', notficationId);
      } else {
        await this.notificationService.updateStatus('FAILED', notficationId);
      }
    } catch (error) {
      if (notficationId) {
        await this.notificationService.updateStatus('FAILED', notficationId);
      }
      this.logger.error(`Failed to process SMS for '${payload.id}'`, error.stack);
    }
  }
}
