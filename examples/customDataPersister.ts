import File from "@domain/file";
import { CategoryDataPersister } from "@persistence/data_persisters/category_data_persister_abstract";
import { DataPersister } from "@persistence/data_persisters/data_persister_abstract";
import { FileDataPersister } from "@persistence/data_persisters/file_data_persister_abstract";

export class CustomDataPersister extends DataPersister<{test: string}>{
    getFileDataPersister(): FileDataPersister {
        throw new Error("Method not implemented.");
    }
    getCategoryDataPersister(): CategoryDataPersister {
        throw new Error("Method not implemented.");
    }

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