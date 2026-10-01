import { Joi } from "celebrate";

export type Category = {
    id?: string;
    descricao: string;
    ativa: boolean;
}


export const categorySchema = Joi.object().keys({
    descricao: Joi.string().required(),
    ativa: Joi.boolean().only().allow(true).default(true)
});

export const updateCategorySchema = categorySchema.keys({
    descricao: Joi.string().required(),
    ativa: Joi.boolean().only().allow(true).default(true)
});

