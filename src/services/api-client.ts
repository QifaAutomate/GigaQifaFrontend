/**
 * @fileOverview Базовый HTTP-клиент для взаимодействия с API бэкенда.
 * Реализует общую логику запросов, обработку ошибок и работу с заголовками.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com/v1';

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const status = response.status;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        error: errorData.message || `Ошибка запроса: ${status}`, 
        status 
      };
    }

    const data = await response.json();
    return { data, status };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'Неизвестная ошибка сети', 
      status: 500 
    };
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, body: any, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  
  put: <T>(endpoint: string, body: any, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  
  delete: <T>(endpoint: string, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
