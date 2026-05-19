import { ISaleRepository } from "../../../domain/repositories/ISaleRepository";
import { Sale } from "../../../domain/entities/Sale";

export class GetSalesReportUseCase {
  constructor(
    private readonly _saleRepository: ISaleRepository
  ) {}

  async execute(): Promise<Sale[]> {
    // Ideally this would have date filters
    return this._saleRepository.findAll();
  }
}
