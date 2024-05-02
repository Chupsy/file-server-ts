<<<<<<< HEAD
import { HttpEntrypoint } from "@presentations/entrypoints/http/http_entrypoint";
import { FileController } from "@controllers/file_controller";
import { Logger } from "@helpers/logger/logger_abstract";
import { WinstonLogger } from "@helpers/logger/winston/winston";
import { QueryValidator } from "@validators/query_validators/query_validator";
import { MariaDBPersister } from "@persistence/data_persisters/MariaDB/mariadb_data_persister";
import { LocalFilePersister } from "@persistence/file_persisters/local_file_persister/local_file_persister";
=======
import { HttpEntrypoint } from "presentations/entrypoints/http/http_entrypoint";
import { FileController } from "controllers/file_controller";
import { Logger } from "helpers/logger/logger_abstract";
import { WinstonLogger } from "helpers/logger/winston/winston";
import { QueryValidator } from "presentations/validators/query_validators/query_validator";
import { MariaDBPersister } from "persistence/data_persisters/MariaDB/mariadb_data_persister";
import { LocalFilePersister } from "persistence/file_persisters/local_file_persister/local_file_persister";
>>>>>>> 5904a69 (Add ESLint and relative path)

export class Runner{

    private filePersister:LocalFilePersister;
    private dataPersister:MariaDBPersister;
    private fileController:FileController;
    private queryValidator:QueryValidator;
    private entrypoint:HttpEntrypoint;
    private loggers:Logger[];

    constructor(){
        this.filePersister = new LocalFilePersister('/tmp');
        this.dataPersister = new MariaDBPersister();
        this.fileController = new FileController(this.dataPersister, this.filePersister);
        this.queryValidator = new QueryValidator();
        this.entrypoint = new HttpEntrypoint(this.fileController, this.queryValidator, 3000);
        this.loggers = [new WinstonLogger()];
        this.entrypoint.registerLoggers(this.loggers);
        this.fileController.registerLoggers(this.loggers);
        this.filePersister.registerLoggers(this.loggers);
        this.dataPersister.registerLoggers(this.loggers);
    }

    public async start(){
        await this.entrypoint.start();
    }
}