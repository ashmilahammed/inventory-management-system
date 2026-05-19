import { Item } from "../../../domain/entities/Item";

export interface IGetItemsUseCase {
  execute(): Promise<Item[]>;
}
