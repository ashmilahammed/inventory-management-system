import { Item } from "../../../domain/entities/Item";

export interface ISearchItemsUseCase {
  execute(query: string): Promise<Item[]>;
}
