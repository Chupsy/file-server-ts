import { Persister } from "../persister_abstract";
import {File} from '@domain/file'

export abstract class DataPersister extends Persister{
    abstract saveFile(file:File):Promise<File>;
    abstract getFile(fileId:number):Promise<File>;
}