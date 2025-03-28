import { CallHandler, ExecutionContext, Inject, mixin, NestInterceptor, Optional, Type } from '@nestjs/common';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Observable } from 'rxjs';
import { MulterOptions, transformException } from './options';
const MULTER_MODULE_OPTIONS = 'MULTER_MODULE_OPTIONS';
export type MulterModuleOptions = MulterOptions;

type MulterInstance = any;

/**
 *
 * @param fieldName
 * @param maxCount
 * @param localOptions
 *
 * @publicApi
 */
export function TestFilesInterceptor(fieldName: string, maxCount?: number, localOptions?: MulterOptions): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MulterInstance;

    constructor(
      @Optional()
      @Inject(MULTER_MODULE_OPTIONS)
      options: MulterModuleOptions = {},
    ) {
      const filesDestination = 'images';
      const destination = `${filesDestination}/${'test-path'}`;

      const fileName = (req, files, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        cb(null, `${randomName}${extname(files?.originalname)}`);
      };

      const _opts: MulterOptions = {
        dest: destination,

        storage: diskStorage({
          destination,
          filename: fileName,
        }),
        ...options,
        ...localOptions,
      };
      this.multer = (multer as any)(_opts);
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const ctx = context.switchToHttp();
      await new Promise<void>((resolve, reject) =>
        this.multer.array(fieldName, maxCount)(ctx.getRequest(), ctx.getResponse(), (err: any) => {
          if (err) {
            const error = transformException(err);
            return reject(error);
          }
          resolve();
        }),
      );
      return next.handle();
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor;
}
