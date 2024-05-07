import { Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Name must be a string.' })
  @Length(1, 20, { message: 'Name must be between 1 and 20.' })
  @Type(() => String)
  name!: string;
}
