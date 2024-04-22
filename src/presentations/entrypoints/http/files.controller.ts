import { BadRequestException, Body, Controller, Get, Inject, NotFoundException, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileController } from '../../../controllers/file_controller';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from '../../validators/query_validators/create_file_dto';
import { QueryValidator } from '../../validators/query_validators/query_validator';
import { Loggable } from '../../../helpers/logger/loggable_abstract';
import { NestLogger } from './nest_logger';
import { Response } from 'express'; 

@Controller('files')
export class FilesHttpController extends Loggable {
  constructor(
    @Inject('FileController') private fileController: FileController,
    @Inject('QueryValidator') private queryValidator: QueryValidator,
    @Inject('NestLogger') private nestLogger: NestLogger,
  ) {
    super();
    this.registerLoggers(this.nestLogger.loggers);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response): Promise<void> {
        const file = await this.fileController.getFile(id);
        res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
        console.log('test');
        res.send(file.data);
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'file', maxCount: 1 },
    { name: 'data', maxCount: 1 } 
  ]))
  async create(@UploadedFiles() files: { file?: Express.Multer.File[], 
    data?: Express.Multer.File[] }, @Body() body: CreateFileDto): Promise<string> {

    const errors = await this.queryValidator.validate(body, CreateFileDto);
    if (errors.length > 0) {
        // Construct a detailed error message or a structured error object
        const errorMessages = errors.map(error => ({
            property: error.property,
            errors: error.constraints ? Object.values(error.constraints) : {}
        }));

        // Return this as a response with a 400 Bad Request status
        throw new BadRequestException({
            message: "Validation failed",
            errors: errorMessages
        });
    }

    // Checking if the file is uploaded properly
    if (!files.file || files.file.length === 0) {
        throw new BadRequestException("No file uploaded");
    }
    const uploadedFile = files.file[0]; // Get the uploaded file

    const file = await this.fileController.saveFile({ filename:body.filename, 
      mimeType: body.mimeType || uploadedFile.mimetype, 
      data: uploadedFile.buffer }); // Access form data via body

    return `created file with ID ${file.id}`;
  }
}
