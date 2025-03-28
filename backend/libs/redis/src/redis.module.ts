import { DynamicModule, Module } from '@nestjs/common';
import { RedisOptions } from 'ioredis';
import { REDIS_MODULE_OPTIONS } from './redis.constants';
import { RedisService } from './redis.service';

export type RedisModuleOptions = RedisOptions;

@Module({})
export class RedisModule {
  static forRoot(options: RedisModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: REDIS_MODULE_OPTIONS,
          useValue: options,
        },
        RedisService,
      ],
      exports: [REDIS_MODULE_OPTIONS, RedisService],
      global: true,
    };
  }
  static forRootAsync(options: any): DynamicModule {
    return {
      module: RedisModule,
      imports: options.imports,
      providers: [
        {
          provide: REDIS_MODULE_OPTIONS,
          inject: options.injects,
          useFactory: options.useFactory,
        },
        RedisService,
      ],
      exports: [REDIS_MODULE_OPTIONS, RedisService],
      global: true,
    };
  }
}
