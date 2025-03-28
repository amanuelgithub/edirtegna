import { ConfigModule } from '@app/config';
import { NOTIFICATION_ENTITIES } from '@app/db';
import { GlobalConfigModule } from '@app/global-config';
import { TypeOrmModule } from '@app/typeorm';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';
import 'reflect-metadata';
import { NotificationController, WebNotificationController } from './contorllers';
import { CommonNotificationService, NotificationService, NotificationV2Service, TransactionNotificationService, UserNotificationService } from './services';
@Module({
  imports: [
    DiscoveryModule,
    TypeOrmModule.forFeature(NOTIFICATION_ENTITIES),
    GlobalConfigModule,
    BullModule.registerQueueAsync(
      {
        name: 'SMSProcessor',
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => config.get('bull'),
        inject: [ConfigService],
      },
      {
        name: 'MailProcessor',
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => config.get('bull'),
        inject: [ConfigService],
      },
    ),
  ],
  controllers: [NotificationController, WebNotificationController],
  providers: [NotificationService, UserNotificationService, TransactionNotificationService, NotificationV2Service, CommonNotificationService],
  exports: [NotificationService, UserNotificationService, TransactionNotificationService, NotificationV2Service, CommonNotificationService],
})
export class NotificationModule {}
