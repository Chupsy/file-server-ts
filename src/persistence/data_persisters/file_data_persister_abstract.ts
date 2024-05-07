import File from '@domain/file';
import { Loggable } from '@helpers/logger/loggable_abstract';

export abstract class FileDataPersister extends Loggable {
  constructor(className: string) {
    super(className);
  }

  abstract saveFile(file: File): Promise<File>;
  abstract getFile(fileId: string): Promise<File>;
  abstract deleteFile(file: File): Promise<void>;
  abstract updateFile(file: File): Promise<void>;
}
