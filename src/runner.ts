import config from 'config';

import {
  HttpEntrypoint,
  HttpEntrypointConfig,
  defaultHttpEntrypointConfig,
} from '@presentations/entrypoints/http/http_entrypoint';
import { FileController } from '@controllers/file_controller';
import { Logger } from '@helpers/logger/logger_abstract';
import {
  WinstonLogger,
  defaultWinstonConfig,
} from '@helpers/logger/winston/winston';
import { QueryValidator } from '@presentations/middlewares/query_validators/query_validator';
import File from '@domain/file';
import { FilePersister } from '@persistence/file_persisters/file_persister_abstract';
import { DataPersister } from '@persistence/data_persisters/data_persister_abstract';
import { Entrypoint, MiddlewareEntry } from '@presentations/entrypoints/entrypoint_abstract';
import {
  LocalFilePersister,
  LocalFilePersisterConfig,
  defaultLocalFilePersisterConfig,
} from '@persistence/file_persisters/local_file_persister/local_file_persister';
import {
  TypeormPersister,
  TypeormPersisterConfig,
  defaultTypeormPersisterConfig,
} from '@persistence/data_persisters/typeorm/typeorm_data_persister';
import { CategoryController } from '@controllers/category_controller';
import { Middleware, MiddlewareConfig, MiddlewareData } from '@presentations/middlewares/middleware_abstract';

export interface RunnerConfig {
  domain: {
    file: new (...args: any[]) => File;
  };
}

export class Runner {
  private filePersister: FilePersister<any> | undefined;
  private dataPersister: DataPersister<any> | undefined;
  private fileController: FileController | undefined;
  private categoryController: CategoryController | undefined;
  private queryValidator: QueryValidator;
  private entrypoint: Entrypoint<any> | undefined;
  private middlewares : Middleware<any, any>[];
  private loggers: Logger[];

  constructor() {
    this.loggers = [];
    this.middlewares = []
    this.queryValidator = new QueryValidator();
  }

  public async start() {
    if (!this.dataPersister || !this.entrypoint) {
      throw new Error('You must register your entrypoints first');
    }
    await this.dataPersister.initialize();
    await this.entrypoint.start();
  }

  public registerLoggers(): void;
  public registerLoggers(
    loggers: Logger[] = [new WinstonLogger(defaultWinstonConfig)],
  ) {
    this.loggers = loggers;
    this.entrypoint?.registerLoggers(this.loggers);
    this.fileController?.registerLoggers(this.loggers);
    this.filePersister?.registerLoggers(this.loggers);
    this.dataPersister?.registerLoggers(this.loggers);
    this.middlewares?.map(m => m.registerLoggers(this.loggers));
  }

  public async registerFilePersister<
    T extends FilePersister<any>,
  >(): Promise<void>;
  public async registerFilePersister<T extends FilePersister<any>>(
          config: LocalFilePersisterConfig,
  ): Promise<void>;
  public async registerFilePersister<T extends FilePersister<any>>(
    config: T['config'],
    FilePersisterClass: new (config: T['config']) => T,
  ): Promise<void>;
  public async registerFilePersister<T extends FilePersister<any>>(
    config?: T['config'],
    FilePersisterClass?: new (config: T['config']) => T,
  ): Promise<void> {
    if (!config) {
      config = defaultLocalFilePersisterConfig;
    }
    this.filePersister = FilePersisterClass
      ? new FilePersisterClass(config)
      : new LocalFilePersister(config);
    this.filePersister.registerLoggers(this.loggers);
    await this.filePersister.init();
  }

  public registerDataPersister<T extends DataPersister<any>>(): void;
  public registerDataPersister<T extends DataPersister<any>>(
    config: TypeormPersisterConfig,
  ): void;

  public registerDataPersister<T extends DataPersister<any>>(
    config: T['config'],
    DataPersisterClass: new (config: T['config']) => T,
  ): void;
  public registerDataPersister<T extends DataPersister<any>>(
    config?: T['config'],
    DataPersisterClass?: new (config: T['config']) => T,
  ): void {
    if (!config) {
      config = defaultTypeormPersisterConfig;
    }
    if (DataPersisterClass) {
      this.dataPersister = new DataPersisterClass(config);
    } else {
      this.dataPersister = new TypeormPersister(config);
    }

    this.dataPersister.registerLoggers(this.loggers);
  }

  public registerControllers() {
    if (!this.dataPersister || !this.filePersister) {
      throw new Error(
        'You must register a data persister and a file persister first.',
      );
    }
    this.fileController = new FileController(
      this.dataPersister,
      this.filePersister,
    );
    this.categoryController = new CategoryController(
      this.dataPersister,
      this.filePersister,
    );
    this.fileController.registerLoggers(this.loggers);
    this.categoryController.registerLoggers(this.loggers);
  }

  public registerEntrypoints<T extends Entrypoint<any>>(): void;
  public registerEntrypoints<T extends Entrypoint<any>>(
    config: HttpEntrypointConfig,
  ): void;
  public registerEntrypoints<T extends Entrypoint<any>>(
    config: T['config'],
    EntrypointClass: new (
      fc: FileController,
      cc: CategoryController,
      qv: QueryValidator,
      config: T['config'],
    ) => T,
  ): void;
  public registerEntrypoints<T extends Entrypoint<any>>(
    config?: T['config'],
    EntrypointClass?: new (
      fc: FileController,
      cc: CategoryController,
      qv: QueryValidator,
      config: T['config'],
    ) => T,
  ): void {
    if (!this.fileController || !this.categoryController) {
      throw new Error('You must register your controllers first.');
    }

    if (!config) {
      config = defaultHttpEntrypointConfig;
    }

    this.entrypoint = EntrypointClass
      ? new EntrypointClass(
          this.fileController,
          this.categoryController,
          this.queryValidator,
          config,
        )
      : new HttpEntrypoint(
          this.fileController,
          this.categoryController,
          this.queryValidator,
          config,
        );

    this.entrypoint.registerLoggers(this.loggers);
  }

  public registerMiddleware<TConfig extends MiddlewareConfig>(
    middlewareClass: new (config: TConfig) => Middleware<TConfig, MiddlewareData>,
    config: TConfig
  ){
    if (!this.entrypoint) {
      throw new Error('You must register your entrypoint first.');
    }
    this.middlewares.push(this.entrypoint.registerMiddleware(new middlewareClass(config)));
  }
}
