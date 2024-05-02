import { Exception } from './exception_abstract';

export class FileNotFoundError extends Exception {
  constructor() {
    super('File not found', 404);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
