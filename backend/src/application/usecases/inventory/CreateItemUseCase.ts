import { IItemRepository } from "../../../domain/repositories/IItemRepository";
import { Item } from "../../../domain/entities/Item";
import { ICreateItemUseCase } from "../../interfaces/inventory/ICreateItemUseCase";

export class CreateItemUseCase implements ICreateItemUseCase {
  constructor(
    private readonly _itemRepository: IItemRepository
  ) {}

  async execute(itemData: Omit<Item, "id" | "createdAt" | "updatedAt">): Promise<Item> {
    return this._itemRepository.create(itemData);
  }
}
