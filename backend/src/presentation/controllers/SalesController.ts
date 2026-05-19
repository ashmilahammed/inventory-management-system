import { Request, Response } from "express";
import { RecordSaleUseCase } from "../../application/usecases/sales/RecordSaleUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { Messages } from "../../shared/constants/messages";
import { ApiResponse } from "../../shared/common/ApiResponse";

export class SalesController {
  constructor(
    private readonly _recordSaleUseCase: RecordSaleUseCase
  ) {}

  async recordSale(req: Request, res: Response): Promise<void> {
    try {
      const sale = await this._recordSaleUseCase.execute(req.body);
      res.status(HttpStatus.CREATED).json(
        ApiResponse.success(Messages.SALE_RECORDED, sale)
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
    }
  }
}
