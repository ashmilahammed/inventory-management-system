import { Item } from "../../../domain/entities/Item";

export interface ICreateItemUseCase {
  execute(itemData: Omit<Item, "id" | "createdAt" | "updatedAt">): Promise<Item>;
}
