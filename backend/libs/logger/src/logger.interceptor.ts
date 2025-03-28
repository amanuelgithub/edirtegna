import { StringUtil } from '@app/shared';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const ctx = ContextUtil.normalizeContext(context);
    const ctx = context;
    const request = ctx.switchToHttp().getRequest();
    const handler = ctx.getHandler();

    if (Logger.isLevelEnabled('verbose')) {
      this.logger.verbose(
        '[%s] %s %s%s => %j',
        handler?.name,
        request.method,
        StringUtil.sanitizeText(request.originalUrl),
        '',
        // ContextUtil.isGraphQL(context) ? ' {' + ctx.switchToHttp()['args'][3]?.['fieldName'] + '}' : '',
        {
          body: StringUtil.sanitizeData(request.body),
          query: StringUtil.sanitizeData(request.query),
          params: StringUtil.sanitizeData(request.params),
          headers: StringUtil.sanitizeData(request.headers),
          userName: request.user?.name,
          userId: request.user?.uid,
          parentUserId: request.user?.pcid,
          userRoles: Array.isArray(request.user?.roles) ? request.user?.roles : request.user?.role,
          channel: request?.channel,
        },
      );
    }

    const startTime = performance.now();

    // prettier-ignore
    return next.handle()
      .pipe(
        tap(() => {
          const resp = ctx.switchToHttp().getResponse();
          this.logger.verbose('[%s] %s %s +%dms',
            handler?.name,
            resp.statusCode || 200,
            !resp.statusCode || resp.statusCode < 400 ? 'OK' : 'ERROR',
            performance.now() - startTime // this is in ms
          );
        })
      );
  }
}
