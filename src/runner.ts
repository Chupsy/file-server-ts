import config from 'config';

import { HttpEntrypoint } from '@presentations/entrypoints/http/http_entrypoint';
import { FileController } from '@controllers/file_controller';
import { Logger } from '@helpers/logger/logger_abstract';
import { WinstonLogger } from '@helpers/logger/winston/winston';
import { QueryValidator } from '@validators/query_validators/query_validator';
import { TypeormPersister } from '@persistence/data_persisters/typeorm/typeorm_data_persister';
import { LocalFilePersister } from '@persistence/file_persisters/local_file_persister/local_file_persister';

export class Runner {
  private filePersister: LocalFilePersister;
  private dataPersister: TypeormPersister;
  private fileController: FileController;
  private queryValidator: QueryValidator;
  private entrypoint: HttpEntrypoint;
  private loggers: Logger[];

  constructor() {
    this.filePersister = new LocalFilePersister('/tmp');
    this.dataPersister = new TypeormPersister(config.get('persistence.config'));
    this.fileController = new FileController(
      this.dataPersister,
      this.filePersister,
    );
    this.queryValidator = new QueryValidator();
    this.entrypoint = new HttpEntrypoint(
      this.fileController,
      this.queryValidator,
      3000,
    );
    this.loggers = [new WinstonLogger()];
    this.entrypoint.registerLoggers(this.loggers);
    this.fileController.registerLoggers(this.loggers);
    this.filePersister.registerLoggers(this.loggers);
    this.dataPersister.registerLoggers(this.loggers);
  }

  public async start() {
    await this.dataPersister.initialize();
    await this.entrypoint.start();
  }
}
