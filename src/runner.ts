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
import { FileSizeValidator } from '@presentations/middlewares/filesize_validator';
import File from '@domain/file';
import { FilePersister } from '@persistence/file_persisters/file_persister_abstract';
import { DataPersister } from '@persistence/data_persisters/data_persister_abstract';
import { Entrypoint } from '@presentations/entrypoints/entrypoint_abstract';
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
  private fileSizeValidator: FileSizeValidator;
  private entrypoint: Entrypoint<any> | undefined;
  private loggers: Logger[];

  constructor() {
    this.loggers = [];
    this.queryValidator = new QueryValidator();
    this.fileSizeValidator = new FileSizeValidator(
      config.has('validators.filesize')
        ? config.get('validators.filesize')
        : undefined,
    );
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
  }

  public registerFilePersister<T extends FilePersister<any>>(): void;
  public registerFilePersister<T extends FilePersister<any>>(
    config: LocalFilePersisterConfig,
  ): void;
  public registerFilePersister<T extends FilePersister<any>>(
    config: T['config'],
    FilePersisterClass: new (config: T['config']) => T,
  ): void;
  public registerFilePersister<T extends FilePersister<any>>(
    config?: T['config'],
    FilePersisterClass?: new (config: T['config']) => T,
  ): void {
    if (!config) {
      config = defaultLocalFilePersisterConfig;
    }
    this.filePersister = FilePersisterClass
      ? new FilePersisterClass(config)
      : new LocalFilePersister(config);
    this.filePersister.registerLoggers(this.loggers);
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
      fsv: FileSizeValidator,
      config: T['config'],
    ) => T,
  ): void;
  public registerEntrypoints<T extends Entrypoint<any>>(
    config?: T['config'],
    EntrypointClass?: new (
      fc: FileController,
      cc: CategoryController,
      qv: QueryValidator,
      fsv: FileSizeValidator,
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
          this.fileSizeValidator,
          config,
        )
      : new HttpEntrypoint(
          this.fileController,
          this.categoryController,
          this.queryValidator,
          this.fileSizeValidator,
          config,
        );

    this.entrypoint.registerLoggers(this.loggers);
  }
}
