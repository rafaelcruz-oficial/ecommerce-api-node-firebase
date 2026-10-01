import { ErrorBase} from "./base.error.js";

export class InternalServerError extends ErrorBase {

    constructor(message = "Erro interno do Servidor"){
        super(500, message);
    }


}