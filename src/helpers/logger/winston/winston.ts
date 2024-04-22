import { LOGGER_SEVERITY, Logger } from "../logger_abstract";
import winston = require("winston");

export class WinstonLogger extends Logger{
    private logger:winston.Logger;

    constructor(){
        super();
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.Console({ level: 'info' }),
            ],
        });
        console.log("winston");
        this.logger.info("test");
    }

    log(severity: LOGGER_SEVERITY, text:string, ...args: any[]): void {
        this.logger.log(this.convertSeverity(severity), text, ...args);
    }

    private convertSeverity(severity: LOGGER_SEVERITY):string{
        switch(severity){
            case LOGGER_SEVERITY.DEBUG:
                return "debug";
            case LOGGER_SEVERITY.SILLY:
                return "silly"
            case LOGGER_SEVERITY.INFO:
                return "info";
            case LOGGER_SEVERITY.TRACE:
                return "info";
            case LOGGER_SEVERITY.ERROR:
                return "error";
            case LOGGER_SEVERITY.FATAL:
                return "error";
            case LOGGER_SEVERITY.WARN:
                return "warn";
        }
    }
}