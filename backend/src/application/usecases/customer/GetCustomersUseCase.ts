import { ICustomerRepository } from "../../../domain/repositories/ICustomerRepository";
import { Customer } from "../../../domain/entities/Customer";

export class GetCustomersUseCase {
  constructor(
    private readonly _customerRepository: ICustomerRepository
  ) {}

  async execute(): Promise<Customer[]> {
    return this._customerRepository.findAll();
  }
}
