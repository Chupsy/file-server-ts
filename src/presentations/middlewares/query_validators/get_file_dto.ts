import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetFileDto {
  @IsInt({ message: 'File id must be an integer.' })
  @Type(() => Number)
  id!: number;
}
