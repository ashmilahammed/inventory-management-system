import { IEmailReportUseCase, IEmailReportRequest, IEmailReportResponse } from "../../interfaces/report/IEmailReportUseCase";
import { IEmailService } from "../../interfaces/services/IEmailService";
import { IGetSalesReportUseCase } from "../../interfaces/report/IGetSalesReportUseCase";
import { IGetItemsReportUseCase } from "../../interfaces/report/IGetItemsReportUseCase";
import { IGetCustomerLedgerUseCase } from "../../interfaces/report/IGetCustomerLedgerUseCase";
import { IGenerateExportUseCase } from "../../interfaces/exports/IGenerateExportUseCase";
import { ICustomerRepository } from "../../../domain/repositories/ICustomerRepository";

export class EmailReportUseCase implements IEmailReportUseCase {
  constructor(
    private readonly _emailService: IEmailService,
    private readonly _getSalesReportUseCase: IGetSalesReportUseCase,
    private readonly _getItemsReportUseCase: IGetItemsReportUseCase,
    private readonly _getCustomerLedgerUseCase: IGetCustomerLedgerUseCase,
    private readonly _generateExportUseCase: IGenerateExportUseCase,
    private readonly _customerRepository: ICustomerRepository
  ) {}

  async execute(request: IEmailReportRequest): Promise<IEmailReportResponse> {
    const { email, subject, body, reportType, format, customerId } = request;

    let buffer: Buffer;
    let filename: string;

    if (reportType === 'sales') {
      const sales = await this._getSalesReportUseCase.execute();
      filename = `sales_report.${format === 'excel' ? 'xlsx' : 'pdf'}`;

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
        buffer = await this._generateExportUseCase.generateExcel(columns, sales);
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
        buffer = await this._generateExportUseCase.generatePdf('Sales Report', columns, data);
      }
    } else if (reportType === 'items') {
      const items = await this._getItemsReportUseCase.execute();
      filename = `items_report.${format === 'excel' ? 'xlsx' : 'pdf'}`;

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
        buffer = await this._generateExportUseCase.generateExcel(columns, data);
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
        buffer = await this._generateExportUseCase.generatePdf('Items Inventory Report', columns, data);
      }
    } else if (reportType === 'ledger') {
      if (!customerId) {
        throw new Error("Customer ID is required for Customer Ledger statement");
      }

      let customerName = 'Customer';
      const customer = await this._customerRepository.findById(customerId);
      if (customer) {
        customerName = customer.name;
      }

      const ledger = await this._getCustomerLedgerUseCase.execute(customerId);
      filename = `${customerName.toLowerCase().replace(/\s+/g, '_')}_ledger.${format === 'excel' ? 'xlsx' : 'pdf'}`;

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
        buffer = await this._generateExportUseCase.generateExcel(columns, data);
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
        buffer = await this._generateExportUseCase.generatePdf(`Customer Ledger: ${customerName}`, columns, data);
      }
    } else {
      throw new Error(`Invalid report type: ${reportType}`);
    }

    const result = await this._emailService.sendEmailWithAttachment(
      email,
      subject,
      body,
      { filename, content: buffer }
    );

    return {
      success: true,
      message: "Report emailed successfully",
      previewUrl: result.previewUrl
    };
  }
}
