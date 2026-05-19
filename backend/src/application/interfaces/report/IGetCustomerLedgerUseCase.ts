import { LedgerTransaction } from "../../../domain/entities/LedgerTransaction";

export interface IGetCustomerLedgerUseCase {
  execute(customerId: string): Promise<LedgerTransaction[]>;
}
