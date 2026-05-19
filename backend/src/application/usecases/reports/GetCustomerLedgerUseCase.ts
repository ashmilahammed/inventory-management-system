import { ILedgerRepository } from "../../../domain/repositories/ILedgerRepository";
import { LedgerTransaction } from "../../../domain/entities/LedgerTransaction";
import { IGetCustomerLedgerUseCase } from "../../interfaces/report/IGetCustomerLedgerUseCase";

export class GetCustomerLedgerUseCase implements IGetCustomerLedgerUseCase {
  constructor(
    private readonly _ledgerRepository: ILedgerRepository
  ) {}

  async execute(customerId: string): Promise<LedgerTransaction[]> {
    return this._ledgerRepository.findByCustomerId(customerId);
  }
}
