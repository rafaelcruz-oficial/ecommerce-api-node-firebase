import {NextFunction, Request, Response} from "express";
import { UserService } from "../services/user.service.js";
import { User } from "../models/user.model.js";


export class UsersController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        // #swagger.tags = ['Users'];
        // #swagger.summary = 'Obtenha todos os usuários cadastrados'
        // #swagger.description = 'Obtenha doso os usuários da emrpesa.'
        /* 
            #swagger.responses[200] = {
                description: 'Lista de todos os usuários',
                content: {
                    "application/json": {
                        schema: {
                            type: 'array',
                            itens: {
                                $ref: '#/components/schemas/User'
                            }
                        }
                    }
                }
            }
        */
 
 
        res.send(await new UserService().getALL());
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        // #swagger.tags = ['Users']
        // #swagger.summary = 'Busque um usuário pelo id'
        // #swagger.description = 'Obtenha um usuário pelo id.'
        // #swagger.parameters['id'] = { description: 'Id do usuário'}

        /* 
            #swagger.responses[200] = {
                description: 'Dados do usuário',
                content: {
                    "application/json": {
                        schema: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string'
                                },
                                nome: {
                                    type: 'string'
                                },
                                email: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                }
            }
        */
 
        let userId =  req.params.id;
        res.send(await new UserService().getById(`${userId}`));
    }
    
    static async save(req: Request, res: Response, next: NextFunction) {
        // #swagger.tags = ['Users']
        // #swagger.summary = 'Crie um novo usuário'
        // #swagger.tags = 'Crie um novo usuário para acessar as funcionalidades da empresa.'
       
        /* 
        
            #swagger.requestBody = {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: '#/components/schemas/addUser'
                        }
                    }
                }
            }
        
        */ 
        await new UserService().save(req.body);
        res.status(201).send(`Usuário criado com sucesso!!!`);
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        // #swagger.tags = ['Users']
        let userId = req.params.id;
        let user = req.body as User;
        await new UserService().update(`${userId}`, user)
        res.send({
            message: "Usuário alterado com sucesso!"
        });
    }

    static async delete(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        let userId = req.params.id;
    
        await new UserService().delete(`${userId}`)
    
        if (!userId) {
            res.status(404).send({
                message: "Usuário não encontrado!"
            });
        }
        
        res.status(204).end();
    };
}