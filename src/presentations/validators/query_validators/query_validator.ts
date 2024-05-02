/* eslint @typescript-eslint/no-explicit-any: 0 */
import { validate, ValidationError } from 'class-validator';
import { Validator } from '../validator_abstract';
import { plainToInstance } from 'class-transformer';

export class QueryValidator extends Validator {
  constructor() {
    super('QueryValidator');
  }

  async validate(dto: any, type: any): Promise<ValidationError[]> {
    if (!type) {
      throw new Error('Type is undefined. Cannot validate the DTO.');
    }
    const instance = plainToInstance(type, dto);
    return validate(instance, { skipMissingProperties: false });
  }
}
