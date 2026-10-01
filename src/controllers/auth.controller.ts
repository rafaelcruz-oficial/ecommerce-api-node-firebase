import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
    static async login(req: Request, res: Response) {
        // #swagger.tags = ['Auth']
        // #swagger.summary = 'Autenticação de usuário administradores'
        // #swagger.description = 'Rota utilizada para autenticação de usuários administradores usando email e senha.'
        const { email, password } = req.body;

        const userRecord = await new AuthService().login(email, password);
        const token = await userRecord.user.getIdToken(true);
        res.send({
            token: token
        });
    }

    static async recovery(req: Request, res: Response) {
        // #swagger.tags = ['Auth']
        // #swagger.summary = 'Recuperação de senha'
        // #swagger.description = 'Rota utilizada para recuperação de senhas através do e-mail do usuário. Receba um e-mail para recuperação de senha.'
        /* #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/recovery"
                    }
                }
            }

            #swagger.responses[200] = {
                description: 'Token do usuário autenticado',
                content: {
                    "application/json": {
                        schema: {
                            type: 'object',
                            properties: {
                                token: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                }
            }
        }
        */
        const { email } = req.body;
        await new AuthService().recovery(email);
        res.status(204).end();
        // Por questão de segurança, aqui não retorna nada
        // Nenhum hacker precisa saber se existe o email ou não do cliente.
        // Então retorna sempre positivo na ação
    }

    static async signin(req: Request, res: Response) {
        // #swagger.tags = ['Auth']
        // #swagger.summary = 'Autenticação anônima de usuários clientes'
        // #swagger.description = 'Rota utilizada para autenticação de usuários clientes para realização  para realização de cadastro prévio.'
         /* 

            #swagger.responses[200] = {
                description: 'Token do usuário anônimo',
                content: {
                    "application/json": {
                        schema: {
                            type: 'object',
                            properties: {
                                token: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                }
            }
        }
        */
        
        const userRecord = await new AuthService().signin();
        const token = userRecord.user.getIdToken(true);
        res.send({
            token: token
        });
    }
}