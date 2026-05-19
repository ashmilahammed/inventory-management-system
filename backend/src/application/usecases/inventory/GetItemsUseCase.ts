import { IItemRepository } from "../../../domain/repositories/IItemRepository";
import { Item } from "../../../domain/entities/Item";
import { IGetItemsUseCase } from "../../interfaces/inventory/IGetItemsUseCase";

export class GetItemsUseCase implements IGetItemsUseCase {
  constructor(
    private readonly _itemRepository: IItemRepository
  ) {}

  async execute(): Promise<Item[]> {
    return this._itemRepository.findAll();
  }
}
