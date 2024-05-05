/* eslint @typescript-eslint/no-explicit-any: 0 */

export enum LOGGER_SEVERITY {
  SILLY = 'silly',
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export abstract class Logger {
  abstract log(severity: LOGGER_SEVERITY, text: string, ...args: any[]): void;
}
