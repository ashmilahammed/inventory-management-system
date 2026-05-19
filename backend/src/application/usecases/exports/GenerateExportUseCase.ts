import { ExportService } from "../../../infrastructure/services/ExportService";
import { IGenerateExportUseCase } from "../../interfaces/exports/IGenerateExportUseCase";

export class GenerateExportUseCase implements IGenerateExportUseCase {
  constructor(
    private readonly _exportService: ExportService
  ) { }

  async generateExcel<T extends object>(columns: { header: string, key: string, width?: number }[], data: T[]): Promise<Buffer> {
    return this._exportService.generateExcel(columns, data);
  }

  async generatePdf(title: string, columns: { header: string, width: number }[], data: string[][]): Promise<Buffer> {
    return this._exportService.generatePdf(title, columns, data);
  }
}
