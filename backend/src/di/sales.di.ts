import { SaleRepository } from "../infrastructure/repositories/SaleRepository";
import { ItemRepository } from "../infrastructure/repositories/ItemRepository";
import { LedgerRepository } from "../infrastructure/repositories/LedgerRepository";
import { RecordSaleUseCase } from "../application/usecases/sales/RecordSaleUseCase";
import { SalesController } from "../presentation/controllers/SalesController";

const saleRepository = new SaleRepository();
const itemRepository = new ItemRepository();
const ledgerRepository = new LedgerRepository();

export const salesController = new SalesController(
  new RecordSaleUseCase(saleRepository, itemRepository, ledgerRepository)
);
