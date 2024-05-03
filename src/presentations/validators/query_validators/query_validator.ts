/* eslint @typescript-eslint/no-explicit-any: 0 */
import { validate } from 'class-validator';
import { Validator } from '../validator_abstract';
import { plainToInstance } from 'class-transformer';
import { BadRequestError } from '@helpers/errors/bad_request.exception';

export class QueryValidator extends Validator {
  constructor() {
    super('QueryValidator');
  }

  async validate(dto: any, type: any): Promise<void> {
    if (!type) {
      throw new Error('Type is undefined. Cannot validate the DTO.');
    }
    const instance = plainToInstance(type, dto);
    const errors = await validate(instance, { skipMissingProperties: false });
    if (errors.length > 0) {
      // Construct a detailed error message or a structured error object
      const errorMessages = errors.map((error) => ({
        property: error.property,
        errors: error.constraints ? Object.values(error.constraints) : {},
      }));
      // Return this as a response with a 400 Bad Request status
      throw new BadRequestError(errorMessages);
    }
  }
}
