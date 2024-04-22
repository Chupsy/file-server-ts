import { Loggable } from "../helpers/logger/loggable_abstract";
import { DataPersister } from "../persistence/data_persisters/data_persister_abstract";
import { FilePersister } from "../persistence/file_persisters/file_persister_abstract";

export abstract class Controller extends Loggable{
    protected dataPersister: DataPersister;
    protected filePersister: FilePersister;
    
    constructor ( dp: DataPersister, fp:FilePersister){
        super();
        this.dataPersister = dp;
        this.filePersister = fp;
    }
}