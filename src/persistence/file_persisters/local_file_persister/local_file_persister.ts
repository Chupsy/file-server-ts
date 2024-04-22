import path from 'path';
import { promises as fs } from 'fs';
import { File } from "@domain/file";
import { FilePersister } from "../file_persister_abstract";
import { FileNotFoundError } from '@helpers/errors/file_not_found.exception';

export class LocalFilePersister extends FilePersister{
    private basePath: string;

    constructor(basePath: string) {
        super();
        this.basePath = basePath;
    }

    async saveFile(file: File): Promise<File> {
        if(!file.data){
            throw new Error('no data in file');
        }
        const filePath = path.join(this.basePath, file.filename);

        try {
            await fs.writeFile(filePath, file.data);
            return file;
        } catch (error) {
            throw new Error('Failed to save file: ' + error);
        }
    }
    async getFile(file: File): Promise<File> {
        const filePath = path.join(this.basePath, file.filename);
        try {
            file.data = await fs.readFile(filePath);
            return file;
        } catch (error) {
            throw new FileNotFoundError();
        }
    }
}
