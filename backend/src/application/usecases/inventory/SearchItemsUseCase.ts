import { IItemRepository } from "../../../domain/repositories/IItemRepository";
import { Item } from "../../../domain/entities/Item";

export class SearchItemsUseCase {
  constructor(
    private readonly _itemRepository: IItemRepository
  ) {}

  async execute(query: string): Promise<Item[]> {
    return this._itemRepository.search(query);
  }
}
