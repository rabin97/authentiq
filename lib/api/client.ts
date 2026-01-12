import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { RequestConfig } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const DEFAULT_TIMEOUT = 30000;

export class ApiClientError extends Error {
  statusCode: number;
  data?: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

// Create axios instance with default configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Don't set Content-Type for FormData, let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    // Add any default headers or modify request here
    // You can add auth tokens, etc.
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Return data directly (axios wraps it in a data property)
    return response.data;
  },
  (error: AxiosError) => {
    // Handle axios errors
    if (error.response) {
      // Server responded with error status
      const statusCode = error.response.status;
      const data = error.response.data as Record<string, unknown>;
      const errorMessage =
        (typeof data === "object" &&
          data !== null &&
          ("error" in data || "message" in data) &&
          (String(data.error) || String(data.message))) ||
        error.message ||
        "An error occurred!";
      throw new ApiClientError(errorMessage, statusCode, data);
    } else if (error.request) {
      // Request was made but no response received
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        throw new ApiClientError("Request timeout", 408);
      }
      throw new ApiClientError("Network error - no response received", 0);
    } else {
      // Error setting up the request
      throw new ApiClientError(
        error.message || "An unknown error occurred",
        500,
        error.cause
      );
    }
  }
);

// Helper function to convert RequestConfig to AxiosRequestConfig
function toAxiosConfig(config?: RequestConfig): AxiosRequestConfig {
  if (!config) return {};

  const axiosConfig: AxiosRequestConfig = {};

  if (config.headers) {
    axiosConfig.headers = config.headers;
  }

  if (config.timeout) {
    axiosConfig.timeout = config.timeout;
  }

  if (config.signal) {
    axiosConfig.signal = config.signal;
  }

  if (config.credentials) {
    axiosConfig.withCredentials = config.credentials === "include";
  }

  return axiosConfig;
}

export const apiClient = {
  get: <T>(endpoint: string, config?: RequestConfig): Promise<T> => {
    return axiosInstance.get<T, T>(endpoint, toAxiosConfig(config));
  },
  post: <T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> => {
    return axiosInstance.post<T, T>(
      endpoint,
      data as any,
      toAxiosConfig(config)
    );
  },
  put: <T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> => {
    return axiosInstance.put<T, T>(
      endpoint,
      data as any,
      toAxiosConfig(config)
    );
  },
  patch: <T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> => {
    return axiosInstance.patch<T, T>(
      endpoint,
      data as any,
      toAxiosConfig(config)
    );
  },
  delete: <T>(endpoint: string, config?: RequestConfig): Promise<T> => {
    return axiosInstance.delete<T, T>(endpoint, toAxiosConfig(config));
  },
  uploadFile: <T>(
    endpoint: string,
    formData: FormData,
    config?: RequestConfig
  ): Promise<T> => {
    const axiosConfig = toAxiosConfig(config);
    // Ensure we don't override Content-Type for FormData
    if (axiosConfig.headers) {
      delete axiosConfig.headers["Content-Type"];
    }
    return axiosInstance.post<T, T>(endpoint, formData, axiosConfig);
  },
};
