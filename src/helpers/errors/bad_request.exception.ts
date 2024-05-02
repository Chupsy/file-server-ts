import { Exception } from './exception_abstract';

export class BadRequestError extends Exception {
  constructor(
    errors: {
      property: string;
      errors: {};
    }[],
  ) {
    super('Bad Request', 400, errors);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
