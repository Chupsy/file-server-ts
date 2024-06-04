import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  MethodNotAllowedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

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

@Injectable()
export class RoutesEnabledInterceptor implements NestInterceptor {
  constructor(private routes?: HTTP_ROUTES[]) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (this.routes) {
      const current_route = context.getArgByIndex(0).route;
      let route_authorized = false;
      this.routes.forEach((route: HTTP_ROUTES) => {
        if (
          ROUTES_MAPPING[route].path == current_route.path &&
          current_route.methods[ROUTES_MAPPING[route].method]
        ) {
          route_authorized = true;
        }
      });
      if (!route_authorized) {
        throw new MethodNotAllowedException();
      }
    }
    return next.handle();
  }
}
