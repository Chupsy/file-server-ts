import { Type, Transform } from 'class-transformer';
import { IsOptional, IsString, Length, IsArray, IsUUID } from 'class-validator';

export class CreateFileDto {
  @IsString({ message: 'Filename must be a string.' })
  @Length(1, 20, { message: 'Filename must be between 1 and 20.' })
  @Type(() => String)
  filename!: string;

  @IsString({ message: 'MimeType must be a string.' })
  @Length(1, 20, { message: 'MimeType must be between 1 and 20.' })
  @Type(() => String)
  @IsOptional()
  mimeType?: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  @Transform(({ value }) => value.toString().split(','))
  categories?: string;
}
