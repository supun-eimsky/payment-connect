import { ApiRequestOptions, ApiResponse } from './client';

// Request Interceptor Type
export type RequestInterceptor = (
  endpoint: string,
  options: ApiRequestOptions
) => ApiRequestOptions | Promise<ApiRequestOptions>;

// Response Interceptor Type
export type ResponseInterceptor = <T>(
  response: ApiResponse<T>
) => ApiResponse<T> | Promise<ApiResponse<T>>;

// Error Interceptor Type
export type ErrorInterceptor = (error: any) => any;

class InterceptorManager {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  // Add request interceptor
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  // Add error interceptor
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  // Execute request interceptors
  async executeRequestInterceptors(
    endpoint: string,
    options: ApiRequestOptions
  ): Promise<ApiRequestOptions> {
    let modifiedOptions = options;

    for (const interceptor of this.requestInterceptors) {
      modifiedOptions = await interceptor(endpoint, modifiedOptions);
    }

    return modifiedOptions;
  }

  // Execute response interceptors
  async executeResponseInterceptors<T>(
    response: ApiResponse<T>
  ): Promise<ApiResponse<T>> {
    let modifiedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }

    return modifiedResponse;
  }

  // Execute error interceptors
  async executeErrorInterceptors(error: any): Promise<any> {
    let modifiedError = error;

    for (const interceptor of this.errorInterceptors) {
      modifiedError = await interceptor(modifiedError);
    }

    return modifiedError;
  }
}

// Export singleton instance
export const interceptorManager = new InterceptorManager();

// Default interceptors

// Log all requests
interceptorManager.addRequestInterceptor((endpoint, options) => {
  console.log(`📤 Outgoing Request: ${options.method || 'GET'} ${endpoint}`);
  return options;
});

// Log all responses
interceptorManager.addResponseInterceptor((response) => {
  console.log(`📥 Incoming Response: Status ${response.status}`);
  return response;
});

// Handle common errors
interceptorManager.addErrorInterceptor((error) => {
  if (error.status === 401) {
    console.error('🔒 Authentication failed');
  } else if (error.status === 403) {
    console.error('🚫 Access forbidden');
  } else if (error.status === 404) {
    console.error('🔍 Resource not found');
  } else if (error.status >= 500) {
    console.error('💥 Server error');
  }
  
  return error;
});