import { ISaleRepository } from "../../../domain/repositories/ISaleRepository";
import { IItemRepository } from "../../../domain/repositories/IItemRepository";
import { ILedgerRepository } from "../../../domain/repositories/ILedgerRepository";
import { Sale } from "../../../domain/entities/Sale";
import { IRecordSaleUseCase } from "../../interfaces/sales/IRecordSaleUseCase";

export class RecordSaleUseCase implements IRecordSaleUseCase {
  constructor(
    private readonly _saleRepository: ISaleRepository,
    private readonly _itemRepository: IItemRepository,
    private readonly _ledgerRepository: ILedgerRepository
  ) {}

  async execute(saleData: {
    itemId: string;
    quantity: number;
    customerId?: string;
    isCash: boolean;
  }): Promise<Sale> {
    if (!saleData.quantity || saleData.quantity <= 0) {
      throw new Error("Sale quantity must be strictly greater than zero.");
    }

    const item = await this._itemRepository.findById(saleData.itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    if (item.quantity < saleData.quantity) {
      throw new Error("Insufficient quantity in inventory");
    }

    const totalAmount = item.price * saleData.quantity;

    // Deduct quantity
    await this._itemRepository.update(item.id as string, {
      quantity: item.quantity - saleData.quantity
    });

    // Record Sale
    const sale = await this._saleRepository.create({
      itemId: saleData.itemId,
      quantity: saleData.quantity,
      customerId: saleData.customerId,
      isCash: saleData.isCash,
      totalAmount,
      date: new Date()
    });

    // If customer is provided, record ledger transaction
    if (saleData.customerId) {
      await this._ledgerRepository.create({
        customerId: saleData.customerId,
        type: "debit",
        amount: totalAmount,
        referenceId: sale.id as string,
        description: `Sale of ${saleData.quantity}x ${item.name}`,
        date: new Date()
      });

      if (saleData.isCash) {
        await this._ledgerRepository.create({
          customerId: saleData.customerId,
          type: "credit",
          amount: totalAmount,
          referenceId: sale.id as string,
          description: `Cash payment for sale`,
          date: new Date()
        });
      }
    }

    return sale;
  }
}
