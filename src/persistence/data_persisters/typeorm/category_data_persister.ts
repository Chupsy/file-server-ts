import { DataSource, In } from 'typeorm';
import { CategoryDataPersister } from '../category_data_persister_abstract';
import Category from '@domain/category';
import { CategoryNotFoundError } from '@helpers/errors/category_not_found.exception';

export class TypeormCategoryDataPersister extends CategoryDataPersister {
  constructor(private dataSource: DataSource) {
    super('TypeormCategoryDataPersister');
  }

  async saveCategory(category: Category): Promise<Category> {
    await this.dataSource.manager.save(category);
    return category;
  }

  async getCategory(categoryId: string): Promise<Category> {
    const category = await this.dataSource.manager.findOneBy(Category, {
      id: categoryId,
    });
    if (category) {
      return category;
    } else {
      throw new CategoryNotFoundError();
    }
  }

  async getCategoriesByNames(categoryNames: string[]): Promise<Category[]> {
    const categories = await this.dataSource.manager.find(Category, {
      where: {
        name: In(categoryNames),
      },
    });
    return categories;
  }

  async getCategoriesById(categoryIds: string[]): Promise<Category[]> {
    const categories = await this.dataSource.manager.find(Category, {
      where: {
        id: In(categoryIds),
      },
    });
    return categories;
  }
}
