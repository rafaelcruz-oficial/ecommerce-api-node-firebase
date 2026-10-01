import { Joi } from "celebrate";

export type User = {
    id: string;
    nome: string;
    email: string;
    password?: string;
    idade: number;
}

export const newUserSchema = Joi.object().keys({
    nome: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    idade: Joi.number().required() 
});

export const updateUserSchema = Joi.object().keys({
    nome: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6),
    idade: Joi.number().required() 
});

export const authLoginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required().messages({
        "any.required": "A senha é obrigatória!",
        "string.min": "A senha precisa ter no mínimo 6 caracteres!"
    })
});

export const authRecoverySchema = Joi.object().keys({
    email: Joi.string().email().required()
});