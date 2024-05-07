import { FileNotFoundError } from '@helpers/errors/file_not_found.exception';
import File from '@domain/file';
import { DataSource } from 'typeorm';
import { FileDataPersister } from '../file_data_persister_abstract';

export class TypeormFileDataPersister extends FileDataPersister {
  constructor(private dataSource: DataSource) {
    super('TypeormFileDataPersister');
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
