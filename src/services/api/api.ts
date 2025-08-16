import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

// Create a token manager to handle dynamic token updates
class TokenManager {
  private currentToken: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.currentToken = localStorage.getItem('authToken');
      
      // Listen for token updates
      window.addEventListener('tokenUpdated', ((event: CustomEvent) => {
        this.currentToken = event.detail.token;
      }) as EventListener);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && !this.currentToken) {
      this.currentToken = localStorage.getItem('authToken');
    }
    return this.currentToken;
  }

  setToken(token: string): void {
    this.currentToken = token;
  }

  clearToken(): void {
    this.currentToken = null;
  }
}

const tokenManager = new TokenManager();

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://auth.exmodules.org/api/v1/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear token on 401 and redirect to login
      tokenManager.clearToken();
      localStorage.removeItem('authToken');
      window.location.href = '/signin';
    }
    const message = error.response?.data?.message ?? 'An error occurred';
    return Promise.reject(message);
  }
);

export default api;