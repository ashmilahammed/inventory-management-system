import { Sale } from "../entities/Sale";

export interface ISaleRepository {
  create(sale: Omit<Sale, "id">): Promise<Sale>;
  findById(id: string): Promise<Sale | null>;
  findAll(): Promise<Sale[]>;
}
