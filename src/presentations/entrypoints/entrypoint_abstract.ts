import { QueryValidator } from '@validators/query_validators/query_validator';
import { FileController } from '@controllers/file_controller';
import { Loggable } from '@helpers/logger/loggable_abstract';
import { FileSizeValidator } from '@presentations/validators/filesize_validator';

export abstract class Entrypoint extends Loggable {
  protected fileController: FileController;

  protected queryValidator: QueryValidator;

  protected fileSizeValidator: FileSizeValidator;

  constructor(
    fc: FileController,
    qv: QueryValidator,
    fsv: FileSizeValidator,
    className: string,
  ) {
    super(className);
    this.fileController = fc;
    this.queryValidator = qv;
    this.fileSizeValidator = fsv;
  }
}
