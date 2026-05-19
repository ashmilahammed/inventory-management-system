import { ExportService } from "../../../infrastructure/services/ExportService";

export class GenerateExportUseCase {
  constructor(
    private readonly _exportService: ExportService
  ) {}

  async generateExcel(columns: any[], data: any[]): Promise<Buffer> {
    return this._exportService.generateExcel(columns, data);
  }

  async generatePdf(title: string, columns: { header: string, width: number }[], data: string[][]): Promise<Buffer> {
    return this._exportService.generatePdf(title, columns, data);
  }
}
