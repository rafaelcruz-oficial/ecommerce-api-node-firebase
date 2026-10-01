import { PaymentMethod } from "../models/payment-method.model.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { PaymentMethodRepository } from "../repositories/payment-method.repository.js";


export class PaymentMethodService {

    private paymentMethodRepository: PaymentMethodRepository;

    constructor() {
        this.paymentMethodRepository =  new PaymentMethodRepository();
    }

    async getALL(): Promise<PaymentMethod[]> {
        return this.paymentMethodRepository.getALL();
    }

    async getById(id: string): Promise<PaymentMethod> {
        const paymentMethod = await this.paymentMethodRepository.getById(id)
        if(!paymentMethod) {
            throw new NotFoundError("Forma de pagamento não encontrada!");
        }   
        return paymentMethod
    }

    async save(paymentMethod: PaymentMethod): Promise<void> {
      await this.paymentMethodRepository.update(paymentMethod);    
    }

    async update(id: string, paymentMethod: PaymentMethod): Promise<void> {

        const _paymentMethod = await this.getById(id);
        if (!_paymentMethod) {
            throw new NotFoundError("Forma de pagamento não encontrada!");
        }

        _paymentMethod.descricao = paymentMethod.descricao;
        _paymentMethod.ativa = paymentMethod.ativa;

        await this.paymentMethodRepository.update(_paymentMethod);
        
    }

    async delete(id: string): Promise<void> {
        await this.paymentMethodRepository.delete(id);
    }

}