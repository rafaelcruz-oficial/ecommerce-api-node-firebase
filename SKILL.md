# E-commerce API --- Skill de Desenvolvimento

Este documento complementa o `README.md` e concentra as convenções
técnicas, padrões de implementação, regras de manutenção e pontos de
atenção do projeto.

## 1. Inicialização da aplicação

O ponto de entrada é:

``` text
src/index.ts
```

A aplicação inicializa Firebase Admin e Firebase SDK, cria o Express e
registra os componentes aproximadamente nesta ordem:

``` text
Firebase
   ↓
Express
   ↓
Swagger
   ↓
Auth middleware
   ↓
Routes
   ↓
404 middleware
   ↓
Error middleware
   ↓
HTTP Server
```

A porta local atual é:

``` text
3000
```

------------------------------------------------------------------------

## 2. Convenções TypeScript e ESM

O projeto utiliza ES Modules.

Imports internos TypeScript seguem o padrão:

``` ts
import { OrderService } from "../services/order.service.js";
```

Mesmo que o arquivo de origem seja `.ts`, deve-se preservar a extensão
`.js` nos imports relativos por causa da configuração `NodeNext`.

Não alterar automaticamente imports para:

``` ts
import { OrderService } from "../services/order.service";
```

sem revisar a configuração de módulos.

O `tsconfig.json` habilita verificações importantes, incluindo:

``` text
noImplicitAny
noImplicitReturns
strictNullChecks
noUnusedLocals
noEmitOnError
```

Ao criar código novo, evitar `any` quando o tipo puder ser conhecido.

Preferir tipos primitivos:

``` ts
string
number
boolean
```

Não utilizar os wrappers:

``` ts
String
Number
Boolean
```

------------------------------------------------------------------------

## 3. Rotas

As rotas são registradas em:

``` text
src/routes/index.ts
```

Uma rota deve:

1.  declarar método e path;
2.  adicionar validação Celebrate quando houver entrada;
3.  delegar ao controller;
4.  usar `expressAsyncHandler` para handlers assíncronos.

Exemplo:

``` ts
orderRoutes.post(
    "/orders",
    celebrate({
        [Segments.BODY]: newOrderSchema
    }),
    expressAsyncHandler(OrdersController.save)
);
```

Não colocar regra de negócio diretamente na definição da rota.

------------------------------------------------------------------------

## 4. Controllers

Controllers devem atuar como adaptadores HTTP.

Responsabilidades esperadas:

-   ler `req.params`, `req.query` e `req.body`;
-   construir models quando necessário;
-   chamar um service;
-   definir status HTTP;
-   retornar a resposta.

Fluxo recomendado:

``` ts
static async save(req: Request, res: Response) {
    const entity = new Entity(req.body);

    await new EntityService().save(entity);

    res.status(201).send({
        message: "Registro criado com sucesso!"
    });
}
```

### Importante para Promises

Sempre aguardar operações assíncronas quando a resposta depender delas.

Correto:

``` ts
const order = await new OrderService().getById(id);
res.send(order);
```

Evitar:

``` ts
res.send(new OrderService().getById(id));
```

Da mesma forma:

``` ts
const items = await new OrderService().getItems(id);
res.send(items);
```

------------------------------------------------------------------------

## 5. Services

Services implementam regras de negócio e orquestram repositories.

Um service pode:

-   verificar se uma entidade existe;
-   carregar relacionamentos;
-   validar regras de domínio;
-   preparar uma entidade para persistência;
-   chamar mais de um repository;
-   lançar erros de negócio.

Exemplo do fluxo de criação de pedido:

``` text
OrderService.save
   ↓
Busca Company
   ↓
Busca PaymentMethod
   ↓
Busca cada Product
   ↓
Substitui referências pelos dados válidos
   ↓
OrderRepository.save
```

Services não devem acessar `Request` ou `Response` do Express.

Services também não devem realizar consultas Firestore diretamente
quando existir um repository responsável.

------------------------------------------------------------------------

## 6. Repositories e Firestore

Repositories concentram o acesso ao Firestore.

Padrão:

``` ts
export class EntityRepository {
    private collection: CollectionReference<Entity>;

    constructor() {
        this.collection = getFirestore()
            .collection("entities")
            .withConverter(entityConverter);
    }
}
```

Quando houver converter, a collection deve preferencialmente carregar o
generic correspondente:

