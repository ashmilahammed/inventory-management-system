import { CustomerRepository } from "../infrastructure/repositories/CustomerRepository";
import { CreateCustomerUseCase } from "../application/usecases/customer/CreateCustomerUseCase";
import { GetCustomersUseCase } from "../application/usecases/customer/GetCustomersUseCase";
import { UpdateCustomerUseCase } from "../application/usecases/customer/UpdateCustomerUseCase";
import { DeleteCustomerUseCase } from "../application/usecases/customer/DeleteCustomerUseCase";
import { CustomerController } from "../presentation/controllers/CustomerController";

const customerRepository = new CustomerRepository();

export const customerController = new CustomerController(
  new CreateCustomerUseCase(customerRepository),
  new GetCustomersUseCase(customerRepository),
  new UpdateCustomerUseCase(customerRepository),
  new DeleteCustomerUseCase(customerRepository)
);
