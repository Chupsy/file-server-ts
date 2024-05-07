import { QueryValidator } from '@presentations/middlewares/query_validators/query_validator';
import { FileController } from '@controllers/file_controller';
import { Loggable } from '@helpers/logger/loggable_abstract';
import { FileSizeValidator } from '@presentations/middlewares/filesize_validator';
import { CategoryController } from '@controllers/category_controller';

interface BaseConfig {}

export abstract class Entrypoint<TConfig extends BaseConfig> extends Loggable {
  protected fileController: FileController;

  protected categoryController: CategoryController;

  protected queryValidator: QueryValidator;

  protected fileSizeValidator: FileSizeValidator;

  constructor(
    fc: FileController,
    cc: CategoryController,
    qv: QueryValidator,
    fsv: FileSizeValidator,
    className: string,
    public config: TConfig,
  ) {
    super(className);
    this.fileController = fc;
    this.categoryController = cc;
    this.queryValidator = qv;
    this.fileSizeValidator = fsv;
  }

  public abstract start(): void;
}
