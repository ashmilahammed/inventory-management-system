export interface IGenerateExportUseCase {
  generateExcel<T extends object>(columns: { header: string, key: string, width?: number }[], data: T[]): Promise<Buffer>;
  generatePdf(title: string, columns: { header: string, width: number }[], data: string[][]): Promise<Buffer>;
}