``` ts
CollectionReference<Order>
```

em vez de:

``` ts
CollectionReference
```

Isso evita que `DocumentData` se espalhe pela aplicação.

------------------------------------------------------------------------

## 7. Firestore Converters

Converters devem representar exatamente o tipo armazenado.

Exemplo:

``` text
orders                 → orderConverter
orders/{orderId}/items → orderItemConverter
```

Nunca utilizar `orderConverter` para documentos `OrderItem`.

Padrão:

``` ts
export const orderItemConverter: FirestoreDataConverter<OrderItem> = {
    toFirestore: (item: OrderItem): DocumentData => {
        return {
            // campos persistidos
        };
    },

    fromFirestore: (snapshot: QueryDocumentSnapshot): OrderItem => {
        return new OrderItem({
            id: snapshot.id,
            ...snapshot.data()
        });
    }
};
```

Ao adicionar uma entidade com comportamento próprio ou transformação
relevante, considerar criar seu próprio converter.

Não usar casts como `as Order` apenas para silenciar problemas de
tipagem quando um converter ou generic correto resolver o problema.

------------------------------------------------------------------------

## 8. Pedidos e subcollection de itens

Pedidos são armazenados na collection:

``` text
orders
```

Os itens ficam em uma subcollection:

``` text
orders/{pedidoId}/items
```

A gravação utiliza Firestore Batch para salvar cabeçalho e itens na
mesma operação lógica.

Estrutura:

``` text
orders
└── {orderId}
    ├── empresa
    ├── cliente
    ├── endereco
    ├── data
    ├── formaPagamento
    ├── taxaEntrega
    ├── status
    ├── subtotal
    ├── total
    └── items
        ├── {itemId}
        └── {itemId}
```

O repository usa:

``` ts
.withConverter(orderConverter)
```

para o pedido e:

``` ts
.withConverter(orderItemConverter)
```

para os itens.

Ao carregar um pedido completo:

``` ts
order.items = await this.getItems(pedidoId);
```

O `await` é obrigatório porque `getItems()` retorna
`Promise<OrderItem[]>`.

------------------------------------------------------------------------

## 9. Models

Models representam entidades da aplicação e podem conter comportamento
de domínio.

Exemplo:

``` ts
getTotal(): number {
    return this.qtde * this.produto.preco;
}
```

e:

``` ts
getSubtotal(): number {
    return this.items
        ?.map(item => item.getTotal())
        .reduce((total, next) => total + next, 0) ?? 0;
}
```

Ao construir models a partir do Firestore, tratar tipos específicos do
Firebase, como `Timestamp`.

Exemplo:

``` ts
this.data = data.data instanceof Timestamp
    ? data.data.toDate()
    : data.data;
```

------------------------------------------------------------------------

## 10. Validação com Celebrate e Joi

A validação HTTP é feita nas rotas com Celebrate.

Schemas ficam próximos aos models.

Exemplo:

``` ts
export const orderItemSchema = Joi.object().keys({
    produto: Joi.object().keys({
        id: Joi.string().trim().required()
    }).required(),

    qtde: Joi.number()
        .integer()
        .positive()
        .required(),

    observacao: Joi.string()
        .trim()
        .allow(null)
        .default(null)
});
```

Para alternativas:

``` ts
Joi.alternatives()
    .try(
        Joi.string().length(11),
        Joi.string().length(14)
    )
```

Não usar:

``` ts
Joi.alternatives(schema1, schema2).try()
```

porque `.try()` sem schemas gera:

``` text
Missing alternative schemas
```

Ao permitir `null` no Joi, alinhar também o tipo TypeScript.

Exemplo:

``` ts
observacao: string | null;
```

------------------------------------------------------------------------

## 11. Autenticação

A autenticação utiliza Firebase Authentication através do Firebase Admin
SDK.

O token é obtido do header:

``` text
Authorization: Bearer <token>
```

O middleware usa:

``` ts
getAuth().verifyIdToken(token, true)
```

Rotas específicas de autenticação podem ser acessadas sem token.

Usuários anônimos recebem tratamento específico, e usuários autenticados
podem ser carregados para:

``` ts
req.user
```

O tipo customizado do Express fica em:

``` text
src/@types/express.d.ts
```

Ao criar uma nova rota, verificar se ela deve ser:

-   pública;
-   acessível anonimamente;
-   autenticada;
-   sujeita a autorização adicional.

