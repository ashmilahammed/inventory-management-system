import { ICustomerRepository } from "../../../domain/repositories/ICustomerRepository";
import { Customer } from "../../../domain/entities/Customer";

export class CreateCustomerUseCase {
  constructor(
    private readonly _customerRepository: ICustomerRepository
  ) {}

  async execute(customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">): Promise<Customer> {
    return this._customerRepository.create(customerData);
  }
}
