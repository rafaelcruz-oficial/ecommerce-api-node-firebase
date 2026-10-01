import { ErrorBase } from "./base.error.js";

export class UnauthorizedError extends ErrorBase {
    
    constructor(message = "Não autorizado") {
        super(401, message);
    }
}