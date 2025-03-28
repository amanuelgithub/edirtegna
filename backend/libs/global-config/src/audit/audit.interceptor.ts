import { ActivityLogEntity } from '@app/db';
import { StringUtil } from '@app/shared';
import { CreateActivityLogDto } from '@app/user';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { GeneralConfigDto } from '../dto';
import { GlobalConfigService } from '../services';
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly ds: DataSource, private globalConfigService: GlobalConfigService, private readonly _reflector: Reflector) {}
  private async _getGlobalConfig() {
    const config = (await this.globalConfigService.getConfigByKey('general')) as GeneralConfigDto;
    return config;
  }

  private readonly ctxPrefix: string = AuditInterceptor.name;
  private readonly logger: Logger = new Logger(this.ctxPrefix);

  private async _logStaffActivity(payload: CreateActivityLogDto): Promise<void> {
    const queryRunner = this.ds.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const activityLog = queryRunner.manager.create(ActivityLogEntity, payload);
      await queryRunner.manager.save(ActivityLogEntity, activityLog);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error({ message: 'ERROR @ _logUserActivity', meta: payload, stack: error, context: this.ctxPrefix });
    } finally {
      await queryRunner.release();
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { url, method, body, ip, user, channel } = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(async (data) => {
        const config = await this._getGlobalConfig();
        const userId = user?.uid;
        if (config && config.enableApiRequestResponseLog) {
          // user activity logging
          const logTitle = this._reflector.getAllAndOverride<string>('activityTitle', [context.getHandler(), context.getClass()]);
          if (['POST', 'PUT', 'DELETE'].includes(method) && logTitle) {
            const reqUrl = `${method}:${url}`;
            const logText = StringUtil.sanitizeData(
              JSON.stringify({
                url: reqUrl,
                reqBody: body ? JSON.stringify(body) : '',
                respBody: data ? JSON.stringify(data) : '',
              }),
            );
            await this._logStaffActivity({ logTitle, logText, ipAddress: ip, userId, channel });
          }
        }
      }),
    );
  }
}
