import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

export class ExportService {
  async generateExcel<T extends object>(columns: { header: string, key: string, width?: number }[], data: T[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    worksheet.columns = columns.map(col => ({
      header: col.header,
      key: col.key,
      width: 20
    }));

    data.forEach(item => {
      worksheet.addRow(item);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async generatePdf(title: string, columns: { header: string, width: number }[], data: string[][]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc.fontSize(20).text(title, { align: "center" });
      doc.moveDown();

      let y = doc.y;

      doc.fontSize(12).font('Helvetica-Bold');
      let currentX = 30;
      columns.forEach((col) => {
        doc.text(col.header, currentX, y);
        currentX += col.width;
      });
      doc.moveDown();
      y = doc.y;
      doc.moveTo(30, y - 5).lineTo(530, y - 5).stroke();

      doc.font('Helvetica');
      data.forEach(row => {
        let rowX = 30;
        row.forEach((colData, i) => {
          doc.text(colData, rowX, y, { width: columns[i].width });
          rowX += columns[i].width;
        });
        doc.moveDown();
        y = doc.y;
      });

      doc.end();
    });
  }
}
