import { IItemRepository } from "../../../domain/repositories/IItemRepository";
import { Item } from "../../../domain/entities/Item";

export class GetItemsReportUseCase {
  constructor(
    private readonly _itemRepository: IItemRepository
  ) {}

  async execute(): Promise<Item[]> {
    return this._itemRepository.findAll();
  }
}
