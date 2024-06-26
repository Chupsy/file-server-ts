/* eslint @typescript-eslint/no-explicit-any: 0 */
import { validate } from 'class-validator';
import { Middleware, MiddlewareConfig, MiddlewareData } from '../middleware_abstract';
import { plainToInstance } from 'class-transformer';
import { BadRequestError } from '@helpers/errors/bad_request.exception';

interface QueryValidatorData extends MiddlewareData {
  dto: any, 
  type: any
}

export class QueryValidator extends Middleware<MiddlewareConfig, QueryValidatorData> {
  constructor() {
    super('QueryValidator', {routes: []});
  }

  async validate(data: QueryValidatorData): Promise<void> {
    if (!data.type) {
      throw new Error('Type is undefined. Cannot validate the DTO.');
    }
    const instance = plainToInstance( data.dto, data.type);
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
