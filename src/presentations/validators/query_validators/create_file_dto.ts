import { Type } from "class-transformer";
import { IsString, Length } from "class-validator";

export class CreateFileDto {
    @IsString({ message: "Filename must be a string." })
    @Length(1, 20, { message: "Filename must be between 1 and 20." })
    @Type(() => String)
    filename!: string;

    @IsString({ message: "MimeType must be a string." })
    @Length(1, 20, { message: "Name must be between 1 and 20." })
    @Type(() => String)
    mimeType?: string;
}