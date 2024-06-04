import { NestFactory } from '@nestjs/core';

import { Entrypoint } from '../entrypoint_abstract';
import { FileController } from '@controllers/file_controller';
import { AppModule } from './http_module';
import { QueryValidator } from '@presentations/middlewares/query_validators/query_validator';
import { NestLogger } from './nest_logger';
import { AllExceptionsFilter } from './http_middlewares/http-exception.filter';
import { FileSizeValidator } from '@presentations/middlewares/filesize_validator';
import { CategoryController } from '@controllers/category_controller';
import {
  HTTP_ROUTES,
  RoutesEnabledInterceptor,
} from './http_middlewares/http_routes_enabled.interceptor';

export interface HttpEntrypointConfig {
  port: number;
  routes?: HTTP_ROUTES[];
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
    fsv: FileSizeValidator,
    config: HttpEntrypointConfig,
  ) {
    super(fc, cc, qv, fsv, 'HttpEntrypoint', config);
    this.nestLogger = new NestLogger();
  }

  public async start(): Promise<void> {
    this.nestLogger.registerLoggers(this.loggers);
    const app = await NestFactory.create(
      AppModule.forRoot(
        this.fileController,
        this.categoryController,
        this.queryValidator,
        this.fileSizeValidator,
        this.nestLogger,
      ),
      {
        logger: this.nestLogger,
      },
    );
    app.useGlobalFilters(new AllExceptionsFilter(this.loggers));
    app.useGlobalInterceptors(new RoutesEnabledInterceptor(this.config.routes));
    await app.listen(this.config.port);
  }
}
