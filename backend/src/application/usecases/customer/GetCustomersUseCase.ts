import { ICustomerRepository } from "../../../domain/repositories/ICustomerRepository";
import { Customer } from "../../../domain/entities/Customer";
import { IGetCustomersUseCase } from "../../interfaces/customer/IGetCustomersUseCase";

export class GetCustomersUseCase implements IGetCustomersUseCase {
  constructor(
    private readonly _customerRepository: ICustomerRepository
  ) {}

  async execute(): Promise<Customer[]> {
    return this._customerRepository.findAll();
  }
}
