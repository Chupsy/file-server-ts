import path from 'path';
import { promises as fs } from 'fs';
import File, { FileWithData } from '@domain/file';
import { FilePersister } from '../file_persister_abstract';
import { FileNotFoundError } from '@helpers/errors/file_not_found.exception';

export interface LocalFilePersisterConfig {
  basePath: string;
}

export const defaultLocalFilePersisterConfig: LocalFilePersisterConfig = {
  basePath: '/tmp',
};

export class LocalFilePersister extends FilePersister<LocalFilePersisterConfig> {
  constructor(config: LocalFilePersisterConfig) {
    super('LocalFilePersister', config);
  }

  async saveFile(file: FileWithData): Promise<FileWithData> {
    if (!file.data) {
      throw new Error('no data in file');
    }
    const filePath = path.join(this.config.basePath, file.filename);

    try {
      await fs.writeFile(filePath, file.data);
      return file;
    } catch (error) {
      throw new Error('Failed to save file: ' + error);
    }
  }
  async getFile(file: File): Promise<FileWithData> {
    const filePath = path.join(this.config.basePath, file.filename);
    try {
      const fileWithData = new FileWithData(file);
      fileWithData.data = await fs.readFile(filePath);
      return fileWithData;
    } catch (error) {
      throw new FileNotFoundError();
    }
  }

  async init(): Promise<void> {
    this.logInfo('LocalFilePersister init');
  }
}
