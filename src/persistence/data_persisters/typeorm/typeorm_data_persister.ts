import { DataPersister } from '../data_persister_abstract';
import File from '@domain/file';
import { DataSource } from 'typeorm';
import { TypeORMLogger } from './typeorm_logger';
import { FileDataPersister } from '../file_data_persister_abstract';
import { TypeormFileDataPersister } from './file_data_persister';

export interface TypeormPersisterConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  database: string;
  password: string;
}

export const defaultTypeormPersisterConfig: TypeormPersisterConfig = {
  type: 'mariadb',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  database: 'files',
  password: 'my-secret-pw',
};

export class TypeormPersister extends DataPersister<TypeormPersisterConfig> {
  private dataSource: DataSource;
  private typeOrmLogger: TypeORMLogger;

  constructor(config: TypeormPersisterConfig) {
    super('TypeormPersister', config);
    this.typeOrmLogger = new TypeORMLogger();
    const dataSourceOptions: any = {
      ...config,
      database: 'files',
      synchronize: true,
      logging: true,
      entities: [File],
      subscribers: [],
      migrations: [],
      logger: this.typeOrmLogger,
    };
    this.dataSource = new DataSource(dataSourceOptions);
    this.fileDataPersister = new TypeormFileDataPersister(this.dataSource);
  }

  public async initialize(): Promise<void> {
    this.typeOrmLogger.registerLoggers(this.loggers);
    this.fileDataPersister?.registerLoggers(this.loggers);
    await this.dataSource.initialize();
  }

  public getFileDataPersister(): FileDataPersister {
    return this.fileDataPersister!;
  }
}
