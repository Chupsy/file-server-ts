import Category from '@domain/category';
import { Loggable } from '@helpers/logger/loggable_abstract';

export abstract class CategoryDataPersister extends Loggable {
  constructor(className: string) {
    super(className);
  }

  abstract saveCategory(category: Category): Promise<Category>;
  abstract getCategory(categoryId: string): Promise<Category>;
  abstract getCategoriesByNames(categoryNames: string[]): Promise<Category[]>;
  abstract getCategoriesById(categoryIds: string[]): Promise<Category[]>;
}
