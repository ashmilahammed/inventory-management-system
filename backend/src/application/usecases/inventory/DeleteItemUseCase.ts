import { IItemRepository } from "../../../domain/repositories/IItemRepository";
import { IDeleteItemUseCase } from "../../interfaces/inventory/IDeleteItemUseCase";

export class DeleteItemUseCase implements IDeleteItemUseCase {
  constructor(
    private readonly _itemRepository: IItemRepository
  ) {}

  async execute(id: string): Promise<boolean> {
    return this._itemRepository.delete(id);
  }
}
