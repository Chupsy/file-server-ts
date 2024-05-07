import { QueryValidator } from '@presentations/middlewares/query_validators/query_validator';
import { FileController } from '@controllers/file_controller';
import { Loggable } from '@helpers/logger/loggable_abstract';
import { FileSizeValidator } from '@presentations/middlewares/filesize_validator';

interface BaseConfig {}

export abstract class Entrypoint<TConfig extends BaseConfig> extends Loggable {
  protected fileController: FileController;

  protected queryValidator: QueryValidator;

  protected fileSizeValidator: FileSizeValidator;

  constructor(
    fc: FileController,
    qv: QueryValidator,
    fsv: FileSizeValidator,
    className: string,
    public config: TConfig,
  ) {
    super(className);
    this.fileController = fc;
    this.queryValidator = qv;
    this.fileSizeValidator = fsv;
  }

  public abstract start(): void;
}
