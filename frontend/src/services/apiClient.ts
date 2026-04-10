import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

// Usamos URL relativa '/api' para que el proxy de Vite redirija al backend.
// Esto evita problemas de CORS en desarrollo y facilita el despliegue.
const API_BASE_URL = '/api';

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor de request: agrega el token Bearer si existe
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor de response: maneja 401
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Evitar loop infinito: no redirigir si el error vino del propio login
          const isLoginRequest = error.config?.url?.includes('/usuarios/login');
          if (!isLoginRequest) {
            localStorage.removeItem('token');
            localStorage.removeItem('auth_user');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  get instance() {
    return this.axiosInstance;
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  clearToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
  }
}

export const apiClient = new ApiClient();
export default apiClient;
