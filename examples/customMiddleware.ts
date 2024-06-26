/* eslint @typescript-eslint/no-explicit-any: 0 */

import { Middleware, MiddlewareConfig, MiddlewareData } from "@presentations/middlewares/middleware_abstract";

export interface CustomValidatorConfig extends MiddlewareConfig{
  test: number;
}

export class CustomValidator extends Middleware<CustomValidatorConfig, MiddlewareData> {
  constructor(
    public config: CustomValidatorConfig
  ) {
    super('CustomValidator', config);
  }

  async validate(data: MiddlewareData): Promise<void> {
    console.log(data, this.config)
  }
}
