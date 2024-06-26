import { BaseConfig } from '@helpers/base_interfaces';
import { Loggable } from '@helpers/logger/loggable_abstract';

export interface MiddlewareData {
  file?: {
    size: number
  },
  currentRoute?: {
    path: string,
    method: string,
  }
}

export interface MiddlewareConfig extends BaseConfig{
  routes?: {
    path: string
    method: string
  }[]
}

export abstract class Middleware<
TConfig extends MiddlewareConfig,
TData extends MiddlewareData
> extends Loggable {
  constructor(
      className: string,
      public config: TConfig,
    ) {
      super(className);
    }
  
  abstract validate(data: TData):Promise<void>;
}
