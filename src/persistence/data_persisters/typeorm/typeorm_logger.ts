import { Logger as TOLogger, QueryRunner } from 'typeorm';
import { LOGGER_SEVERITY, Logger } from '@helpers/logger/logger_abstract';

export class TypeORMLogger implements TOLogger {
  private loggers: Logger[];

  constructor() {
    this.loggers = [];
  }

  registerLoggers(loggers: Logger[]): void {
    this.loggers = loggers;
  }

  logQuery(
    query: string,
    parameters?: any[] | undefined,
    queryRunner?: QueryRunner | undefined,
  ) {
    this.log('info', `Query ${query}`);
  }
  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[] | undefined,
    queryRunner?: QueryRunner | undefined,
  ) {
    this.log('warn', `Query error ${error}`);
  }
  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[] | undefined,
    queryRunner?: QueryRunner | undefined,
  ) {
    this.log('info', `Slow query ${query} took ${time}ms`);
  }
  logSchemaBuild(message: string, queryRunner?: QueryRunner | undefined) {
    this.log('info', message);
  }
  logMigration(message: string, queryRunner?: QueryRunner | undefined) {
    this.log('info', message);
  }
  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: QueryRunner | undefined,
  ) {
    this.loggers.forEach((logger) =>
      logger.log(
        level === 'warn' ? LOGGER_SEVERITY.WARN : LOGGER_SEVERITY.INFO,
        `[TypeORM] - ${message}`,
      ),
    );
  }
}
