import { DetailResponse } from '@app/shared';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class CommonNotificationService {
  constructor(@InjectQueue('SMSProcessor') private readonly smsQueue: Queue, @InjectQueue('MailProcessor') private readonly mailQueue: Queue) {}

  //// new

  public async retrySendingSMS(notificationId: number) {
    await this.smsQueue.add('retrySendSms', { id: notificationId });
    return new DetailResponse();
  }
}
