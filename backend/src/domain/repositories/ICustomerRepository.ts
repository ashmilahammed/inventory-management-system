import { Customer } from "../entities/Customer";

export interface ICustomerRepository {
  create(customer: Customer): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  update(id: string, customer: Partial<Customer>): Promise<Customer | null>;
  delete(id: string): Promise<boolean>;
}
