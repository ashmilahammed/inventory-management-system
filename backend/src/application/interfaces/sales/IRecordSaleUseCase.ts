import { Sale } from "../../../domain/entities/Sale";

export interface IRecordSaleUseCase {
  execute(saleData: {
    itemId: string;
    quantity: number;
    customerId?: string;
    isCash: boolean;
  }): Promise<Sale>;
}
