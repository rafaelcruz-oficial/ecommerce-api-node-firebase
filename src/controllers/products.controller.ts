import {Request, Response} from "express";
import { Product } from "../models/product.model.js";
import { ProductService } from "../services/product.service.js";

export class ProductsController {
    static async getAll(req: Request, res: Response) {
         // #swagger.tags = ['Products']
        res.send(await new ProductService().getALL());
    }
    
    static async search(req: Request, res: Response) {
         // #swagger.tags = ['Products']
        const categoriaId = req.query.categoriaId as string;
        res.send(await new ProductService().search(categoriaId));
    }

    static async getById(req: Request, res: Response) {
         // #swagger.tags = ['Products']
        let productId =  req.params.id;
        res.send(await new ProductService().getById(`${productId}`));
    }
    
    static async save(req: Request, res: Response) {
         // #swagger.tags = ['Products']
        await new ProductService().save(req.body);
        res.status(201).send(`Produto criado com sucesso!!!`);
    }

    static async update(req: Request, res: Response) {
         // #swagger.tags = ['Products']
        let productId = req.params.id;
        let user = req.body as Product;
        await new ProductService().update(`${productId}`, user)
        res.send({
            message: "Produto alterado com sucesso!"
        });
    }

    static async delete(req: Request, res: Response) {
         // #swagger.tags = ['Products']
        let productId = req.params.id;
        await new ProductService().delete(`${productId}`)
        res.status(204).end();
    };
}