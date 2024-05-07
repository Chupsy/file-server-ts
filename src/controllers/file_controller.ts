import File, { FileWithData } from '@domain/file';
import { Controller } from './controller_abstract';
import { FilePersister } from '@persistence/file_persisters/file_persister_abstract';
import { DataPersister } from '@persistence/data_persisters/data_persister_abstract';
import { BaseConfig } from '@helpers/base_interfaces';
import { CategoryNotFoundError } from '@helpers/errors/category_not_found.exception';

export class FileController extends Controller {
  constructor(dp: DataPersister<BaseConfig>, fp: FilePersister<BaseConfig>) {
    super(dp, fp, 'FileController');
  }

  async saveFile(
    file: File,
    data: Buffer,
    categoryIds?: string[],
  ): Promise<File> {
    if (categoryIds && categoryIds.length) {
      const categoriesFound = await this.dataPersister
        .getCategoryDataPersister()
        .getCategoriesById(categoryIds);
      if (categoriesFound.length < categoryIds.length) {
        throw new CategoryNotFoundError();
      }
      file.categories = categoriesFound;
    }
    const savedFile = await this.dataPersister
      .getFileDataPersister()
      .saveFile(file);
    const savedFileWithData = new FileWithData(savedFile);
    savedFileWithData.data = data;
    await this.filePersister.saveFile(savedFileWithData);
    return savedFile;
  }

  async getFile(id: string): Promise<FileWithData> {
    const f: File = await this.dataPersister.getFileDataPersister().getFile(id);
    return this.filePersister.getFile(f);
  }

  async deleteFile(id: string): Promise<void> {
    const f: File = await this.dataPersister.getFileDataPersister().getFile(id);
    return await this.dataPersister.getFileDataPersister().deleteFile(f);
  }

  async getFileMetadata(id: string): Promise<File> {
    return await this.dataPersister.getFileDataPersister().getFile(id);
  }

  async updateFileMetadata(
    id: string,
    updatedData: Partial<File>,
  ): Promise<File> {
    const file = await this.dataPersister.getFileDataPersister().getFile(id);
    const updatedFile: File = {
      ...file,
      ...updatedData,
    };
    await this.dataPersister.getFileDataPersister().updateFile(updatedFile);
    return updatedFile;
  }
}
