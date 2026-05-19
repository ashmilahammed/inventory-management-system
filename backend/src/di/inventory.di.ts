import { ItemRepository } from "../infrastructure/repositories/ItemRepository";
import { CreateItemUseCase } from "../application/usecases/inventory/CreateItemUseCase";
import { GetItemsUseCase } from "../application/usecases/inventory/GetItemsUseCase";
import { UpdateItemUseCase } from "../application/usecases/inventory/UpdateItemUseCase";
import { DeleteItemUseCase } from "../application/usecases/inventory/DeleteItemUseCase";
import { SearchItemsUseCase } from "../application/usecases/inventory/SearchItemsUseCase";
import { InventoryController } from "../presentation/controllers/InventoryController";

const itemRepository = new ItemRepository();

export const inventoryController = new InventoryController(
  new CreateItemUseCase(itemRepository),
  new GetItemsUseCase(itemRepository),
  new UpdateItemUseCase(itemRepository),
  new DeleteItemUseCase(itemRepository),
  new SearchItemsUseCase(itemRepository)
);
