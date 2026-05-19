import { Request, Response } from "express";
import { CreateItemUseCase } from "../../application/usecases/inventory/CreateItemUseCase";
import { GetItemsUseCase } from "../../application/usecases/inventory/GetItemsUseCase";
import { UpdateItemUseCase } from "../../application/usecases/inventory/UpdateItemUseCase";
import { DeleteItemUseCase } from "../../application/usecases/inventory/DeleteItemUseCase";
import { SearchItemsUseCase } from "../../application/usecases/inventory/SearchItemsUseCase";

export class InventoryController {
  constructor(
    private readonly _createItemUseCase: CreateItemUseCase,
    private readonly _getItemsUseCase: GetItemsUseCase,
    private readonly _updateItemUseCase: UpdateItemUseCase,
    private readonly _deleteItemUseCase: DeleteItemUseCase,
    private readonly _searchItemsUseCase: SearchItemsUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const item = await this._createItemUseCase.execute(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;
      const items = query 
        ? await this._searchItemsUseCase.execute(query)
        : await this._getItemsUseCase.execute();
      res.status(200).json({ success: true, data: items });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const item = await this._updateItemUseCase.execute(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this._deleteItemUseCase.execute(req.params.id as string);
      res.status(200).json({ success: true, message: "Item deleted" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
