import { ISaleRepository } from "../../domain/repositories/ISaleRepository";
import { Sale } from "../../domain/entities/Sale";
import { SaleModel, ISaleDocument } from "../database/models/saleModel";

export class SaleRepository implements ISaleRepository {
  async create(sale: Omit<Sale, "id">): Promise<Sale> {
    const createdSale = await SaleModel.create(sale);
    return this.mapToEntity(createdSale);
  }

  async findById(id: string): Promise<Sale | null> {
    const sale = await SaleModel.findById(id);
    return sale ? this.mapToEntity(sale) : null;
  }

  async findAll(): Promise<Sale[]> {
    const sales = await SaleModel.find().sort({ date: -1, createdAt: -1 });
    return sales.map((s) => this.mapToEntity(s));
  }

  private mapToEntity(sale: ISaleDocument): Sale {
    return {
      id: sale._id.toString(),
      itemId: sale.itemId.toString(),
      quantity: sale.quantity,
      customerId: sale.customerId ? sale.customerId.toString() : undefined,
      isCash: sale.isCash,
      totalAmount: sale.totalAmount,
      date: sale.date,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt
    };
  }
}
