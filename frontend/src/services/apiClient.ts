import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private instancee: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.instancee = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token de autenticación
    this.instancee.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejar errores
    this.instancee.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  get instance() {
    return this.instancee;
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  clearToken() {
    localStorage.removeItem('token');
  }
}

export const apiClient = new ApiClient();
export default apiClient;
