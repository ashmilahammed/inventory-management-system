import { Request, Response } from "express";
import { ICreateCustomerUseCase } from "../../application/interfaces/customer/ICreateCustomerUseCase";
import { IGetCustomersUseCase } from "../../application/interfaces/customer/IGetCustomersUseCase";
import { IUpdateCustomerUseCase } from "../../application/interfaces/customer/IUpdateCustomerUseCase";
import { IDeleteCustomerUseCase } from "../../application/interfaces/customer/IDeleteCustomerUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { Messages } from "../../shared/constants/messages";
import { ApiResponse } from "../../shared/common/ApiResponse";

export class CustomerController {
  constructor(
    private readonly _createCustomerUseCase: ICreateCustomerUseCase,
    private readonly _getCustomersUseCase: IGetCustomersUseCase,
    private readonly _updateCustomerUseCase: IUpdateCustomerUseCase,
    private readonly _deleteCustomerUseCase: IDeleteCustomerUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const customer = await this._createCustomerUseCase.execute(req.body);
      res.status(HttpStatus.CREATED).json(
        ApiResponse.success(Messages.CUSTOMER_CREATED, customer)
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const customers = await this._getCustomersUseCase.execute();
      res.status(HttpStatus.OK).json(
        ApiResponse.success(Messages.SUCCESS, customers)
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const customer = await this._updateCustomerUseCase.execute(req.params.id as string, req.body);
      res.status(HttpStatus.OK).json(
        ApiResponse.success(Messages.CUSTOMER_UPDATED, customer)
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this._deleteCustomerUseCase.execute(req.params.id as string);
      res.status(HttpStatus.OK).json(
        ApiResponse.success(Messages.CUSTOMER_DELETED)
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
    }
  }
}
