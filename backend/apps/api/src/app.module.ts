import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from '@app/logger';
import { ConfigModule } from '@app/config';
import { TypeOrmModule } from '@app/typeorm';
import { ParameterModule } from '@app/parameter';
import { UserModule } from '@app/user';
import { AuthModule } from '@app/auth';
import { NotificationModule } from '@app/notification';
import { GlobalConfigModule } from '@app/global-config';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from '@app/auth/guards';
import { JsonBodyMiddleware, RawBodyMiddleware } from '@app/shared/middleware';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({ expandVariables: true }),
    TypeOrmModule.forRoot({
      synchronize: true,
      autoLoadEntities: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          // below a user can make 10 requests within 60 seconds (60000 msec)
          name: 'default',
          // ttl: the time to live
          ttl: config.get('THROTTLE_TTL') || 60000,
          // limit:  the maximum number of requests within the ttl
          limit: config.get('THROTTLE_LIMIT') || 10,
          storage: new ThrottlerStorageRedisService(config.get('redis')),
        },
      ],
    }),

    ParameterModule,
    UserModule,
    AuthModule,
    NotificationModule,
    GlobalConfigModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({
        path: '/web/callback-webhook',
        method: RequestMethod.POST,
      })
      .apply(JsonBodyMiddleware)
      .forRoutes('*');
  }
}
