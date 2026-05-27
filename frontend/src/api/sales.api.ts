import api from './axios';
import { ApiRoutes } from '../constants/routes';
import type { ApiResponse } from './customers.api';

export interface SaleInput {
  itemId: string;
  quantity: number;
  customerId?: string;
  isCash: boolean;
}

export interface SaleRecord {
  id: string;
  itemId: string;
  quantity: number;
  totalAmount: number;
  date: string;
  isCash: boolean;
}

export const salesApi = {
  recordSale: async (saleData: SaleInput): Promise<ApiResponse<SaleRecord>> => {
    const response = await api.post<ApiResponse<SaleRecord>>(ApiRoutes.SALES.BASE, saleData);
    return response.data;
  },
};
