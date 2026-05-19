import { Request, Response } from "express";
import { ICreateItemUseCase } from "../../application/interfaces/inventory/ICreateItemUseCase";
import { IGetItemsUseCase } from "../../application/interfaces/inventory/IGetItemsUseCase";
import { IUpdateItemUseCase } from "../../application/interfaces/inventory/IUpdateItemUseCase";
import { IDeleteItemUseCase } from "../../application/interfaces/inventory/IDeleteItemUseCase";
import { ISearchItemsUseCase } from "../../application/interfaces/inventory/ISearchItemsUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { Messages } from "../../shared/constants/messages";
import { ApiResponse } from "../../shared/common/ApiResponse";

export class InventoryController {
  constructor(
    private readonly _createItemUseCase: ICreateItemUseCase,
    private readonly _getItemsUseCase: IGetItemsUseCase,
    private readonly _updateItemUseCase: IUpdateItemUseCase,
    private readonly _deleteItemUseCase: IDeleteItemUseCase,
    private readonly _searchItemsUseCase: ISearchItemsUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const item = await this._createItemUseCase.execute(req.body);
      res.status(HttpStatus.CREATED).json(
        ApiResponse.success(Messages.ITEM_CREATED, item)
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;
      const items = query 
        ? await this._searchItemsUseCase.execute(query)
        : await this._getItemsUseCase.execute();
      res.status(HttpStatus.OK).json(
        ApiResponse.success(Messages.SUCCESS, items)
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const item = await this._updateItemUseCase.execute(req.params.id as string, req.body);
      res.status(HttpStatus.OK).json(
        ApiResponse.success(Messages.ITEM_UPDATED, item)
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this._deleteItemUseCase.execute(req.params.id as string);
      res.status(HttpStatus.OK).json(
        ApiResponse.success(Messages.ITEM_DELETED)
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
    }
  }
}
