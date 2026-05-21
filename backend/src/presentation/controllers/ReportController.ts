import { Request, Response } from "express";
import { IGetSalesReportUseCase } from "../../application/interfaces/report/IGetSalesReportUseCase";
import { IGetItemsReportUseCase } from "../../application/interfaces/report/IGetItemsReportUseCase";
import { IGetCustomerLedgerUseCase } from "../../application/interfaces/report/IGetCustomerLedgerUseCase";
import { IGenerateExportUseCase } from "../../application/interfaces/exports/IGenerateExportUseCase";
import { IEmailReportUseCase } from "../../application/interfaces/report/IEmailReportUseCase";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { Messages } from "../../shared/constants/messages";
import { ApiResponse } from "../../shared/common/ApiResponse";

export class ReportController {
  constructor(
    private readonly _getSalesReportUseCase: IGetSalesReportUseCase,
    private readonly _getItemsReportUseCase: IGetItemsReportUseCase,
    private readonly _getCustomerLedgerUseCase: IGetCustomerLedgerUseCase,
    private readonly _generateExportUseCase: IGenerateExportUseCase,
    private readonly _customerRepository?: ICustomerRepository,
    private readonly _emailReportUseCase?: IEmailReportUseCase
  ) { }

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

  async exportItemsReport(req: Request, res: Response): Promise<void> {
    try {
      const format = req.query.format as string; // 'pdf' or 'excel'
      const items = await this._getItemsReportUseCase.execute();

      if (format === 'excel') {
        const columns = [
          { header: 'ID', key: 'id' },
          { header: 'Name', key: 'name' },
          { header: 'Description', key: 'description' },
          { header: 'Quantity', key: 'quantity' },
          { header: 'Price', key: 'price' },
          { header: 'Total Value', key: 'totalValue' }
        ];
        const data = items.map(item => ({
          id: item.id?.toString() || '',
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          totalValue: item.quantity * item.price
        }));
        const buffer = await this._generateExportUseCase.generateExcel(columns, data);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=items_report.xlsx');
        res.status(HttpStatus.OK).send(buffer);
      } else {
        const columns = [
          { header: 'ID', width: 140 },
          { header: 'Name', width: 120 },
          { header: 'Qty', width: 45 },
          { header: 'Price', width: 65 },
          { header: 'Total Value', width: 85 }
        ];
        const data = items.map(item => [
          item.id?.toString() || '',
          item.name,
          item.quantity.toString(),
          item.price.toString(),
          (item.quantity * item.price).toString()
        ]);
        const buffer = await this._generateExportUseCase.generatePdf('Items Inventory Report', columns, data);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=items_report.pdf');
        res.status(HttpStatus.OK).send(buffer);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse.error(message));
    }
  }

  async exportCustomerLedger(req: Request, res: Response): Promise<void> {
    try {
      const customerId = req.params.customerId as string;
      const format = req.query.format as string; // 'pdf' or 'excel'

      if (!customerId) {
        res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error('Customer ID is required'));
        return;
      }

      let customerName = 'Customer';
      if (this._customerRepository) {
        const customer = await this._customerRepository.findById(customerId);
        if (customer) {
          customerName = customer.name;
        }
      }

      const ledger = await this._getCustomerLedgerUseCase.execute(customerId);

      // Compute running balance
      const reversed = [...ledger].reverse();
      let balance = 0;
      const chronologicalBalances = reversed.map((tx) => {
        if (tx.type === 'debit') {
          balance += tx.amount;
        } else {
          balance -= tx.amount;
        }
        return balance;
      });
      const descendingBalances = chronologicalBalances.reverse();
      const ledgerWithBalances = ledger.map((tx, idx) => ({
        ...tx,
        runningBalance: descendingBalances[idx]
      }));

      if (format === 'excel') {
        const columns = [
          { header: 'Date', key: 'date' },
          { header: 'Transaction ID', key: 'id' },
          { header: 'Type', key: 'type' },
          { header: 'Description', key: 'description' },
          { header: 'Amount', key: 'amount' },
          { header: 'Running Balance', key: 'runningBalance' }
        ];
        const data = ledgerWithBalances.map(tx => ({
          date: new Date(tx.date).toLocaleDateString(),
          id: tx.referenceId || tx.id || '',
          type: tx.type.toUpperCase(),
          description: tx.description,
          amount: (tx.type === 'credit' ? '-' : '+') + tx.amount.toFixed(2),
          runningBalance: tx.runningBalance
        }));
        const buffer = await this._generateExportUseCase.generateExcel(columns, data);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${customerName.toLowerCase().replace(/\s+/g, '_')}_ledger.xlsx`);
        res.status(HttpStatus.OK).send(buffer);
      } else {
        const columns = [
          { header: 'Date', width: 90 },
          { header: 'Ref ID', width: 110 },
          { header: 'Type', width: 60 },
          { header: 'Description', width: 130 },
          { header: 'Amount', width: 65 },
          { header: 'Balance', width: 65 }
        ];
        const data = ledgerWithBalances.map(tx => [
          new Date(tx.date).toLocaleDateString(),
          tx.referenceId || tx.id || '',
          tx.type.toUpperCase(),
          tx.description,
          (tx.type === 'credit' ? '-' : '+') + tx.amount.toFixed(2),
          tx.runningBalance.toFixed(2)
        ]);
        const buffer = await this._generateExportUseCase.generatePdf(`Customer Ledger: ${customerName}`, columns, data);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${customerName.toLowerCase().replace(/\s+/g, '_')}_ledger.pdf`);
        res.status(HttpStatus.OK).send(buffer);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse.error(message));
    }
  }

  async emailReport(req: Request, res: Response): Promise<void> {
    try {
      const { email, subject, body, reportType, format, customerId } = req.body;

      if (!email || !subject || !body || !reportType || !format) {
        res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error('Email, subject, body, reportType, and format are required.'));
        return;
      }

      if (!this._emailReportUseCase) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse.error('Email report use case is not configured.'));
        return;
      }

      const result = await this._emailReportUseCase.execute({
        email,
        subject,
        body,
        reportType,
        format,
        customerId
      });

      res.status(HttpStatus.OK).json(ApiResponse.success(result.message, { previewUrl: result.previewUrl }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse.error(message));
    }
  }
}
