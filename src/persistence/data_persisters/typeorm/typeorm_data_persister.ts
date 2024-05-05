import { DataPersister } from '../data_persister_abstract';
import File from '@domain/file';
import { FileNotFoundError } from '@helpers/errors/file_not_found.exception';
import { DataSource } from 'typeorm';
import { TypeORMLogger } from './typeorm_logger';

export interface TypeormPersisterConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  database: string;
  password: string;
}

export class TypeormPersister extends DataPersister {
  private dataSource: DataSource;
  private typeOrmLogger: TypeORMLogger;

  constructor(config: TypeormPersisterConfig) {
    super('TypeormPersister');
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
  }

  public async initialize(): Promise<void> {
    this.typeOrmLogger.registerLoggers(this.loggers);
    await this.dataSource.initialize();
  }

  async saveFile(file: File): Promise<File> {
    await this.dataSource.manager.save(file);
    return file;
  }

  async getFile(fileId: number): Promise<File> {
    const file = await this.dataSource.manager.findOneBy(File, { id: fileId });
    if (file) {
      return file;
    } else {
      throw new FileNotFoundError();
    }
  }

  async deleteFile(file: File): Promise<void> {
    await this.dataSource.manager.softDelete(File, { id: file.id });
  }
}
