import { ILedgerRepository } from "../../domain/repositories/ILedgerRepository";
import { LedgerTransaction } from "../../domain/entities/LedgerTransaction";
import { LedgerModel, ILedgerDocument } from "../database/models/ledgerModel";

export class LedgerRepository implements ILedgerRepository {
  async create(transaction: Omit<LedgerTransaction, "id">): Promise<LedgerTransaction> {
    const created = await LedgerModel.create(transaction);
    return this.mapToEntity(created);
  }

  async findByCustomerId(customerId: string): Promise<LedgerTransaction[]> {
    const transactions = await LedgerModel.find({ customerId }).sort({ date: -1, createdAt: -1 });
    return transactions.map((t) => this.mapToEntity(t));
  }

  private mapToEntity(doc: ILedgerDocument): LedgerTransaction {
    return {
      id: doc._id.toString(),
      customerId: doc.customerId.toString(),
      type: doc.type,
      amount: doc.amount,
      referenceId: doc.referenceId,
      description: doc.description,
      date: doc.date,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}
