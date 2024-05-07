import { DataPersister } from '../data_persister_abstract';
import File, { FileWithData } from '@domain/file';
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
  }

  public async initialize(): Promise<void> {
    this.typeOrmLogger.registerLoggers(this.loggers);
    await this.dataSource.initialize();
  }

  async saveFile(file: File): Promise<File> {
    await this.dataSource.manager.save(file);
    return file;
  }

  async getFile(fileId: string): Promise<File> {
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

  async updateFile(file: File): Promise<void> {
    await this.dataSource.manager.update(File, { id: file.id }, file);
  }
}
