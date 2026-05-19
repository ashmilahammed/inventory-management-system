import { ICustomerRepository } from "../../../domain/repositories/ICustomerRepository";
import { Customer } from "../../../domain/entities/Customer";
import { ICreateCustomerUseCase } from "../../interfaces/customer/ICreateCustomerUseCase";

export class CreateCustomerUseCase implements ICreateCustomerUseCase {
  constructor(
    private readonly _customerRepository: ICustomerRepository
  ) {}

  async execute(customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">): Promise<Customer> {
    return this._customerRepository.create(customerData);
  }
}
