import mariadb from 'mariadb';
import { DataPersister } from '../data_persister_abstract';
import { File } from '../../../domain/file';
import { FileNotFoundError } from '../../../helpers/errors/file_not_found.exception';

export class MariaDBPersister extends DataPersister{

    private pool: mariadb.Pool;

    constructor(){
        super();
        this.pool = mariadb.createPool({
            host: '127.0.0.1', 
            port:3306,
            user:'root', 
            database:'files',
            password: 'my-secret-pw',
            connectionLimit: 5
       });
    }

    // CREATE TABLE files (
    // id MEDIUMINT NOT NULL AUTO_INCREMENT,
    // filename CHAR(30) NOT NULL,
    // mimeType CHAR(30),
    // PRIMARY KEY (id));
    async saveFile(file: File): Promise<File> {
        const connection = await this.pool.getConnection();
        const res = await connection.query(`
            INSERT INTO files (filename, mimeType)
            VALUES ('${file.filename}', '${file.mimeType}');
        `)
        connection.end();

        file.id = res.insertId;
        return file;
    }

    async getFile(fileId: number): Promise<File> {
        const connection = await this.pool.getConnection();
        const query = 'SELECT id, filename, mimeType FROM files WHERE id = ?';
        const values = [fileId];
        const res = await connection.query(query, values);
        connection.end();

        if (res.length > 0) {
            const { id, filename, mimeType } = res[0];
            return { id, filename, mimeType };
        } else {
            throw new FileNotFoundError();
        }
    }


}