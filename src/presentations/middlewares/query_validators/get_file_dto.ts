import { Type } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class GetFileDto {
  @IsUUID(undefined, { each: true, message: 'Id must be an UUID.' })
  @Type(() => String)
  id!: string;
}
