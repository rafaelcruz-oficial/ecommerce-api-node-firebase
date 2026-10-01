import { Request, Response } from "express";
import { CompanyService } from "../services/company.service.js";
import { Company } from "../models/company.model.js";


export class CompaniesController {
    static async getAll(req: Request, res: Response) {
        // #swagger.tags = ['Companies']
        res.send(await new CompanyService().getALL());
    }

    static async getById(req: Request, res: Response) {
         // #swagger.tags = ['Companies']
        let companyId =  req.params.id;
        res.send(await new CompanyService().getById(`${companyId}`));
    }
    
    static async save(req: Request, res: Response) {
         // #swagger.tags = ['Companies']
        await new CompanyService().save(req.body);
        res.status(201).send(`Empresa criado com sucesso!!!`);
    }

    static async update(req: Request, res: Response) {
         // #swagger.tags = ['Companies']
        let companyId = req.params.id;
        let company = req.body as Company;
        await new CompanyService().update(`${companyId}`, company)
        res.send({
            message: "Empresa alterada com sucesso!"
        });
    }


}