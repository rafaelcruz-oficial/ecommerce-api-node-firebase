import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'E-commerce API',
        description: 'API para gestão de dadso do E-Commerce'
    },
    // host: 'http://127.0.0.1:5001/e-commerce-d1288/us-central1',
    // basePath: '/api',
    // schemes: ['http'],
    servers: [
        {
            url: 'http://127.0.0.1:5001/e-commerce-d1288/us-central1',
            description: 'DEV'
        },
        {
            url: 'http://127.0.0.1:5001/e-commerce-d1288/us-central1',
            description: 'PROD'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        },
        schemas: {
            addUser: {
                $nome: "João da Silva",
                $email: "joaodasilva@mail.com",
                $password: "123456"
            },
            recovery: {
                $email: "usuario@gmail.com"
            },
            User: {
                id: "2mkre4j5gPo0BFGl5pyi",
                nome: "João da Silva",
                email: "joaodasilva@mail.com",
            },
            addOrder: {
                $empresa: {
                    $id: "1SBiiMrf4JUUFG57M76F"
                },      
                $cliente: {
                    $nome: "João da Silva",
                    $telefone: "1199999999"
                },
                endreco:{
                    cep: "7590000",
                    $logradouro: "Rua Brandura",
                    $numero: "11",
                    $bairro: "Setor XPTO",
                    $complemento: "402",
                    $cidade: "Não-me-toque",
                    $uf: "RS"
                },
                cpfCnpjCupom: null,
                $isEntrega: true,
                $formaPagamento: {
                    $id: "NdmCoyl01T3gHwhO0pyQ",
                },
                $taxaEntrega: 100,
                $items: [{
                    $produto: {
                        $id: "3UfzI8CSCak5eC0UJJ8gI",
                    },
                    $qtde: 1,
                    observacoes: null,
                }],
                status: {
                    "@enum": ["pendente", null]
                },
                observacoes: null,  
                
            },
            updateOrderStatus: {
                $status: {
                    "@enum": ["aprovado", "entrega", "concluido", "cancelado", null]
                },
            },
        },
        parameters: {
            empresaId: {
                name: 'empresaId',
                in: 'query',
                description: 'Id da empresa',
                schema: {
                    type: 'string'
                }
            },
            dataInicio: {
                name: 'dataInico',
                in: 'query',
                description: 'Data de inicio do filtro no formato YYYY-MM-DD',
                schema: {
                    type: 'date'
                }
            },
            dataFim: {
                name: 'dataFim',
                in: 'query',
                description: 'Data de fim do filtro no formato YYYY-MM-DD',
                schema: {
                    type: 'date'
                }
            },
            orderStatus: {
                name: 'status',
                in: 'query',
                description: 'Status do pedido.',
                schema: {
                    type: 'string',
                    enum: ['pendente', 'aprovado', 'entrega', 'concluido', 'cancelado']
                }
            },
        }
        
    },
    tags: [
        {
            "name": "Auth",
            "description": "Autenticação de usuários",
        },
        {
            "name": "Users",
            "description": "Gestão de usuários",
        }
    ]
};

const outputFile = './src/docs/swagger-output.json';
const routes = ['./src/routes/index.ts'];

swaggerAutogen({openapi: "3.0.0"})(outputFile, routes, doc);