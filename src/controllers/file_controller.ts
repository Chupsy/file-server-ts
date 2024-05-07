import File from '@domain/file';
import { Controller } from './controller_abstract';
import { FilePersister } from '@persistence/file_persisters/file_persister_abstract';
import { DataPersister } from '@persistence/data_persisters/data_persister_abstract';
import { BaseConfig } from '@helpers/base_interfaces';

export class FileController extends Controller {
  constructor(dp: DataPersister<BaseConfig>, fp: FilePersister<BaseConfig>) {
    super(dp, fp, 'FileController');
  }

  async saveFile(file: File): Promise<File> {
    const savedFile = await this.dataPersister.saveFile(file);
    return this.filePersister.saveFile(savedFile);
  }

  async getFile(id: number): Promise<File> {
    const f: File = await this.dataPersister.getFile(id);
    return this.filePersister.getFile(f);
  }

  async deleteFile(id: number): Promise<void> {
    const f: File = await this.dataPersister.getFile(id);
    return await this.dataPersister.deleteFile(f);
  }

  async getFileMetadata(id: number): Promise<File> {
    return await this.dataPersister.getFile(id);
  }
}
