import { ModuleUtil } from '@app/shared';
import { DynamicModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModuleOptions, ConfigModule as NestjsConfigModule } from '@nestjs/config';
import { CONFIG_MODULE_OPTIONS } from './config.constants';
import { ConfigMiddleware } from './config.middleware';
import configuration from './configuration';

@Module({
  imports: [
    NestjsConfigModule.forRoot({
      envFilePath: ModuleUtil.getEnvFiles(),
      // envFilePath: FilesUtil.getEnvPath(),
      load: [configuration],
      isGlobal: true,
    }),
  ],
  exports: [NestjsConfigModule],
})
export class ConfigModule implements NestModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    return this.createModule(
      [
        {
          provide: CONFIG_MODULE_OPTIONS,
          useValue: options,
        },
      ],
      [
        NestjsConfigModule.forRoot({
          ...options,
          envFilePath: [...ModuleUtil.getEnvFiles(), ...(options.envFilePath || [])],
          load: [configuration, ...(options.load || [])],
          isGlobal: options.isGlobal ?? true,
        }),
      ],
    );
  }

  static createModule(providers: any[] = [], imports: any[] = []): DynamicModule {
    return {
      module: ConfigModule,
      imports: [...imports],
      providers: [...providers, ConfigMiddleware],
      exports: [CONFIG_MODULE_OPTIONS, NestjsConfigModule, ConfigMiddleware],
    };
  }

  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(ConfigMiddleware).forRoutes('*');
  }
}
