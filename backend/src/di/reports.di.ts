import { SaleRepository } from "../infrastructure/repositories/SaleRepository";
import { ItemRepository } from "../infrastructure/repositories/ItemRepository";
import { LedgerRepository } from "../infrastructure/repositories/LedgerRepository";
import { ExportService } from "../infrastructure/services/ExportService";
import { CustomerRepository } from "../infrastructure/repositories/CustomerRepository";
import { EmailService } from "../infrastructure/services/EmailService";

import { GetSalesReportUseCase } from "../application/usecases/reports/GetSalesReportUseCase";
import { GetItemsReportUseCase } from "../application/usecases/reports/GetItemsReportUseCase";
import { GetCustomerLedgerUseCase } from "../application/usecases/reports/GetCustomerLedgerUseCase";
import { GenerateExportUseCase } from "../application/usecases/exports/GenerateExportUseCase";
import { EmailReportUseCase } from "../application/usecases/reports/EmailReportUseCase";
import { ReportController } from "../presentation/controllers/ReportController";

const saleRepository = new SaleRepository();
const itemRepository = new ItemRepository();
const ledgerRepository = new LedgerRepository();
const exportService = new ExportService();
const customerRepository = new CustomerRepository();
export const emailService = new EmailService();

const getSalesReportUseCase = new GetSalesReportUseCase(saleRepository);
const getItemsReportUseCase = new GetItemsReportUseCase(itemRepository);
const getCustomerLedgerUseCase = new GetCustomerLedgerUseCase(ledgerRepository);
const generateExportUseCase = new GenerateExportUseCase(exportService);

export const reportController = new ReportController(
  getSalesReportUseCase,
  getItemsReportUseCase,
  getCustomerLedgerUseCase,
  generateExportUseCase,
  customerRepository,
  new EmailReportUseCase(
    emailService,
    getSalesReportUseCase,
    getItemsReportUseCase,
    getCustomerLedgerUseCase,
    generateExportUseCase,
    customerRepository
  )
);
