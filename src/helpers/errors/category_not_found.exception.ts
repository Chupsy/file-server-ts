import { Exception } from './exception_abstract';

export class CategoryNotFoundError extends Exception {
  constructor() {
    super('Category not found', 404);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
