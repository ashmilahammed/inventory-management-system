import { Sale } from "../../../domain/entities/Sale";

export interface IGetSalesReportUseCase {
  execute(): Promise<Sale[]>;
}
