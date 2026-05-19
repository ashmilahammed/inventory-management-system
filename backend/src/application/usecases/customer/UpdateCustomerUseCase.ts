import { ICustomerRepository } from "../../../domain/repositories/ICustomerRepository";
import { Customer } from "../../../domain/entities/Customer";

export class UpdateCustomerUseCase {
  constructor(
    private readonly _customerRepository: ICustomerRepository
  ) {}

  async execute(id: string, customerData: Partial<Customer>): Promise<Customer | null> {
    return this._customerRepository.update(id, customerData);
  }
}
