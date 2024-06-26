import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Middleware, MiddlewareConfig, MiddlewareData } from '@presentations/middlewares/middleware_abstract';
import { Observable } from 'rxjs';

export enum VALIDATE_REQUEST_TYPE{
  BODY="body",
  PARAMS="params"
}

@Injectable()
export class MiddlewaresInterceptor implements NestInterceptor {
  
  constructor(private middlewares: Middleware<MiddlewareConfig, MiddlewareData>[]) {
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const context_route = context.getArgByIndex(0).route;

    let current_route = {
      path: context_route.path, 
      method: Object.keys(context_route.methods).reduce((method, curr) => context_route.methods[curr]? curr:method, "")
    };
    const middlewareData:MiddlewareData = {
      file: {
        size: context?.getArgByIndex(0)?._readableState?.length
      },
      currentRoute: current_route
    };

    for(let i = 0; i<this.middlewares.length; i++){
      if(!this.middlewares[i].config.routes){
        await this.middlewares[i].validate(middlewareData);
      } else {
        for(let j = 0; j<this.middlewares[i].config.routes!.length; j++){
          const route = this.middlewares[i].config.routes![j];
          if (
            route.path == current_route.path &&
            current_route.method == route.method
          ) {
            await this.middlewares[i].validate(middlewareData);
            break;
          }
        }
      }
    }

    return next.handle();
  }
}
