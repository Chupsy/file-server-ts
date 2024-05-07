import File, { FileWithData } from '@domain/file';
import { Controller } from './controller_abstract';
import { FilePersister } from '@persistence/file_persisters/file_persister_abstract';
import { DataPersister } from '@persistence/data_persisters/data_persister_abstract';
import { BaseConfig } from '@helpers/base_interfaces';

export class FileController extends Controller {
  constructor(dp: DataPersister<BaseConfig>, fp: FilePersister<BaseConfig>) {
    super(dp, fp, 'FileController');
  }

  async saveFile(file: File, data: Buffer): Promise<FileWithData> {
    const savedFile = await this.dataPersister.saveFile(file);
    const savedFileWithData = new FileWithData(savedFile);
    savedFileWithData.data = data;
    return this.filePersister.saveFile(savedFileWithData);
  }

  async getFile(id: string): Promise<FileWithData> {
    const f: File = await this.dataPersister.getFile(id);
    return this.filePersister.getFile(f);
  }

  async deleteFile(id: string): Promise<void> {
    const f: File = await this.dataPersister.getFile(id);
    return await this.dataPersister.deleteFile(f);
  }

  async getFileMetadata(id: string): Promise<File> {
    return await this.dataPersister.getFile(id);
  }

  async updateFileMetadata(
    id: string,
    updatedData: Partial<File>,
  ): Promise<File> {
    const file = await this.dataPersister.getFile(id);
    const updatedFile: File = {
      ...file,
      ...updatedData,
    };
    await this.dataPersister.updateFile(updatedFile);
    return updatedFile;
  }
}
