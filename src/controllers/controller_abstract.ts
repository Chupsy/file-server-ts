import { BaseConfig } from '@helpers/base_interfaces';
import { Loggable } from '@helpers/logger/loggable_abstract';
import { DataPersister } from '@persistence/data_persisters/data_persister_abstract';
import { FilePersister } from '@persistence/file_persisters/file_persister_abstract';

export abstract class Controller extends Loggable {
  constructor(
    protected dataPersister: DataPersister<BaseConfig>,
    protected filePersister: FilePersister<BaseConfig>,
    className: string,
  ) {
    super(className);
  }
}
