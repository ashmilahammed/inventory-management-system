import { ICustomerRepository } from "../../../domain/repositories/ICustomerRepository";

export class DeleteCustomerUseCase {
  constructor(
    private readonly _customerRepository: ICustomerRepository
  ) {}

  async execute(id: string): Promise<boolean> {
    return this._customerRepository.delete(id);
  }
}
