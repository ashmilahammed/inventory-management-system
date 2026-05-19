import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { Customer } from "../../domain/entities/Customer";
import { CustomerModel, ICustomerDocument } from "../database/models/customerModel";

export class CustomerRepository implements ICustomerRepository {
  async create(customer: Customer): Promise<Customer> {
    const createdCustomer = await CustomerModel.create(customer);
    return this.mapToEntity(createdCustomer);
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await CustomerModel.findById(id);
    return customer ? this.mapToEntity(customer) : null;
  }

  async findAll(): Promise<Customer[]> {
    const customers = await CustomerModel.find().sort({ createdAt: -1 });
    return customers.map((c) => this.mapToEntity(c));
  }

  async update(id: string, data: Partial<Customer>): Promise<Customer | null> {
    const updated = await CustomerModel.findByIdAndUpdate(id, data, { new: true });
    return updated ? this.mapToEntity(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await CustomerModel.findByIdAndDelete(id);
    return !!result;
  }

  private mapToEntity(customer: ICustomerDocument): Customer {
    return {
      id: customer._id.toString(),
      name: customer.name,
      address: customer.address,
      mobileNumber: customer.mobileNumber,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    };
  }
}
