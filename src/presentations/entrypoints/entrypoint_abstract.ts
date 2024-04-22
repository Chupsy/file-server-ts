import { QueryValidator } from "../validators/query_validators/query_validator";
import { FileController } from "./../../controllers/file_controller";
import { Loggable } from "../../helpers/logger/loggable_abstract";

export abstract class Entrypoint extends Loggable{
    protected fileController: FileController;

    protected queryValidator: QueryValidator;

    constructor(fc: FileController, qv: QueryValidator){
        super();
        this.fileController = fc;
        this. queryValidator = qv;
    }
}