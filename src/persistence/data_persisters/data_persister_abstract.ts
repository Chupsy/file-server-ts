import { BaseConfig } from '@helpers/base_interfaces';
import { Persister } from '../persister_abstract';
import File from '@domain/file';
import { FileDataPersister } from './file_data_persister_abstract';

export abstract class DataPersister<
  TConfig extends BaseConfig,
> extends Persister {
  protected fileDataPersister: FileDataPersister | undefined;

  constructor(
    className: string,
    public config: TConfig,
  ) {
    super(className);
  }

  abstract initialize(): Promise<void>;
  abstract getFileDataPersister(): FileDataPersister;
}
