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
import { CreateFileDto } from '@presentations/middlewares/query_validators/file/create_file_dto';
import { Loggable } from '@helpers/logger/loggable_abstract';
import File from '@domain/file';
import { NestLogger } from './nest_logger';
import { Response } from 'express';
import { GetFileDto } from '@presentations/middlewares/query_validators/file/get_file_dto';
import { DeleteFileDto } from '@presentations/middlewares/query_validators/file/delete_file_dto';
import { UpdateFileMetadataDto } from '@presentations/middlewares/query_validators/file/update_file_metadata_dto';
import { VALIDATE_REQUEST_TYPE, ValidateRequestInterceptor } from './http_middlewares/http_validate_request.interceptor';

@Controller('files')
export class FilesHttpController extends Loggable {
  constructor(
    @Inject('FileController') private fileController: FileController,
    @Inject('NestLogger') private nestLogger: NestLogger,
  ) {
    super('FilesHttpController');
    this.registerLoggers(this.nestLogger.loggers);
  }

  @Get(':id')
  @UseInterceptors(
    new ValidateRequestInterceptor(GetFileDto, VALIDATE_REQUEST_TYPE.PARAMS)
  )
  async findOne(@Param('id') id: string, @Res() res: Response): Promise<void> {
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
    new ValidateRequestInterceptor(CreateFileDto, VALIDATE_REQUEST_TYPE.BODY)
  )
  async create(
    @UploadedFiles()
    files: { file?: Express.Multer.File[]; data?: Express.Multer.File[] },
    @Body() body: CreateFileDto,
  ): Promise<{ message: string; file: File }> {
    if (!files.file || files.file.length === 0) {
      throw new BadRequestException('No file uploaded');
    }
    const uploadedFile = files.file[0];
    const file = await this.fileController.saveFile(
      new File({
        filename: body.filename,
        mimeType: body.mimeType || uploadedFile.mimetype,
      }),
      uploadedFile.buffer,
      body.categories?.split(','),
    );

    return { message: `created file with ID ${file.id}`, file };
  }

  @Delete(':id')
  @UseInterceptors(
    new ValidateRequestInterceptor(DeleteFileDto, VALIDATE_REQUEST_TYPE.PARAMS)
  )
  async deleteOne(@Param('id') id: string): Promise<string> {
    await this.fileController.deleteFile(id);
    return `deleted file with ID ${id}`;
  }

  @Get(':id/metadata')
  @UseInterceptors(
    new ValidateRequestInterceptor(GetFileDto, VALIDATE_REQUEST_TYPE.PARAMS)
  )
  async getFileMetadata(
    @Param('id') id: string,
  ): Promise<{ message: string; file: File }> {
    const file = await this.fileController.getFileMetadata(id);
    return {
      message: 'File found',
      file,
    };
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([]),
    new ValidateRequestInterceptor(GetFileDto, VALIDATE_REQUEST_TYPE.PARAMS),
    new ValidateRequestInterceptor(UpdateFileMetadataDto, VALIDATE_REQUEST_TYPE.BODY)
  )
  async updateFileMetadata(
    @Param('id') id: string,
    @Body() body: UpdateFileMetadataDto,
  ): Promise<{ message: string; file: File }> {
    const file = await this.fileController.updateFileMetadata(id, body);
    return {
      message: 'File updated',
      file,
    };
  }
}
