import { IItemRepository } from "../../domain/repositories/IItemRepository";
import { Item } from "../../domain/entities/Item";
import { ItemModel, IItemDocument } from "../database/models/itemModel";

export class ItemRepository implements IItemRepository {
  async create(item: Item): Promise<Item> {
    const createdItem = await ItemModel.create(item);
    return this.mapToEntity(createdItem);
  }

  async findById(id: string): Promise<Item | null> {
    const item = await ItemModel.findById(id);
    return item ? this.mapToEntity(item) : null;
  }

  async findAll(): Promise<Item[]> {
    const items = await ItemModel.find().sort({ createdAt: -1 });
    return items.map((i) => this.mapToEntity(i));
  }

  async update(id: string, itemData: Partial<Item>): Promise<Item | null> {
    const updated = await ItemModel.findByIdAndUpdate(id, itemData, { new: true });
    return updated ? this.mapToEntity(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ItemModel.findByIdAndDelete(id);
    return !!result;
  }

  async search(query: string): Promise<Item[]> {
    const items = await ItemModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    }).sort({ createdAt: -1 });
    return items.map((i) => this.mapToEntity(i));
  }

  private mapToEntity(item: IItemDocument): Item {
    return {
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  }
}
