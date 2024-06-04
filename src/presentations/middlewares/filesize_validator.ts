/* eslint @typescript-eslint/no-explicit-any: 0 */
import { Middleware } from './middleware_abstract';
import { BadRequestError } from '@helpers/errors/bad_request.exception';

export interface FileSizeValidatorConfig {
  minSize: number;
  maxSize: number;
}

export class FileSizeValidator extends Middleware {
  constructor(
    private config:
      | FileSizeValidatorConfig
      | undefined,
  ) {
    super('FileSizeValidator');
  }

  async validate(filesize: number): Promise<void> {
    if (!this.config) {
      return;
    }

    if (filesize < this.config.minSize) {
      throw new BadRequestError([
        {
          property: 'file',
          errors: {
            size: `File size (${filesize} bytes) is smaller than allowed file size (${this.config.minSize})`,
          },
        },
      ]);
    }

    if (filesize > this.config.maxSize) {
      throw new BadRequestError([
        {
          property: 'file',
          errors: {
            size: `File size (${filesize} bytes) is bigger than allowed file size (${this.config.maxSize})`,
          },
        },
      ]);
    }
  }
}
