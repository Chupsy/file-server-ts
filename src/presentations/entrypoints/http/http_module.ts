import { DynamicModule, Module } from '@nestjs/common';
import { FilesHttpController } from './files.controller';
import { FileController } from '@controllers/file_controller';
import { QueryValidator } from '@validators/query_validators/query_validator';
import { NestLogger } from './nest_logger';
import { FileSizeValidator } from '@presentations/validators/filesize_validator';

@Module({})
export class AppModule {
  static forRoot(
    fileController: FileController,
    queryValidator: QueryValidator,
    fileSizeValidator: FileSizeValidator,
    nestLogger: NestLogger,
  ): DynamicModule {
    return {
      module: AppModule,
      controllers: [FilesHttpController],
      providers: [
        {
          provide: 'FileController',
          useValue: fileController,
        },
        {
          provide: 'QueryValidator',
          useValue: queryValidator,
        },
        {
          provide: 'FileSizeValidator',
          useValue: fileSizeValidator,
        },
        {
          provide: 'NestLogger',
          useValue: nestLogger,
        },
      ],
    };
  }
}
