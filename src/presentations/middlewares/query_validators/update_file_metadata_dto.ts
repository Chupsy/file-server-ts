import { Type } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateFileMetadataDto {
  @IsString({ message: 'Filename must be a string.' })
  @Length(1, 20, { message: 'Filename must be between 1 and 20.' })
  @Type(() => String)
  filename!: string;

  @IsString({ message: 'Category must be a string.' })
  @Length(1, 20, { message: 'Category must be between 1 and 20.' })
  @Type(() => String)
  @IsOptional()
  category?: string;
}
