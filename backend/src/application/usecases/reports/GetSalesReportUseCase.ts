import { ISaleRepository } from "../../../domain/repositories/ISaleRepository";
import { Sale } from "../../../domain/entities/Sale";
import { IGetSalesReportUseCase } from "../../interfaces/report/IGetSalesReportUseCase";

export class GetSalesReportUseCase implements IGetSalesReportUseCase {
  constructor(
    private readonly _saleRepository: ISaleRepository
  ) {}

  async execute(): Promise<Sale[]> {
    return this._saleRepository.findAll();
  }
}
