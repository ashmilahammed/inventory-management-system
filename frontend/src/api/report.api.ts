import api from './axios';
import { ApiRoutes } from '../constants/routes';
import type { ApiResponse } from './customers.api';
import type { Item } from './inventory.api';
import type { SaleRecord } from './sales.api';

export interface LedgerTransaction {
  id: string;
  customerId: string;
  type: 'debit' | 'credit';
  amount: number;
  referenceId?: string;
  description: string;
  date: string;
}

export interface EmailReportInput {
  email: string;
  subject: string;
  body: string;
  reportType: 'sales' | 'items' | 'ledger';
  format: 'pdf' | 'excel';
  customerId?: string;
}

export const reportsApi = {
  getSalesReport: async (): Promise<ApiResponse<SaleRecord[]>> => {
    const response = await api.get<ApiResponse<SaleRecord[]>>(ApiRoutes.REPORTS.SALES);
    return response.data;
  },
  getItemsReport: async (): Promise<ApiResponse<Item[]>> => {
    const response = await api.get<ApiResponse<Item[]>>(ApiRoutes.REPORTS.ITEMS);
    return response.data;
  },
  getLedgerReport: async (customerId: string): Promise<ApiResponse<LedgerTransaction[]>> => {
    const response = await api.get<ApiResponse<LedgerTransaction[]>>(ApiRoutes.REPORTS.LEDGER(customerId));
    return response.data;
  },
  exportReport: async (url: string): Promise<Blob> => {
    const response = await api.get(url, { responseType: 'blob' });
    return response.data;
  },
  emailReport: async (emailData: EmailReportInput): Promise<ApiResponse<{ previewUrl?: string }>> => {
    const response = await api.post<ApiResponse<{ previewUrl?: string }>>(ApiRoutes.REPORTS.EMAIL, emailData);
    return response.data;
  },
};
