import { Customer } from "../../../domain/entities/Customer";

export interface ICreateCustomerUseCase {
  execute(customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">): Promise<Customer>;
}
