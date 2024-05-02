/* eslint @typescript-eslint/no-explicit-any: 0 */
import { LOGGER_SEVERITY, Logger } from './logger_abstract';

export abstract class Loggable {
  protected loggers: Logger[];

  constructor(private className: String) {
    this.loggers = [];
  }

  registerLoggers(loggers: Logger[]): void {
    this.loggers = loggers;
  }

  log(severity: LOGGER_SEVERITY, text: string, ...args: any[]): void {
    this.loggers.forEach((logger) =>
      logger.log(severity, `[${this.className}] - ${text}`, ...args),
    );
  }

  logSilly(text: string, ...args: any[]): void {
    this.log(LOGGER_SEVERITY.SILLY, text, ...args);
  }

  logTrace(text: string, ...args: any[]): void {
    this.log(LOGGER_SEVERITY.TRACE, text, ...args);
  }

  logDebug(text: string, ...args: any[]): void {
    this.log(LOGGER_SEVERITY.DEBUG, text, ...args);
  }

  logInfo(text: string, ...args: any[]): void {
    this.log(LOGGER_SEVERITY.INFO, text, ...args);
  }

  logWarn(text: string, ...args: any[]): void {
    this.log(LOGGER_SEVERITY.WARN, text, ...args);
  }

  logError(text: string, ...args: any[]): void {
    this.log(LOGGER_SEVERITY.ERROR, text, ...args);
  }

  logFatal(text: string, ...args: any[]): void {
    this.log(LOGGER_SEVERITY.FATAL, text, ...args);
  }
}
