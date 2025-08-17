import { fetchInstance } from "./fetchInstance"

type ApiResponse<T> = {
  data: T | null
  status: number
  error?: string
}

class HttpClient {
  async GET<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: "GET" })
  }

  async POST<T, D>(url: string, data: D): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async PUT<T, D>(url: string, data: D): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async DELETE<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: "DELETE" })
  }

  private async request<T>(url: string, options: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetchInstance(url, options)
      const data = await response.json()
      return { data, status: response.status }
    } catch (error) {
      return this.handleError<T>(error)
    }
  }

  private handleError<T>(error: unknown): ApiResponse<T> {
    if (error instanceof Error) {
      return {
        data: null,
        status: 500,
        error: error.message,
      }
    }
    return {
      data: null,
      status: 500,
      error: "An unexpected error occurred",
    }
  }
}

export const httpClient = new HttpClient()
