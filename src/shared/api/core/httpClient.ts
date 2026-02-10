/**
 * HTTP Client - 모든 API 호출에 사용되는 공통 로직 관리
 */
import type { ApiError } from "@/shared/types";

class HttpClient {
  private baseURL: string;
  private tokenProvider: (() => Promise<string | null>) | null = null;

  constructor(baseURL: string = "/api") {
    this.baseURL = baseURL;
  }

  setTokenProvider(provider: (() => Promise<string | null>) | null) {
    this.tokenProvider = provider;
  }

  async getAuthToken(): Promise<string | null> {
    if (!this.tokenProvider) {
      // TokenProvider가 설정되지 않았다면 잠시 대기
      for (let i = 0; i < 20; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (this.tokenProvider) break;
      }
    }

    if (this.tokenProvider) {
      try {
        return await this.tokenProvider();
      } catch (error) {
        console.warn("Failed to get auth token:", error);
      }
    }

    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const authToken = await this.getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error: ApiError = {
          message: `HTTP error! status: ${response.status}`,
          status: response.status,
        };

        try {
          const errorData = await response.json();
          error.message = errorData.message || error.message;
          error.code = errorData.code;
          error.details = errorData;
        } catch {
          // JSON 파싱 실패 시 기본 에러 유지
        }

        // 401 Unauthorized - 토큰 재갱신 시도
        if (response.status === 401 && this.tokenProvider) {
          const newToken = await this.tokenProvider();
          if (newToken && newToken !== authToken) {
            const retryResponse = await fetch(url, {
              ...config,
              headers: {
                ...headers,
                Authorization: `Bearer ${newToken}`,
              },
            });

            if (retryResponse.ok) {
              return await retryResponse.json();
            }
          }
        }

        throw error;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw {
            message: "Request timeout",
            status: 408,
          } as ApiError;
        }
        throw {
          message: error.message,
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }
    return this.request<T>(url, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const httpClient = new HttpClient();
