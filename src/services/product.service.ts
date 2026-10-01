import { Product } from "../models/product.model.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { CategoryRepository } from "../repositories/category.repository.js";
import { UploadFileService } from "./upload-file.service.js";
import { isStorageUrlValid } from "../utils/validation-utils.js";


export class ProductService {

    private productRepository: ProductRepository;
    private categoryRepository: CategoryRepository;
    private uploadFileService: UploadFileService;

    constructor() {
        this.productRepository =  new ProductRepository();
        this.categoryRepository = new CategoryRepository();
        this.uploadFileService = new UploadFileService("images/products/");
    }

    async getALL(): Promise<Product[]> {
        return this.productRepository.getALL();
    }

    async search(categoriaId: string): Promise<Product[]> {
        return this.productRepository.search(categoriaId);
    }

    async getById(id: string): Promise<Product> {
        const product = await this.productRepository.getById(id)
        if(!product) {
            throw new NotFoundError("Categoria não encontrado!");
        }   
        return product
    }

    async save(product: Product): Promise<void> {
        

        const categoria = await this.getGategoriaById(product.categoria.id!);
        product.categoria = categoria;
        if (product.imagem) {
            this.uploadFileService.upload(product.imagem);
        }
        await this.productRepository.update(product);    
    }

    async update(id: string, product: Product): Promise<void> {

        const _product = await this.getById(id);
        const categoria = await this.getGategoriaById(product.categoria.id!);

        if (product.imagem &&!isStorageUrlValid(product.imagem)) {
            product.imagem =  await this.uploadFileService.upload(product.imagem)
        }

        _product.nome = product.nome;
        _product.descricao = product.descricao;
        _product.preco = product.preco;
        _product.imagem = product.imagem;
        _product.categoria = categoria;
        _product.ativa = product.ativa;

        await this.productRepository.update(_product);
        
    }

    async delete(id: string): Promise<void> {
        await this.productRepository.delete(id);
    }

    private async getGategoriaById(id: String) {
        const categoria = await this.categoryRepository.getById(`${id}`)

        if(!categoria){
            throw new NotFoundError("Categoria não encontrada!");
        }

        return categoria;
    }

    

}