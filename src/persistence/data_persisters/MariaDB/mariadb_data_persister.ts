import { DataPersister } from '../data_persister_abstract';
import File from '@domain/file';
import { FileNotFoundError } from '@helpers/errors/file_not_found.exception';
import { DataSource } from 'typeorm';

export class MariaDBPersister extends DataPersister {
  private dataSource: DataSource;

  constructor() {
    super('MariaDBPersister');
    this.dataSource = new DataSource({
      type: 'mariadb',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      database: 'files',
      password: 'mypass',
      synchronize: true,
      logging: true,
      entities: [File],
      subscribers: [],
      migrations: [],
    });
  }

  public async initialize(): Promise<void> {
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
}
