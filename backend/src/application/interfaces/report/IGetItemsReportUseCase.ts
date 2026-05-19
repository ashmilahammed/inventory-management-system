import { Item } from "../../../domain/entities/Item";

export interface IGetItemsReportUseCase {
  execute(): Promise<Item[]>;
}
