import {
  Body,
  Controller,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { QueryValidator } from '@presentations/middlewares/query_validators/query_validator';
import { Loggable } from '@helpers/logger/loggable_abstract';
import { NestLogger } from './nest_logger';
import Category from '@domain/category';
import { CreateCategoryDto } from '@presentations/middlewares/query_validators/category/create_file_dto';
import { CategoryController } from '@controllers/category_controller';
import { VALIDATE_REQUEST_TYPE, ValidateRequestInterceptor } from './http_middlewares/http_validate_request.interceptor';

@Controller('categories')
export class CategoriesHttpController extends Loggable {
  constructor(
    @Inject('CategoryController')
    private categoryController: CategoryController,
    @Inject('QueryValidator') private queryValidator: QueryValidator,
    @Inject('NestLogger') private nestLogger: NestLogger,
  ) {
    super('CategoriesHttpController');
    this.registerLoggers(this.nestLogger.loggers);
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([]))
  @UseInterceptors(
    new ValidateRequestInterceptor(CreateCategoryDto, VALIDATE_REQUEST_TYPE.BODY)
  )
  async create(
    @Body() body: CreateCategoryDto,
  ): Promise<{ message: string; category: Category }> {
    const category = await this.categoryController.saveCategory(
      new Category({ name: body.name }),
    );
    return { message: 'Category created', category };
  }
}
