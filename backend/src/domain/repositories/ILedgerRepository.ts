import { LedgerTransaction } from "../entities/LedgerTransaction";

export interface ILedgerRepository {
  create(transaction: Omit<LedgerTransaction, "id">): Promise<LedgerTransaction>;
  findByCustomerId(customerId: string): Promise<LedgerTransaction[]>;
}
