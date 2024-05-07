import { BaseConfig } from '@helpers/base_interfaces';
import { Persister } from '../persister_abstract';
import File from '@domain/file';

export abstract class FilePersister<
  TConfig extends BaseConfig,
> extends Persister {
  constructor(
    className: string,
    public config: TConfig,
  ) {
    super(className);
  }

  abstract saveFile(file: File): Promise<File>;
  abstract getFile(file: File): Promise<File>;
}
