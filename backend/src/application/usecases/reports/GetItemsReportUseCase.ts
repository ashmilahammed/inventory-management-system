import { IItemRepository } from "../../../domain/repositories/IItemRepository";
import { Item } from "../../../domain/entities/Item";
import { IGetItemsReportUseCase } from "../../interfaces/report/IGetItemsReportUseCase";

export class GetItemsReportUseCase implements IGetItemsReportUseCase {
  constructor(
    private readonly _itemRepository: IItemRepository
  ) {}

  async execute(): Promise<Item[]> {
    return this._itemRepository.findAll();
  }
}
