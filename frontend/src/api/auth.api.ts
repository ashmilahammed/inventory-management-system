import api from './axios';
import { ApiRoutes } from '../constants/routes';

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(ApiRoutes.AUTH.LOGIN, credentials);
    return response.data;
  },
};
