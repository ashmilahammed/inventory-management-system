import api from './axios';
import { ApiRoutes } from '../constants/routes';

export interface Customer {
  id: string;
  name: string;
  address: string;
  mobileNumber: string;
}

export interface CustomerInput {
  name: string;
  address: string;
  mobileNumber: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const customersApi = {
  getCustomers: async (): Promise<ApiResponse<Customer[]>> => {
    const response = await api.get<ApiResponse<Customer[]>>(ApiRoutes.CUSTOMERS.BASE);
    return response.data;
  },
  createCustomer: async (customerData: CustomerInput): Promise<ApiResponse<Customer>> => {
    const response = await api.post<ApiResponse<Customer>>(ApiRoutes.CUSTOMERS.BASE, customerData);
    return response.data;
  },
  updateCustomer: async (id: string, customerData: CustomerInput): Promise<ApiResponse<Customer>> => {
    const response = await api.put<ApiResponse<Customer>>(ApiRoutes.CUSTOMERS.BY_ID(id), customerData);
    return response.data;
  },
  deleteCustomer: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(ApiRoutes.CUSTOMERS.BY_ID(id));
    return response.data;
  },
};
