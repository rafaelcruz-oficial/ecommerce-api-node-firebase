import { Joi } from "celebrate";
import { Category } from "./category.model.js" 

export class Product  {
    id?: string;
    nome: string;
    descricao: string;
    preco: number;
    imagem: string;
    categoria: Category;
    ativa: boolean;

    constructor (data : Product | any) {
        this.id = data.id;
        this.nome = data.nome;
        this.descricao = data.descricao;
        this.preco = data.preco;
        this.imagem = data.imagem;
        this.categoria = data.categoria; // new Category();
        this.ativa = data.ativa;
    }
}


export const newProductSchema = Joi.object().keys({
    nome: Joi.string().min(3).required(),
    descricao: Joi.string().allow(null).default(null),
    preco: Joi.number().positive().required(),
    imagem: Joi.string().base64().allow(null).default(null),
    categoria: Joi.object().keys({
        id: Joi.string().required()
    }).required(),
    ativa: Joi.boolean().only().allow(true).default(true)
});

export const updateProductSchema = newProductSchema.keys({
    nome: Joi.string().min(3).required(),
    descricao: Joi.string().allow(null).default(null),
    preco: Joi.number().positive().required(),
    imagem: Joi.alternatives().try(
        Joi.string().base64(),
        Joi.string().uri()
    ).allow(null).default(null),
    categoria: Joi.object().keys({
        id: Joi.string().required()
    }).required(),
    ativa: Joi.boolean().only().allow(true).default(true)
});

export const searchQuerySchema = Joi.object().keys({
    categoriaId: Joi.string().required()
});
