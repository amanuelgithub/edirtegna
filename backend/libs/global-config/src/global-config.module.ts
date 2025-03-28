import { ConfigModule } from '@app/config';
import { GlobalConfigEntity } from '@app/db';
import { RedisModule } from '@app/redis';
import { TypeOrmModule } from '@app/typeorm';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './audit';
import { GlobalConfigController } from './controllers';
import { GlobalConfigService } from './services';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      injects: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('redis'),
    }),
    TypeOrmModule.forFeature([GlobalConfigEntity]),
  ],
  controllers: [GlobalConfigController],
  providers: [
    GlobalConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
  exports: [GlobalConfigService],
})
export class GlobalConfigModule {}
