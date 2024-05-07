import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { Loggable } from '@helpers/logger/loggable_abstract';
import { Exception } from '@helpers/errors/exception_abstract';
import { Logger } from '@helpers/logger/logger_abstract';

@Injectable()
@Catch()
export class AllExceptionsFilter extends Loggable implements ExceptionFilter {
  constructor(readonly loggers: Logger[]) {
    super('AllExceptionsFilter');
    this.registerLoggers(loggers);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof Exception
        ? exception.internalCode
        : exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage =
      exception instanceof Exception || exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    this.logError(`Error on ${request.method} ${request.url}`, exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
    });
  }
}
