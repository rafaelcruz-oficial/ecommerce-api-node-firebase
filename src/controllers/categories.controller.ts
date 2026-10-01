import {Request, Response} from "express";
import { Category } from "../models/category.model.js";
import { CategoryService } from "../services/category.service.js";

export class CategoriesController {
    static async getAll(req: Request, res: Response) {
        // #swagger.tags = ['Categories']
        res.send(await new CategoryService().getALL());
    }

    static async getById(req: Request, res: Response) {
        // #swagger.tags = ['Categories']
        let categoryId =  req.params.id;
        res.send(await new CategoryService().getById(`${categoryId}`));
    }
    
    static async save(req: Request, res: Response) {
        // #swagger.tags = ['Categories']
        await new CategoryService().save(req.body);
        res.status(201).send(`Categoria criado com sucesso!!!`);
    }

    static async update(req: Request, res: Response) {
        // #swagger.tags = ['Categories']
        let categoryId = req.params.id;
        let user = req.body as Category;
        await new CategoryService().update(`${categoryId}`, user)
        res.send({
            message: "Categoria alterado com sucesso!"
        });
    }

    static async delete(req: Request, res: Response) {
        // #swagger.tags = ['Categories']
        let categoryId = req.params.id;
        await new CategoryService().delete(`${categoryId}`)
        res.status(204).end();
    };
}