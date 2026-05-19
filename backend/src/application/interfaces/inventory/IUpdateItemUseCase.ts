import { Item } from "../../../domain/entities/Item";

export interface IUpdateItemUseCase {
  execute(id: string, itemData: Partial<Item>): Promise<Item | null>;
}
