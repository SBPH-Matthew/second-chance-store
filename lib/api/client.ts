/**
 * API Client Configuration
 * Centralized API client for making requests to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    hasBody: boolean = false
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Build headers - only set Content-Type if there's a body
    const existingHeaders = options.headers as Record<string, string> | undefined;
    const headers: Record<string, string> = {
      ...(existingHeaders || {}),
    };
    
    if (hasBody && !headers['Content-Type'] && !headers['content-type']) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Ensure credentials is always included, even if options tries to override
    const config: RequestInit = {
      ...options,
      credentials: 'include', // Always include cookies for authentication (set last to override any options)
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    };
    
    // Double-check credentials is set (in case options had undefined)
    if (!config.credentials) {
      config.credentials = 'include';
    }

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || 'An error occurred',
          errors: data.errors,
        };
        throw error;
      }

      return data as T;
    } catch (error) {
      // If it's already an ApiError (plain object), re-throw it as-is
      if (error && typeof error === 'object' && 'message' in error) {
        throw error;
      }
      // If it's an Error instance, throw it
      if (error instanceof Error) {
        throw error;
      }
      // Otherwise, wrap in a generic error
      throw new Error('An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' }, false);
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, !!data);
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, !!data);
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
