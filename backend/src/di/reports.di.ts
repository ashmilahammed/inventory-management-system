import { SaleRepository } from "../infrastructure/repositories/SaleRepository";
import { ItemRepository } from "../infrastructure/repositories/ItemRepository";
import { LedgerRepository } from "../infrastructure/repositories/LedgerRepository";
import { ExportService } from "../infrastructure/services/ExportService";

import { GetSalesReportUseCase } from "../application/usecases/reports/GetSalesReportUseCase";
import { GetItemsReportUseCase } from "../application/usecases/reports/GetItemsReportUseCase";
import { GetCustomerLedgerUseCase } from "../application/usecases/reports/GetCustomerLedgerUseCase";
import { GenerateExportUseCase } from "../application/usecases/exports/GenerateExportUseCase";
import { ReportController } from "../presentation/controllers/ReportController";

const saleRepository = new SaleRepository();
const itemRepository = new ItemRepository();
const ledgerRepository = new LedgerRepository();
const exportService = new ExportService();

export const reportController = new ReportController(
  new GetSalesReportUseCase(saleRepository),
  new GetItemsReportUseCase(itemRepository),
  new GetCustomerLedgerUseCase(ledgerRepository),
  new GenerateExportUseCase(exportService)
);
