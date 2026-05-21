export interface IEmailReportRequest {
  email: string;
  subject: string;
  body: string;
  reportType: 'sales' | 'items' | 'ledger';
  format: 'pdf' | 'excel';
  customerId?: string;
}

export interface IEmailReportResponse {
  success: boolean;
  message: string;
  previewUrl?: string;
}

export interface IEmailReportUseCase {
  execute(request: IEmailReportRequest): Promise<IEmailReportResponse>;
}
