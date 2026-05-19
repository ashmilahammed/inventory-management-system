import { ICustomerRepository } from "../../../domain/repositories/ICustomerRepository";
import { Customer } from "../../../domain/entities/Customer";
import { IUpdateCustomerUseCase } from "../../interfaces/customer/IUpdateCustomerUseCase";

export class UpdateCustomerUseCase implements IUpdateCustomerUseCase {
  constructor(
    private readonly _customerRepository: ICustomerRepository
  ) {}

  async execute(id: string, customerData: Partial<Customer>): Promise<Customer | null> {
    return this._customerRepository.update(id, customerData);
  }
}
