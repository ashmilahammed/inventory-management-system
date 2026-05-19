import { Customer } from "../../../domain/entities/Customer";

export interface IGetCustomersUseCase {
  execute(): Promise<Customer[]>;
}
