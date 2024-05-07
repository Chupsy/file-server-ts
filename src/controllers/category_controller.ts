import { Controller } from './controller_abstract';
import { FilePersister } from '@persistence/file_persisters/file_persister_abstract';
import { DataPersister } from '@persistence/data_persisters/data_persister_abstract';
import { BaseConfig } from '@helpers/base_interfaces';
import Category from '@domain/category';
import { CategoryAlreadyExistError } from '@helpers/errors/category_already_exist.exception';

export class CategoryController extends Controller {
  constructor(dp: DataPersister<BaseConfig>, fp: FilePersister<BaseConfig>) {
    super(dp, fp, 'Category');
  }

  async saveCategory(category: Category): Promise<Category> {
    const foundCategory = await this.dataPersister
      .getCategoryDataPersister()
      .getCategoriesByNames([category.name]);
    if (foundCategory.length > 0) {
      throw new CategoryAlreadyExistError();
    }
    const savedCategory = await this.dataPersister
      .getCategoryDataPersister()
      .saveCategory(category);
    return savedCategory;
  }
}
