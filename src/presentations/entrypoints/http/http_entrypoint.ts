import { NestFactory } from '@nestjs/core';

import { Entrypoint } from '../entrypoint_abstract';
import { FileController } from '@controllers/file_controller';
import { AppModule } from './http_module';
import { QueryValidator } from '@validators/query_validators/query_validator';
import { NestLogger } from './nest_logger';
import { AllExceptionsFilter } from './http-exception.filter';
import { FileSizeValidator } from '@presentations/validators/filesize_validator';

export class HttpEntrypoint extends Entrypoint {
  private nestLogger: NestLogger;

  constructor(
    fc: FileController,
    qv: QueryValidator,
    private fsv: FileSizeValidator,
    private port: number,
  ) {
    super(fc, qv, fsv, 'HttpEntrypoint');
    this.nestLogger = new NestLogger();
  }

  public async start(): Promise<void> {
    this.nestLogger.registerLoggers(this.loggers);
    const app = await NestFactory.create(
      AppModule.forRoot(
        this.fileController,
        this.queryValidator,
        this.fileSizeValidator,
        this.nestLogger,
      ),
      {
        logger: this.nestLogger,
      },
    );
    app.useGlobalFilters(new AllExceptionsFilter(this.loggers));
    await app.listen(this.port);
  }
}
