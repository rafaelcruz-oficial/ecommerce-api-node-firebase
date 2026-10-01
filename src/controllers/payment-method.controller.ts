import {Request, Response} from "express";
import { PaymentMethod } from "../models/payment-method.model.js";
import { PaymentMethodService } from "../services/payment-method.service.js";

export class PaymentMethodsController {
    static async getAll(req: Request, res: Response) {
         // #swagger.tags = ['Payment-method']
        res.send(await new PaymentMethodService().getALL());
    }

    static async getById(req: Request, res: Response) {
         // #swagger.tags = ['Payment-method']
        let paymentMethodId =  req.params.id;
        res.send(await new PaymentMethodService().getById(`${paymentMethodId}`));
    }
    
    static async save(req: Request, res: Response) {
         // #swagger.tags = ['Payment-method']
        await new PaymentMethodService().save(req.body);
        res.status(201).send(`Categoria criado com sucesso!!!`);
    }

    static async update(req: Request, res: Response) {
         // #swagger.tags = ['Payment-method']
        let paymentMethodId = req.params.id;
        let paymentMethod = req.body as PaymentMethod;
        await new PaymentMethodService().update(`${paymentMethodId}`, paymentMethod)
        res.send({
            message: "Forma de Pagamento alterada com sucesso!"
        });
    }

    static async delete(req: Request, res: Response) {
         // #swagger.tags = ['Payment-method']
        let paymentMethodId = req.params.id;
        await new PaymentMethodService().delete(`${paymentMethodId}`)
        res.status(204).end();
    };
}