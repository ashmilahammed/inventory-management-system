import { IItemRepository } from "../../../domain/repositories/IItemRepository";
import { Item } from "../../../domain/entities/Item";

export class UpdateItemUseCase {
  constructor(
    private readonly _itemRepository: IItemRepository
  ) {}

  async execute(id: string, itemData: Partial<Item>): Promise<Item | null> {
    return this._itemRepository.update(id, itemData);
  }
}
