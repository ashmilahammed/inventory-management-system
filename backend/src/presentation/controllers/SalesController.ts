import { Request, Response } from "express";
import { RecordSaleUseCase } from "../../application/usecases/sales/RecordSaleUseCase";

export class SalesController {
  constructor(
    private readonly _recordSaleUseCase: RecordSaleUseCase
  ) {}

  async recordSale(req: Request, res: Response): Promise<void> {
    try {
      const sale = await this._recordSaleUseCase.execute(req.body);
      res.status(201).json({ success: true, data: sale });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
