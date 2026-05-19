import { Customer } from "../../../domain/entities/Customer";

export interface IUpdateCustomerUseCase {
  execute(id: string, customerData: Partial<Customer>): Promise<Customer | null>;
}
