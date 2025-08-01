import { ModuleAsyncOptions, ModuleUtil } from '@app/shared';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LOGGER_MODULE_OPTIONS } from './logger.constants';
import { LoggerInterceptor } from './logger.interceptor';
import { LoggerService } from './logger.service';

export interface LoggerModuleOptions {
  appName?: string;
  level?: string;
  path?: string;
  colorize?: boolean;
  rotate?: {
    enabled?: boolean;
    pattern?: string;
    maxSize?: string | number;
    maxFiles?: string | number;
    zipArchive?: boolean;
  };
}

@Global()
@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions = {}): DynamicModule {
    return this.createModule([
      {
        provide: LOGGER_MODULE_OPTIONS,
        useValue: options,
      },
    ]);
  }

  static forRootAsync(options: ModuleAsyncOptions<LoggerModuleOptions>): DynamicModule {
    const { providers, imports } = ModuleUtil.makeAsyncImportsAndProviders(options, LOGGER_MODULE_OPTIONS);
    return this.createModule(providers, imports);
  }

  static createModule(providers: any[] = [], imports: any[] = []): DynamicModule {
    return {
      module: LoggerModule,
      imports: [...imports],
      providers: [
        ...providers,
        LoggerService,
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggerInterceptor,
        },
      ],
      exports: [LOGGER_MODULE_OPTIONS, LoggerService],
    };
  }
}
