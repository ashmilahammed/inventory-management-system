import { Request, Response } from "express";
import { CreateCustomerUseCase } from "../../application/usecases/customer/CreateCustomerUseCase";
import { GetCustomersUseCase } from "../../application/usecases/customer/GetCustomersUseCase";
import { UpdateCustomerUseCase } from "../../application/usecases/customer/UpdateCustomerUseCase";
import { DeleteCustomerUseCase } from "../../application/usecases/customer/DeleteCustomerUseCase";

export class CustomerController {
  constructor(
    private readonly _createCustomerUseCase: CreateCustomerUseCase,
    private readonly _getCustomersUseCase: GetCustomersUseCase,
    private readonly _updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly _deleteCustomerUseCase: DeleteCustomerUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const customer = await this._createCustomerUseCase.execute(req.body);
      res.status(201).json({ success: true, data: customer });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const customers = await this._getCustomersUseCase.execute();
      res.status(200).json({ success: true, data: customers });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const customer = await this._updateCustomerUseCase.execute(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: customer });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this._deleteCustomerUseCase.execute(req.params.id as string);
      res.status(200).json({ success: true, message: "Customer deleted" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
