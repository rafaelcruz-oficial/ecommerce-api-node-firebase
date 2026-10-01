import { Category } from "../models/category.model.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { CategoryRepository } from "../repositories/category.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { ValidationError } from "../errors/validation.error.js";


export class CategoryService {

    private categoryRepository: CategoryRepository;
    private productRepository: ProductRepository;

    constructor() {
        this.categoryRepository =  new CategoryRepository();
        this.productRepository = new ProductRepository();
    }

    async getALL(): Promise<Category[]> {
        return this.categoryRepository.getALL();
    }

    async getById(id: string): Promise<Category> {
        const category = await this.categoryRepository.getById(id)
        if(!category) {
            throw new NotFoundError("Categoria não encontrado!");
        }   
        return category
    }

    async save(category: Category): Promise<void> {
      await this.categoryRepository.update(category);    
    }

    async update(id: string, category: Category): Promise<void> {

        const _category = await this.getById(id);
        if (!_category) {
            throw new NotFoundError("Categoria não encontrado!");
        }

        _category.descricao = category.descricao;
        _category.ativa = category.ativa;

        await this.categoryRepository.update(_category);
        
    }

    async delete(id: string): Promise<void> {
        if ( await this.productRepository.getCountByCategoria(id) > 0) {
            throw new  ValidationError("Não é possível exluir uma categoria com produtos relacionados!");
        }
        await this.categoryRepository.delete(id);
    }

}