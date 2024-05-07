import File from "@domain/file";
import { DataPersister } from "@persistence/data_persisters/data_persister_abstract";

export class CustomDataPersister extends DataPersister<{test: string}>{

    constructor(config: {test:string}){
        super("CustomDataPersister", config);
    }
    public async initialize(): Promise<void> {
        this.logWarn("INITIALIZE CUSTOM DATA PERSISTER");
    }
    public async saveFile(file: File): Promise<File> {
        return file;
    }
    public async getFile(fileId: number): Promise<File> {
        return {
            filename:"tata"
        }
    }
    public async deleteFile(file: File): Promise<void> {
        this.logWarn("file deleted");
    }

}