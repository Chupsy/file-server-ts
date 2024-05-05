/* eslint @typescript-eslint/no-explicit-any: 0 */
import { LOGGER_SEVERITY, Logger } from '../logger_abstract';
import winston = require('winston');

export interface WinstonConfig {
  level: LOGGER_SEVERITY;
  transports: [
    {
      level: LOGGER_SEVERITY;
      type: 'console' | 'file';
      filename?: string;
    },
  ];
}

export class WinstonLogger extends Logger {
  private logger: winston.Logger;

  constructor(winstonConfig: WinstonConfig) {
    super();
    const transports: winston.transport[] = [];
    winstonConfig.transports.forEach((transport) => {
      switch (transport.type) {
        case 'console':
          transports.push(
            new winston.transports.Console({ level: transport.level }),
          );
          break;
        case 'file':
          transports.push(
            new winston.transports.File({
              level: transport.level,
              filename: transport.filename,
            }),
          );
      }
    });
    this.logger = winston.createLogger({
      level: winstonConfig.level,
      format: winston.format.json(),
      transports,
    });
  }

  log(severity: LOGGER_SEVERITY, text: string, ...args: any[]): void {
    this.logger.log(severity, text, ...args);
  }
}
