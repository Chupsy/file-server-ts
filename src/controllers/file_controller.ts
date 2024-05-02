import { File } from '@domain/file';
import { Controller } from './controller_abstract';

export class FileController extends Controller {
  async saveFile(file: File): Promise<File> {
    const savedFile = await this.dataPersister.saveFile(file);
    return this.filePersister.saveFile(savedFile);
  }

  async getFile(id: number): Promise<File> {
    const f: File = await this.dataPersister.getFile(id);
    return this.filePersister.getFile(f);
  }
}
