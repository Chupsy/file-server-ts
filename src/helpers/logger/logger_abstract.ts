export enum LOGGER_SEVERITY{
    SILLY,
    TRACE,
    DEBUG,
    INFO,
    WARN,
    ERROR,
    FATAL
}

export abstract class Logger{
    abstract log(severity:LOGGER_SEVERITY, text:string, ...args : any[]):void;
}