import { GlobalConfigService, NotificationConfigDto } from '@app/global-config';
import { IMailNotifier, ISMSNotifier, ISMSPayload, IWalletTransactionMail } from '@app/shared';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';

@Injectable()
export class TransactionNotificationService {
  constructor(
    private readonly CONF: ConfigService,
    private readonly globalConfigService: GlobalConfigService,
    @InjectQueue('SMSProcessor') private readonly smsQueue: Queue,
    @InjectQueue('MailProcessor') private readonly mailQueue: Queue,
  ) {}
  private async _getNotificationConfig() {
    const config = (await this.globalConfigService.getConfigByKey<NotificationConfigDto>('notification')) as NotificationConfigDto;
    return config;
  }

  //// new

  public async retrySendingSMS(notificationId: number) {
    await this.smsQueue.add('retrySendSms', { id: notificationId });
  }
  public async sendWalletTransactionSMS(notifier: ISMSNotifier) {
    // if ((await this._getWalletConfig())?.smsOnCashWalletCredit) {
    const notificationConfig = await this._getNotificationConfig();
    if (notificationConfig.isSmsNotificationInSimulation) {
      for (let i = 0; i < notificationConfig.smsNotificationSimulationDestinations.length; i++) {
        const to = notificationConfig.smsNotificationSimulationDestinations[i];
        notifier.updateDestination(to);
        await this.smsQueue.add('sendSms', notifier.getData());
      }
    } else {
      await this.smsQueue.add('sendSms', notifier.getData());
    }
    // }
  }

  // telebirr -alert
  public async alertOnApiFailure(context: string) {
    const notificationConfig = await this._getNotificationConfig();
    if (notificationConfig && notificationConfig?.sendSmsOnTelebirrApiFailure) {
      const { companySmsAlertDestinations } = notificationConfig;
      const text = `EVD Telebirr API ${context} failure alert!` + `API is down at : ${new Date().toISOString()}.`;
      for (let i = 0; i < companySmsAlertDestinations.length; i++) {
        const to = companySmsAlertDestinations[i];
        const notification: ISMSPayload = { to, text, subject: `TELEBIRR_SYS_ALERT`, userId: 1 };
        await this.smsQueue.add('sendSms', notification);
      }
    }
  }
  // auditMismatch -alert
  public async alertAuditMismatch(context: string) {
    const notificationConfig = await this._getNotificationConfig();
    if (notificationConfig && notificationConfig?.sendSmsOnAuditMismatchDetection) {
      const { companySmsAlertDestinations } = notificationConfig;

      const dated = new Date().toLocaleDateString('en', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }); //en is language option, you may specify..

      const text = `Audit alert! : ${context}` + `@ : ${dated}.`;
      for (let i = 0; i < companySmsAlertDestinations.length; i++) {
        const to = companySmsAlertDestinations[i];
        const notification: ISMSPayload = { to, text, subject: `AUDIT_SYS_ALERT`, userId: 1 };
        await this.smsQueue.add('sendSms', notification);
      }
    }
  }

  /// mail
  public async sendWalletTransactionMail(notifier: IMailNotifier<IWalletTransactionMail>) {
    await this.mailQueue.add('walletTransactionNotificationMail', notifier.getMailData());
  }
}
