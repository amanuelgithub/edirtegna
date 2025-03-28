import { BadRequestException, Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { catchError, isObservable, throwError } from 'rxjs';

interface LocalFilesInterceptorOptions {
  fieldName: string;
  maxCount: number;
  path?: string;
  fileFilter?: MulterOptions['fileFilter'];
  limits?: MulterOptions['limits'];
}

export const LocalFilesInterceptor = (options: LocalFilesInterceptorOptions): Type<NestInterceptor> => {
  @Injectable()
  class Interceptor implements NestInterceptor {
    filesInterceptor: NestInterceptor;

    constructor(configService: ConfigService) {
      const filesDestination = configService.get('APP_IMAGES_LOCATION') || 'images';
      const destination = `${filesDestination}${options.path}`;

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination,
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        fileFilter: options.fileFilter,
        limits: options.limits,
      };

      this.filesInterceptor = new (FilesInterceptor(options.fieldName, options.maxCount, multerOptions))();
    }
    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      const result = this.filesInterceptor.intercept(...args);
      if (isObservable(result)) {
        return result.pipe(
          catchError((error) => {
            console.error('File upload error:', error);
            return throwError(() => new BadRequestException(error?.message || error));
          }),
        );
      } else {
        return Promise.resolve(result).catch((error) => {
          throw new BadRequestException(error?.message || error);
        });
      }
    }
  }
  return mixin(Interceptor);
};