Não contornar os middlewares de segurança diretamente no controller.

------------------------------------------------------------------------

## 12. Tratamento de erros

O projeto utiliza erros customizados:

``` text
ErrorBase
├── NotFoundError
├── UnauthorizedError
├── ForbiddenError
├── ValidationError
├── EmailAlreadyExistsError
└── InternalServerError
```

O middleware global fica em:

``` text
src/middleware/error-handle.middleware.ts
```

Erros conhecidos derivados de `ErrorBase` devem ser enviados usando o
comportamento da própria classe.

Erros inesperados são convertidos para `InternalServerError`.

Services devem preferir erros de domínio existentes.

Exemplo:

``` ts
if (!produto) {
    throw new NotFoundError("Produto não encontrado!");
}
```

Evitar retornar erros HTTP diretamente de repositories ou services.

------------------------------------------------------------------------

## 13. Swagger / OpenAPI

A documentação utiliza:

-   `swagger-autogen`;
-   `swagger-ui-express`.

Arquivo de configuração:

``` text
swagger.js
```

Arquivo gerado:

``` text
src/docs/swagger-output.json
```

Comando:

``` bash
npm run swagger
```

A interface Swagger é registrada pela rota:

``` text
src/routes/swagger-docs.route.ts
```

Ao criar ou alterar endpoints, atualizar comentários Swagger e regenerar
o arquivo.

Não editar manualmente `swagger-output.json` como fonte principal quando
a informação puder ser gerada a partir das rotas/configuração.

------------------------------------------------------------------------

## 14. Scripts disponíveis

### Desenvolvimento

``` bash
npm start
```

Executa TypeScript em watch e inicia:

``` text
lib/index.js
```

com variáveis do `.env`.

### Build

``` bash
npm run build
```

### Build em watch

``` bash
npm run build:watch
```

### Swagger

``` bash
npm run swagger
```

### Lint

``` bash
npm run lint
```

### Firebase Emulator

Existe atualmente:

``` bash
npm run start:firebase
```

configurado para iniciar emuladores relacionados às Functions.

### Deploy

O projeto possui script de deploy Firebase. Antes de utilizá-lo, revisar
o comando atual e garantir que lint, Swagger e build estejam executando
corretamente.

------------------------------------------------------------------------

## 15. Arquivos gerados

O TypeScript compila:

``` text
src/
```

para:

``` text
lib/
```

A pasta `lib` é código gerado e não deve ser tratada como fonte
principal.

Alterações devem ser feitas em:

``` text
src/
```

e recompiladas.

Não corrigir bugs diretamente em:

``` text
lib/**/*.js
```

------------------------------------------------------------------------

## 16. Variáveis de ambiente e credenciais

O projeto utiliza variáveis como:

``` text
GOOGLE_APPLICATION_CREDENTIALS
API_KEY
```

Nunca colocar valores reais de credenciais neste documento, em commits,
exemplos públicos ou mensagens de log.

O arquivo `.env` deve permanecer fora do Git.

Arquivos de Service Account/Firebase Admin também devem permanecer fora
do Git.

Padrões recomendados para `.gitignore`:

``` gitignore
node_modules/
lib/
.env
.env.*
!.env.example

*-firebase-adminsdk-*.json
*service-account*.json
firebase-adminsdk*.json

*.log
```

Criar um `.env.example` apenas com nomes de variáveis e valores
fictícios:

``` env
GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account.json
API_KEY=your_firebase_api_key
```

------------------------------------------------------------------------

## 17. Convenção para criar um novo recurso

Ao adicionar uma nova entidade, seguir preferencialmente:

``` text
src/models/entity.model.ts
src/repositories/entity.repository.ts
src/services/entity.service.ts
src/controllers/entity.controller.ts
src/routes/entity.route.ts
```

Fluxo:

``` text
1. Model
2. Schema Joi
3. Firestore converter, quando aplicável
4. Repository
5. Service
6. Controller
7. Route
8. Registro em routes/index.ts
9. Swagger
10. Build e testes
```

### Model

Definir tipos e comportamento da entidade.

### Schema

Validar apenas os dados permitidos para aquela operação.

### Repository

Implementar persistência.

### Service

Implementar regras de negócio.

### Controller

Adaptar HTTP para o service.

### Route

Declarar endpoint, validação e handler.

------------------------------------------------------------------------

## 18. Regras para alterações feitas por IA

