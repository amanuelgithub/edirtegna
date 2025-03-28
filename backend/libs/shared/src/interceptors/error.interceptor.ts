import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { DetailResponse } from '../dtos';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        Logger.error({
          message: err?.message?.toString() || err,
          meta: { source: err?.source, stack: err?.stack, context: ErrorsInterceptor.name },
          stack: err,
          context: ErrorsInterceptor.name,
        });
        const response = err?.response?.message?.toString() || err?.message?.toString() || err;
        const resp = err?.response || err;
        if (resp instanceof HttpException) {
          const detailResponse = new DetailResponse(null, response, false, resp?.getStatus());
          return Promise.resolve(detailResponse);
        } else if (err instanceof HttpException) {
          const detailResponse = new DetailResponse(null, response, false, err?.getStatus());
          return Promise.resolve(detailResponse);
        } else {
          const detailResponse = new DetailResponse(null, response, false, HttpStatus.INTERNAL_SERVER_ERROR);
          return Promise.resolve(detailResponse);
        }
      }),
    );
  }
}
