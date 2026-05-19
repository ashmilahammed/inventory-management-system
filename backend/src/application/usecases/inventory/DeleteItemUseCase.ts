import { IItemRepository } from "../../../domain/repositories/IItemRepository";

export class DeleteItemUseCase {
  constructor(
    private readonly _itemRepository: IItemRepository
  ) {}

  async execute(id: string): Promise<boolean> {
    return this._itemRepository.delete(id);
  }
}
