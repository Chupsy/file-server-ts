/* eslint @typescript-eslint/no-explicit-any: 0 */
import { Middleware, MiddlewareConfig, MiddlewareData } from './middleware_abstract';
import { BadRequestError } from '@helpers/errors/bad_request.exception';

export interface FileSizeValidatorConfig extends MiddlewareConfig{
  minSize: number;
  maxSize: number;
}

export class FileSizeValidator extends Middleware<FileSizeValidatorConfig, MiddlewareData> {
  constructor(
    public config: FileSizeValidatorConfig
  ) {
    super('FileSizeValidator', config);
  }

  async validate(data: MiddlewareData): Promise<void> {
    if (!data.file) {
      return;
    }

    if (data.file.size < this.config.minSize) {
      throw new BadRequestError([
        {
          property: 'file',
          errors: {
            size: `File size (${data.file.size} bytes) is smaller than allowed file size (${this.config.minSize})`,
          },
        },
      ]);
    }

    if (data.file.size > this.config.maxSize) {
      throw new BadRequestError([
        {
          property: 'file',
          errors: {
            size: `File size (${data.file.size} bytes) is bigger than allowed file size (${this.config.maxSize})`,
          },
        },
      ]);
    }
  }
}
