import { applyDecorators, BadRequestException, UseInterceptors } from '@nestjs/common';
import { LocalFileInterceptor } from '../interceptors';

export const UploadDocumentFile = (documentType: string, fieldName = 'file', required = false, formats: ('pdf' | 'csv' | 'xls')[] = ['pdf']): MethodDecorator & ClassDecorator => {
  return applyDecorators(
    UseInterceptors(
      LocalFileInterceptor({
        fieldName,
        path: `/uploaded-files/${documentType}`,
        fileFilter: (request, file, callback) => {
          if (required && !file) {
            return callback(new BadRequestException('Valid file is required'), false);
          }
          const isValidFormat = formats.some((format) => file.mimetype.includes(format));
          if (!isValidFormat) {
            return callback(new BadRequestException(`Provide a valid document. Allowed formats: ${formats.join(', ')}`), false);
          }
          callback(null, true);
        },
        limits: {
          fileSize: Math.pow(1024, 2) * 10, // 10MB
        },
      }),
    ),
  );
};
