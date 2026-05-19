import { Request, Response } from "express";
import { IGetSalesReportUseCase } from "../../application/interfaces/report/IGetSalesReportUseCase";
import { IGetItemsReportUseCase } from "../../application/interfaces/report/IGetItemsReportUseCase";
import { IGetCustomerLedgerUseCase } from "../../application/interfaces/report/IGetCustomerLedgerUseCase";
import { IGenerateExportUseCase } from "../../application/interfaces/exports/IGenerateExportUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { Messages } from "../../shared/constants/messages";
import { ApiResponse } from "../../shared/common/ApiResponse";

export class ReportController {
  constructor(
    private readonly _getSalesReportUseCase: IGetSalesReportUseCase,
    private readonly _getItemsReportUseCase: IGetItemsReportUseCase,
    private readonly _getCustomerLedgerUseCase: IGetCustomerLedgerUseCase,
    private readonly _generateExportUseCase: IGenerateExportUseCase
  ) {}

  async getSalesReport(req: Request, res: Response): Promise<void> {
    try {
      const sales = await this._getSalesReportUseCase.execute();
      res.status(HttpStatus.OK).json(
        ApiResponse.success(Messages.SUCCESS, sales)
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
    }
  }

  async getItemsReport(req: Request, res: Response): Promise<void> {
    try {
      const items = await this._getItemsReportUseCase.execute();
      res.status(HttpStatus.OK).json(
        ApiResponse.success(Messages.SUCCESS, items)
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
    }
  }

  async getCustomerLedger(req: Request, res: Response): Promise<void> {
    try {
      const ledger = await this._getCustomerLedgerUseCase.execute(req.params.customerId as string);
      res.status(HttpStatus.OK).json(
        ApiResponse.success(Messages.SUCCESS, ledger)
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
    }
  }

  async exportSalesReport(req: Request, res: Response): Promise<void> {
    try {
      const format = req.query.format as string; // 'pdf' or 'excel'
      const sales = await this._getSalesReportUseCase.execute();
      
      if (format === 'excel') {
        const columns = [
          { header: 'ID', key: 'id' },
          { header: 'Item ID', key: 'itemId' },
          { header: 'Quantity', key: 'quantity' },
          { header: 'Customer ID', key: 'customerId' },
          { header: 'Cash', key: 'isCash' },
          { header: 'Total Amount', key: 'totalAmount' },
          { header: 'Date', key: 'date' }
        ];
        const buffer = await this._generateExportUseCase.generateExcel(columns, sales);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=sales_report.xlsx');
        res.status(HttpStatus.OK).send(buffer);
      } else {
        const columns = [
          { header: 'ID', width: 140 },
          { header: 'Item ID', width: 140 },
          { header: 'Qty', width: 40 },
          { header: 'Amount', width: 60 },
          { header: 'Date', width: 120 }
        ];
        const data = sales.map(s => [
          s.id?.toString() || '',
          s.itemId,
          s.quantity.toString(),
          s.totalAmount.toString(),
          new Date(s.date).toLocaleDateString()
        ]);
        const buffer = await this._generateExportUseCase.generatePdf('Sales Report', columns, data);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=sales_report.pdf');
        res.status(HttpStatus.OK).send(buffer);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse.error(message));
    }
  }
}
