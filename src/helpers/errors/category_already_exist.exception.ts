import { Exception } from './exception_abstract';

export class CategoryAlreadyExistError extends Exception {
  constructor() {
    super('Category already exist', 400);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
