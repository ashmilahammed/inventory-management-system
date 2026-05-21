import axios from 'axios';
import { PageRoutes } from '../constants/routes';

const api = axios.create({
  // baseURL: 'http://localhost:4000/api', 
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login only if not already on the login page
      if (window.location.pathname !== PageRoutes.LOGIN) {
        window.location.href = PageRoutes.LOGIN;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
