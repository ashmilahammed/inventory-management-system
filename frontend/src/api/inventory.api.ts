import api from './axios';
import { ApiRoutes } from '../constants/routes';
import type { ApiResponse } from './customers.api';

export interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export interface ItemInput {
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export const inventoryApi = {
  getItems: async (query = ''): Promise<ApiResponse<Item[]>> => {
    const url = `${ApiRoutes.INVENTORY.BASE}${query ? `?q=${query}` : ''}`;
    const response = await api.get<ApiResponse<Item[]>>(url);
    return response.data;
  },
  createItem: async (itemData: ItemInput): Promise<ApiResponse<Item>> => {
    const response = await api.post<ApiResponse<Item>>(ApiRoutes.INVENTORY.BASE, itemData);
    return response.data;
  },
  updateItem: async (id: string, itemData: ItemInput): Promise<ApiResponse<Item>> => {
    const response = await api.put<ApiResponse<Item>>(ApiRoutes.INVENTORY.BY_ID(id), itemData);
    return response.data;
  },
  deleteItem: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(ApiRoutes.INVENTORY.BY_ID(id));
    return response.data;
  },
};
