import { applyDecorators, BadRequestException, Injectable, mixin, NestInterceptor, Type, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { catchError, isObservable, throwError } from 'rxjs';
import { IUploadFilesParam, UploadFilesParam } from './upload-files.decorator';

interface LocalFilesInterceptorOptions {
  fieldName: string;
  maxCount: number;
  path?: string;
  fileFilter?: MulterOptions['fileFilter'];
  limits?: MulterOptions['limits'];
}

interface RequestWithFilePath extends Request {
  filePath?: string;
}

function parseFormData(files: any, body: any) {
  const data = { ...body };

  for (const field of Object.keys(files)) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [root, ...paths] = field.split('.');
    let target = data;

    for (const path of paths.slice(0, -1)) {
      if (path.endsWith(']')) {
        const index = parseInt(path.slice(0, -1), 10);
        target = target[index] = target[index] || {};
      } else {
        target = target[path] = target[path] || {};
      }
    }

    const lastPath = paths[paths.length - 1];
    if (lastPath.endsWith(']')) {
      const index = parseInt(lastPath.slice(0, -1), 10);
      target[index] = files[field][0].buffer;
    } else {
      target[lastPath] = files[field][0].buffer;
    }
  }

  return data;
}

export function UploadFilesInterceptor(options: IUploadFilesParam): MethodDecorator {
  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor([
        {
          name: options.fieldName || options.documentType,
          maxCount: options.maxCount || 1,
        },
      ]),
    ),
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value;

      descriptor.value = function (...args: any[]) {
        const [req] = args;
        req.body = parseFormData(req.files, req.body);

        if (options.required && !req.files[options.fieldName || options.documentType]) {
          throw new Error(`${options.documentType} file is required`);
        }

        return originalMethod.apply(this, args);
      };

      return descriptor;
    },
  );
}

export function ConditionalUploadFiles(options: IUploadFilesParam): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      console.log('ConditionalUploadFiles -> args', args);
      const [req] = args;
      if (req.headers['content-type'].startsWith('multipart/form-data')) {
        const decorators = UploadFiles1(options);
        decorators(target, propertyKey, descriptor);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
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
          filename: (req: RequestWithFilePath, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            const filename = `${randomName}${extname(file.originalname)}`;
            cb(null, filename);
            // Add the file path to the request for later use
            req.filePath = join(destination, filename);
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

export const UploadFiles1 = (options: IUploadFilesParam): MethodDecorator & ClassDecorator => {
  const { documentType, fieldName, maxCount, required, formats } = new UploadFilesParam(options);
  return applyDecorators(
    UseInterceptors(
      LocalFilesInterceptor({
        fieldName,
        maxCount,
        path: `/uploaded-files/${documentType}`,
        fileFilter: (request, file, callback) => {
          if (required && !file) {
            return callback(new BadRequestException('Valid file is required'), false);
          }
          const fileFormat = file.mimetype.split('/')[1];
          if (!formats.includes(fileFormat)) {
            return callback(new BadRequestException(`Provide a valid document. Accepted formats: ${formats.join(', ')}`), false);
          }
          callback(null, true);
        },
        limits: {
          fileSize: Math.pow(10240, 2), // 10MB
        },
      }),
    ),
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value;

      descriptor.value = function (...args: any[]) {
        const [req] = args;
        req.body.filePath = req.filePath; // Add the file path to the request body

        return originalMethod.apply(this, args);
      };

      return descriptor;
    },
  );
};
