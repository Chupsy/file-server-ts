import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { QueryValidator } from '@presentations/middlewares/query_validators/query_validator';
import { Observable } from 'rxjs';

export enum VALIDATE_REQUEST_TYPE{
  BODY="body",
  PARAMS="params"
}

@Injectable()
export class ValidateRequestInterceptor implements NestInterceptor {
  private queryValidator: QueryValidator
  
  constructor(private dto: any, private type: VALIDATE_REQUEST_TYPE) {
    this.queryValidator = new QueryValidator();
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    await this.queryValidator.validate({type: context.getArgByIndex(0)[this.type], dto: this.dto})

    return next.handle();
  }
}
