import { QueryValidator } from '@presentations/middlewares/query_validators/query_validator';
import { FileController } from '@controllers/file_controller';
import { Loggable } from '@helpers/logger/loggable_abstract';
import { CategoryController } from '@controllers/category_controller';
import { Middleware, MiddlewareConfig, MiddlewareData } from '@presentations/middlewares/middleware_abstract';
import { BaseConfig } from '@helpers/base_interfaces';

export interface MiddlewareEntry<TConfig extends MiddlewareConfig> {
  middlewareClass: new (config: TConfig) => Middleware<TConfig, MiddlewareData>;
  config: TConfig;
}

export abstract class Entrypoint<TConfig extends BaseConfig> extends Loggable {
  protected fileController: FileController;

  protected categoryController: CategoryController;

  protected queryValidator: QueryValidator;

  protected middlewares: Middleware<MiddlewareConfig, MiddlewareData>[];


  constructor(
    fc: FileController,
    cc: CategoryController,
    qv: QueryValidator,
    className: string,
    public config: TConfig,
  ) {
    super(className);
    this.fileController = fc;
    this.categoryController = cc;
    this.queryValidator = qv;
    this.middlewares = [];
  }

  public abstract start(): void;

  public registerMiddleware<TConfig extends MiddlewareConfig, _TData extends MiddlewareData>(
    middleware: Middleware<TConfig, MiddlewareData>
    ):Middleware<MiddlewareConfig, MiddlewareData>{
      this.middlewares.push(middleware);
      return middleware;
  }
}
