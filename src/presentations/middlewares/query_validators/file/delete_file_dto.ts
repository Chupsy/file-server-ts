import { Type } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class DeleteFileDto {
  @IsUUID(undefined, { each: true, message: 'Id must be an UUID.' })
  @Type(() => String)
  id!: string;
}
