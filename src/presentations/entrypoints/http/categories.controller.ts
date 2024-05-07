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
  async create(
    @Body() body: CreateCategoryDto,
  ): Promise<{ message: string; category: Category }> {
    await this.queryValidator.validate(body, CreateCategoryDto);
    const category = await this.categoryController.saveCategory(
      new Category({ name: body.name }),
    );
    return { message: 'Category created', category };
  }
}
