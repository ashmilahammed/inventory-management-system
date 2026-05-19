import { ILedgerRepository } from "../../../domain/repositories/ILedgerRepository";
import { LedgerTransaction } from "../../../domain/entities/LedgerTransaction";

export class GetCustomerLedgerUseCase {
  constructor(
    private readonly _ledgerRepository: ILedgerRepository
  ) {}

  async execute(customerId: string): Promise<LedgerTransaction[]> {
    return this._ledgerRepository.findByCustomerId(customerId);
  }
}
