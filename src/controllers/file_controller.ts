import { File } from '@domain/file';
import { Controller } from './controller_abstract';
import { FilePersister } from '@persistence/file_persisters/file_persister_abstract';
import { DataPersister } from '@persistence/data_persisters/data_persister_abstract';

export class FileController extends Controller {
  constructor(dp: DataPersister, fp: FilePersister) {
    super(dp, fp, 'FileController');
    this.dataPersister = dp;
    this.filePersister = fp;
  }

  async saveFile(file: File): Promise<File> {
    const savedFile = await this.dataPersister.saveFile(file);
    return this.filePersister.saveFile(savedFile);
  }

  async getFile(id: number): Promise<File> {
    const f: File = await this.dataPersister.getFile(id);
    return this.filePersister.getFile(f);
  }
}
