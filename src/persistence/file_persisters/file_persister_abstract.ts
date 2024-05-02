import { Persister } from '../persister_abstract';
import File from '@domain/file';

export abstract class FilePersister extends Persister {
  abstract saveFile(file: File): Promise<File>;
  abstract getFile(file: File): Promise<File>;
}