Antes de modificar o projeto:

1.  localizar a camada responsável;
2.  verificar model, schema e repository relacionados;
3.  verificar se existe converter Firestore;
4.  verificar chamadas assíncronas e `await`;
5.  verificar impacto em Swagger;
6.  preservar ES Modules e imports `.js`;
7.  não alterar arquivos compilados em `lib`;
8.  não expor `.env` ou credenciais;
9.  não introduzir dependência nova sem necessidade;
10. executar build após alterações relevantes.

Uma alteração deve ser pequena e coerente com a arquitetura existente.

Não mover lógica de negócio para controllers apenas para reduzir
arquivos.

Não acessar Firestore diretamente de controllers.

Não duplicar validações já centralizadas em Joi/Celebrate.

Não silenciar problemas de tipos com `any`, `as unknown as`, `as Entity`
ou `@ts-ignore` sem justificar tecnicamente.

------------------------------------------------------------------------

## 19. Pontos identificados que merecem revisão

Os itens abaixo foram encontrados na versão analisada do projeto. Eles
representam pontos de atenção, não padrões a serem reproduzidos.

### 22.1 `formaPagmento`

No schema de criação de pedido existe:

``` ts
formaPagmento
```

enquanto o model utiliza:

``` ts
formaPagamento
```

Padronizar para `formaPagamento`.

### 22.2 `observacao` x `observacoes`

O model de `Order` trabalha com:

``` ts
observacoes
```

enquanto o converter persiste:

``` ts
observacao
```

Isso pode fazer o valor não ser reconstruído corretamente após leitura
do Firestore.

Escolher um único nome e utilizá-lo no model, schema, converter e
Swagger.

### 22.3 Endereço opcional

O schema permite `endereco = null` quando `isEntrega` é falso, mas o
model atualmente declara:

``` ts
endereco: Address;
```

e o converter acessa propriedades de `order.endereco` diretamente.

Alinhar a nulabilidade:

``` ts
endereco: Address | null;
```

e tratar `null` no converter.

### 22.4 Controllers de pedidos e Promises

Alguns métodos retornam Promises diretamente para `res.send()`.

Preferir:

``` ts
const result = await service.method();
res.send(result);
```

### 22.5 Tipo `String`

Existe uso de:

``` ts
id: String
```

em `ProductService`.

Alterar para:

``` ts
id: string
```

### 22.6 Mensagem de erro de produto

`ProductService.getById()` utiliza mensagem relacionada a categoria
quando um produto não é encontrado.

Revisar para:

``` text
Produto não encontrado!
```

### 22.7 `ProductService.save`

Revisar a implementação atual porque o método `save()` chama
`productRepository.update(product)`.

Confirmar se a intenção é criar ou atualizar o documento.

### 22.8 Upload assíncrono

Ao realizar upload de arquivo, verificar se a operação precisa ser
aguardada com `await` antes da persistência.

### 22.9 Datas em pesquisa de pedidos

O repository adiciona um dia a `dataInicio` e `dataFim`.

Validar se essa regra é intencional ou uma compensação de timezone antes
de reutilizá-la em novos filtros.

### 22.10 Swagger

Há nomes e exemplos que devem ser revisados para manter consistência com
os models, incluindo endereço, forma de pagamento e observações.

------------------------------------------------------------------------

## 20. Checklist antes de finalizar uma alteração

``` text
[ ] Alterei apenas arquivos fonte em src/
[ ] Mantive imports ESM com .js
[ ] Não introduzi any desnecessário
[ ] Promises necessárias possuem await
[ ] Validações Joi estão alinhadas aos tipos TypeScript
[ ] Null/undefined estão tratados
[ ] Firestore converter corresponde ao model correto
[ ] Repository concentra acesso ao banco
[ ] Service concentra regra de negócio
[ ] Controller permanece simples
[ ] Swagger foi atualizado quando necessário
[ ] Nenhuma credencial foi adicionada ao código
[ ] npm run build passa sem erros
```

------------------------------------------------------------------------

## 21. Regra principal

Ao trabalhar neste projeto, priorizar:

``` text
clareza
→ tipagem
→ separação de responsabilidades
→ consistência
→ segurança
→ simplicidade
```

Não reproduzir automaticamente inconsistências existentes. Quando um
padrão atual aparentar ser um bug, corrigir de forma localizada ou
sinalizar o problema antes de propagá-lo para código novo.
