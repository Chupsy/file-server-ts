import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileController } from '@controllers/file_controller';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from '@presentations/middlewares/query_validators/create_file_dto';
import { QueryValidator } from '@presentations/middlewares/query_validators/query_validator';
import { Loggable } from '@helpers/logger/loggable_abstract';
import File from '@domain/file';
import { NestLogger } from './nest_logger';
import { Response } from 'express';
import { GetFileDto } from '@presentations/middlewares/query_validators/get_file_dto';
import { DeleteFileDto } from '@presentations/middlewares/query_validators/delete_file_dto';
import { FileSizeValidator } from '@presentations/middlewares/filesize_validator';
import { UpdateFileMetadataDto } from '@presentations/middlewares/query_validators/update_file_metadata_dto';

@Controller('files')
export class FilesHttpController extends Loggable {
  constructor(
    @Inject('FileController') private fileController: FileController,
    @Inject('QueryValidator') private queryValidator: QueryValidator,
    @Inject('FileSizeValidator') private fileSizeValidator: FileSizeValidator,
    @Inject('NestLogger') private nestLogger: NestLogger,
  ) {
    super('FilesHttpController');
    this.registerLoggers(this.nestLogger.loggers);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response): Promise<void> {
    await this.queryValidator.validate({ id }, GetFileDto);

    const file = await this.fileController.getFile(id);
    res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.filename}"`,
    );
    res.send(file.data);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'data', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: { file?: Express.Multer.File[]; data?: Express.Multer.File[] },
    @Body() body: CreateFileDto,
  ): Promise<string> {
    await this.queryValidator.validate(body, CreateFileDto);

    if (!files.file || files.file.length === 0) {
      throw new BadRequestException('No file uploaded');
    }
    const uploadedFile = files.file[0];
    await this.fileSizeValidator.validate(uploadedFile.buffer.byteLength);

    const file = await this.fileController.saveFile(
      new File({
        filename: body.filename,
        mimeType: body.mimeType || uploadedFile.mimetype,
        category: body.category,
        data: uploadedFile.buffer,
      }),
    );

    return `created file with ID ${file.id}`;
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: number): Promise<string> {
    await this.queryValidator.validate({ id }, DeleteFileDto);

    await this.fileController.deleteFile(id);
    return `deleted file with ID ${id}`;
  }

  @Get(':id/metadata')
  async getFileMetadata(
    @Param('id') id: number,
  ): Promise<{ message: string; file: File }> {
    await this.queryValidator.validate({ id }, GetFileDto);

    const file = await this.fileController.getFileMetadata(id);
    return {
      message: 'File found',
      file,
    };
  }

  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([]))
  async updateFileMetadata(
    @Param('id') id: number,
    @Body() body: UpdateFileMetadataDto,
  ): Promise<{ message: string; file: File }> {
    await this.queryValidator.validate({ id, ...body }, UpdateFileMetadataDto);

    const file = await this.fileController.updateFileMetadata(id, body);
    return {
      message: 'File updated',
      file,
    };
  }
}
