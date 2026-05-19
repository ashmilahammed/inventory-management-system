import { IItemRepository } from "../../../domain/repositories/IItemRepository";
import { Item } from "../../../domain/entities/Item";
import { ISearchItemsUseCase } from "../../interfaces/inventory/ISearchItemsUseCase";

export class SearchItemsUseCase implements ISearchItemsUseCase {
  constructor(
    private readonly _itemRepository: IItemRepository
  ) {}

  async execute(query: string): Promise<Item[]> {
    return this._itemRepository.search(query);
  }
}
