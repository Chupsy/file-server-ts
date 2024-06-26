import { DynamicModule, Module } from '@nestjs/common';
import { FilesHttpController } from './files.controller';
import { FileController } from '@controllers/file_controller';
import { QueryValidator } from '@presentations/middlewares/query_validators/query_validator';
import { NestLogger } from './nest_logger';
import { FileSizeValidator } from '@presentations/middlewares/filesize_validator';
import { CategoryController } from '@controllers/category_controller';
import { CategoriesHttpController } from './categories.controller';

@Module({})
export class AppModule {
  static forRoot(
    fileController: FileController,
    categoryController: CategoryController,
    queryValidator: QueryValidator,
    nestLogger: NestLogger,
  ): DynamicModule {
    return {
      module: AppModule,
      controllers: [FilesHttpController, CategoriesHttpController],
      providers: [
        {
          provide: 'FileController',
          useValue: fileController,
        },
        {
          provide: 'CategoryController',
          useValue: categoryController,
        },
        {
          provide: 'QueryValidator',
          useValue: queryValidator,
        },
        {
          provide: 'NestLogger',
          useValue: nestLogger,
        },
      ],
    };
  }
}
