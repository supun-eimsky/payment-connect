import { API_SERVICES, API_ENDPOINTS, DEFAULT_HEADERS, ApiServiceType, getApiUrl, getServiceTimeout } from './config';
import { getTokenFromStorage, removeTokenFromStorage } from '../jwt';
import { error } from 'console';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
  method?: RequestMethod;
  headers?: HeadersInit;
  body?: any;
  token?: string;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  credentials?: RequestCredentials;
  service?: ApiServiceType; // Added service selector
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private defaultService: ApiServiceType = 'user';

  constructor(defaultService: ApiServiceType = 'user') {
    this.defaultService = defaultService;
  }

  private buildHeaders(options: ApiRequestOptions): HeadersInit {
    const headers: HeadersInit = {
      ...DEFAULT_HEADERS,
      ...options.headers,
    };

    const token = options.token || getTokenFromStorage();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    service?: ApiServiceType
  ): string {
    const serviceType = service || this.defaultService;
    const url = getApiUrl(serviceType, endpoint);
    
    if (!params) return url;

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });

    const queryString = queryParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  private async requestWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    return Promise.race([
      fetch(url, options),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      ),
    ]);
  }

  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      params,
      service,
      timeout = getServiceTimeout(service || this.defaultService),
      credentials = 'same-origin',
    } = options;

    const url = this.buildUrl(endpoint, params, service);
    const headers = this.buildHeaders(options);
    const serviceName = API_SERVICES[service || this.defaultService].name;

    console.log(`🌐 [${serviceName}] ${method} ${url}`);

    const config: RequestInit = {
      method,
      headers,
      credentials,
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await this.requestWithTimeout(url, config, timeout);

      if (response.status === 401) {
        console.warn('⚠️ Unauthorized - clearing token');
        removeTokenFromStorage();
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }

      const data = await response.json().catch(() => null);
      console.log(data,"sdddddddddddddddddddddddddddd")
      if (!response.ok) {
        const error: ApiError = {
          message: data?.error.message || "something went wrong",
          status: response.status,
          errors: data?.errors,
        };
        console.error(`❌ [${serviceName}] Error:`, error);
        throw error;
      }

      console.log(`✅ [${serviceName}] Response:`, data);

      return {
        data: data.data || data,
        status: response.status,
        message: data?.message,
        success: true,
      };
    } catch (error: any) {
      console.error(`❌ [${serviceName}] Request Failed:`, error);
      
      if (error.status) {
        throw error;
      }

      throw {
        message: error.message || 'Network error occurred',
        status: 0,
      } as ApiError;
    }
  }

  // Convenience methods with service parameter
  async get<T = any>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  async put<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  async patch<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  async delete<T = any>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export service-specific clients
export const userClient = new ApiClient('user');
export const ticketingClient = new ApiClient('ticketing');
export const fareClient = new ApiClient('fare');

// Export default client (user service)
export const apiClient = userClient;