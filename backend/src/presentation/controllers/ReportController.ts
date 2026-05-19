import { Request, Response } from "express";
import { GetSalesReportUseCase } from "../../application/usecases/reports/GetSalesReportUseCase";
import { GetItemsReportUseCase } from "../../application/usecases/reports/GetItemsReportUseCase";
import { GetCustomerLedgerUseCase } from "../../application/usecases/reports/GetCustomerLedgerUseCase";
import { GenerateExportUseCase } from "../../application/usecases/exports/GenerateExportUseCase";

export class ReportController {
  constructor(
    private readonly _getSalesReportUseCase: GetSalesReportUseCase,
    private readonly _getItemsReportUseCase: GetItemsReportUseCase,
    private readonly _getCustomerLedgerUseCase: GetCustomerLedgerUseCase,
    private readonly _generateExportUseCase: GenerateExportUseCase
  ) {}

  async getSalesReport(req: Request, res: Response): Promise<void> {
    try {
      const sales = await this._getSalesReportUseCase.execute();
      res.status(200).json({ success: true, data: sales });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getItemsReport(req: Request, res: Response): Promise<void> {
    try {
      const items = await this._getItemsReportUseCase.execute();
      res.status(200).json({ success: true, data: items });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getCustomerLedger(req: Request, res: Response): Promise<void> {
    try {
      const ledger = await this._getCustomerLedgerUseCase.execute(req.params.customerId as string);
      res.status(200).json({ success: true, data: ledger });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
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
        res.send(buffer);
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
        res.send(buffer);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
