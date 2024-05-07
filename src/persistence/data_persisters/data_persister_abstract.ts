import { BaseConfig } from '@helpers/base_interfaces';
import { Persister } from '../persister_abstract';
import File, { FileWithData } from '@domain/file';

export abstract class DataPersister<
  TConfig extends BaseConfig,
> extends Persister {
  constructor(
    className: string,
    public config: TConfig,
  ) {
    super(className);
  }

  abstract initialize(): Promise<void>;
  abstract saveFile(file: File): Promise<File>;
  abstract getFile(fileId: string): Promise<File>;
  abstract deleteFile(file: File): Promise<void>;
  abstract updateFile(file: File): Promise<void>;
}
