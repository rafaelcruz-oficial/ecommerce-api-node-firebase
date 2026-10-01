import { Joi } from "celebrate";
import { phoneRegexPattern } from "../utils/regex-utils.js";

export type Customer = {
    nome: string;
    telefone: string;
};

export const customerSchema = Joi.object().keys({
    nome: Joi.string().required(),
    telefone: Joi.string().regex(phoneRegexPattern).required()
});


