import { ConsoleLogger, Injectable, Scope } from "@nestjs/common";
import {Logger as CustomLogger, LOGGER_SEVERITY} from "../../../helpers/logger/logger_abstract";

@Injectable({ scope: Scope.TRANSIENT })
export class NestLogger extends ConsoleLogger {
    public loggers:CustomLogger[];

    constructor(){
        super();
        this.loggers = [];
    }

    propagateLog(severity:LOGGER_SEVERITY, text:string, ...args : any[]):void {
        this.loggers.forEach((logger)=> logger.log(severity, text, ...args));
    }

    log(message: string):void{
        this.propagateLog(LOGGER_SEVERITY.INFO, message);
    }

    debug(message: string):void{
        this.propagateLog(LOGGER_SEVERITY.DEBUG, message);
    }

    verbose(message: string):void{
        this.propagateLog(LOGGER_SEVERITY.INFO, message);
    }

    warn(message: string):void{
        this.propagateLog(LOGGER_SEVERITY.WARN, message);
    }

    error(message: string, trace: string):void{
        this.propagateLog(LOGGER_SEVERITY.ERROR, message, trace);
    }

    registerLoggers(loggers:CustomLogger[]):void{
        this.loggers = loggers;
    }

}