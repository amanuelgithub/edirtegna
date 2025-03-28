import { applyDecorators, BadRequestException, UseInterceptors } from '@nestjs/common';
import { LocalFilesInterceptor } from '../interceptors';

export const UploadFiles = (options: IUploadFilesParam): MethodDecorator & ClassDecorator => {
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
  );
};

export interface IUploadFilesParam {
  documentType: string;
  fieldName?: string;
  maxCount?: number;
  required?: boolean;
  formats?: string[];
}

export class UploadFilesParam {
  documentType: string;
  fieldName?: string;
  maxCount?: number;
  required?: boolean;
  formats?: string[];
  constructor(options: IUploadFilesParam) {
    this.documentType = options.documentType;
    this.fieldName = options.fieldName || 'files';
    this.maxCount = options.maxCount || 1;
    this.required = options.required || false;
    this.formats = options.formats || ['pdf', 'docx', 'xlsx', 'jpg', 'png', 'jpeg'];
  }
}
