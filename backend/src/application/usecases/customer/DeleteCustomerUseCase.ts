import { ICustomerRepository } from "../../../domain/repositories/ICustomerRepository";
import { IDeleteCustomerUseCase } from "../../interfaces/customer/IDeleteCustomerUseCase";

export class DeleteCustomerUseCase implements IDeleteCustomerUseCase {
  constructor(
    private readonly _customerRepository: ICustomerRepository
  ) {}

  async execute(id: string): Promise<boolean> {
    return this._customerRepository.delete(id);
  }
}
