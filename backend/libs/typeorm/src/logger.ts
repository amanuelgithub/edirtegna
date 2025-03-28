import { Logger as NestjsLogger } from '@nestjs/common';
import { Logger, LoggerOptions, QueryRunner } from 'typeorm';

export class TypeOrmLogger implements Logger {
  private static logger = new NestjsLogger(TypeOrmLogger.name);

  constructor(private options?: LoggerOptions) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
    if (this.shouldLog(level)) {
      TypeOrmLogger.logger[level]?.(message);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logMigration(message: string, queryRunner?: QueryRunner): any {
    if (this.shouldLog('info', 'migration')) {
      TypeOrmLogger.logger.debug?.(message);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    if (this.shouldLog('info', 'query')) {
      if (parameters) {
        query += '; parameters: %j';
      }
      TypeOrmLogger.logger.debug?.(query, parameters);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    if (this.shouldLog('error', 'query')) {
      if (parameters) {
        query += '; parameters: %j';
      }
      TypeOrmLogger.logger.debug?.(query + '; parameters: %j', parameters);
      TypeOrmLogger.logger.error?.(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    if (this.shouldLog('warn', 'query')) {
      if (parameters) {
        query += '; parameters: %j';
      }
      TypeOrmLogger.logger.warn?.('SLOW QUERY (time: %d): ' + query, time, parameters);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    if (this.shouldLog('info', 'schema')) {
      TypeOrmLogger.logger.debug?.(message);
    }
  }

  private shouldLog(level?: 'log' | 'info' | 'warn' | 'error', method?: 'query' | 'error' | 'schema' | 'migration'): boolean {
    if (!this.options) {
      return false;
    }

    return (
      this.options === true ||
      this.options === 'all' ||
      (Array.isArray(this.options) && this.options.includes(level)) ||
      (Array.isArray(this.options) && this.options.includes(method))
    );
  }
}
