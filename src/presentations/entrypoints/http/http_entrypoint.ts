import { NestFactory } from "@nestjs/core";

import { Entrypoint } from "../entrypoint_abstract";
import { FileController } from "../../../controllers/file_controller";
import { AppModule } from "./http_module";
import { QueryValidator } from "../../validators/query_validators/query_validator";
import { NestLogger } from "./nest_logger";
import { AllExceptionsFilter } from "./http-exception.filter";

export class HttpEntrypoint extends Entrypoint{

    private port:number;
    private nestLogger: NestLogger;

    constructor(fc: FileController, qv: QueryValidator, port:number){
        super(fc, qv);
        this.port = port;
        this.nestLogger = new NestLogger();
    }

    public async start():Promise<void>{
        this.nestLogger.registerLoggers(this.loggers);
        const app = await NestFactory.create(AppModule.forRoot(this.fileController, this.queryValidator, this.nestLogger), {
            logger: this.nestLogger
        });
        app.useGlobalFilters(new AllExceptionsFilter(this.nestLogger));
        await app.listen(this.port);
    }

}