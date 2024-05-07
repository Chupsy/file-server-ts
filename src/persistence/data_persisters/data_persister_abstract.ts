import { BaseConfig } from '@helpers/base_interfaces';
import { Persister } from '../persister_abstract';
import { FileDataPersister } from './file_data_persister_abstract';
import { CategoryDataPersister } from './category_data_persister_abstract';

export abstract class DataPersister<
  TConfig extends BaseConfig,
> extends Persister {
  protected fileDataPersister: FileDataPersister | undefined;
  protected categoryDataPersister: CategoryDataPersister | undefined;

  constructor(
    className: string,
    public config: TConfig,
  ) {
    super(className);
  }

  abstract initialize(): Promise<void>;
  abstract getFileDataPersister(): FileDataPersister;
  abstract getCategoryDataPersister(): CategoryDataPersister;
}
