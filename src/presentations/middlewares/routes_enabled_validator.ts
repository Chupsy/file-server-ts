import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  MethodNotAllowedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Middleware, MiddlewareConfig, MiddlewareData } from './middleware_abstract';

export enum HTTP_ROUTES {
  FILES_GET_ONE,
  FILES_CREATE,
  FILES_DELETE,
  FILES_GET_METADATA,
}

const ROUTES_MAPPING = {
  [HTTP_ROUTES.FILES_GET_ONE]: {
    path: '/files/:id',
    method: 'get',
  },
  [HTTP_ROUTES.FILES_CREATE]: {
    path: '/files',
    method: 'post',
  },
  [HTTP_ROUTES.FILES_DELETE]: {
    path: '/files/:id',
    method: 'delete',
  },
  [HTTP_ROUTES.FILES_GET_METADATA]: {
    path: '/files/:id/metadata',
    method: 'get',
  },
};

export interface RoutesEnabledValidatorConfig extends MiddlewareConfig{
  routesEnabled?: HTTP_ROUTES[]
}

@Injectable()
export class RoutesEnabledValidator extends Middleware<RoutesEnabledValidatorConfig, MiddlewareData> {

  constructor(
    public config: RoutesEnabledValidatorConfig
  ) {
    super('RoutesEnabledValidator', config);
  }

  async validate(data: MiddlewareData): Promise<void> {
    if (this.config.routesEnabled && data.currentRoute) {
      let route_authorized = false;
      this.config.routesEnabled.forEach((route: HTTP_ROUTES) => {
        if (
          ROUTES_MAPPING[route].path == data.currentRoute!.path &&
          ROUTES_MAPPING[route].method == data.currentRoute!.method
        ) {
          route_authorized = true;
        }
      });
      if (!route_authorized) {
        throw new MethodNotAllowedException();
      }
    }
  }
}
