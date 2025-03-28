import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { ConfigModule } from '@app/config';
import { LoggerModule } from '@app/logger';
import { RedisModule } from '@app/redis';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { NotificationModule } from '@app/notification';
import { TypeOrmModule } from '@app/typeorm';
import { ENTITIES } from '@app/db';

@Module({
  imports: [
    ConfigModule.forRoot({ expandVariables: true }),
    LoggerModule.forRoot(),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      injects: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('redis'),
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
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
    NotificationModule,
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    TypeOrmModule.forFeature(ENTITIES),
  ],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
