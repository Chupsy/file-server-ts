import { NestFactory } from '@nestjs/core';

import { Entrypoint } from '../entrypoint_abstract';
import { FileController } from '@controllers/file_controller';
import { AppModule } from './http_module';
import { QueryValidator } from '@presentations/middlewares/query_validators/query_validator';
import { NestLogger } from './nest_logger';
import { AllExceptionsFilter } from './http_middlewares/http-exception.filter';
import { CategoryController } from '@controllers/category_controller';
import { MiddlewaresInterceptor } from './http_middlewares/http_middlewares.interceptor';

export interface HttpEntrypointConfig {
  port: number;
}

export const defaultHttpEntrypointConfig: HttpEntrypointConfig = {
  port: 3000,
};

export class HttpEntrypoint extends Entrypoint<HttpEntrypointConfig> {
  private nestLogger: NestLogger;

  constructor(
    fc: FileController,
    cc: CategoryController,
    qv: QueryValidator,
    config: HttpEntrypointConfig,
  ) {
    super(fc, cc, qv, 'HttpEntrypoint', config);
    this.nestLogger = new NestLogger();
  }

  public async start(): Promise<void> {
    this.nestLogger.registerLoggers(this.loggers);
    const app = await NestFactory.create(
      AppModule.forRoot(
        this.fileController,
        this.categoryController,
        this.queryValidator,
        this.nestLogger,
      ),
      {
        logger: this.nestLogger,
      },
    );
    app.useGlobalFilters(new AllExceptionsFilter(this.loggers));
    app.useGlobalInterceptors(new MiddlewaresInterceptor(this.middlewares));
    await app.listen(this.config.port);
  }
}
