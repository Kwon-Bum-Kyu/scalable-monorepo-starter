import { API_CONFIG } from "@/config/api";
import { ApiError } from "@/types/api";

import { ApiClient } from "./apiClient";

export const api = new ApiClient({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  retryCount: API_CONFIG.RETRY_COUNT,
  retryDelay: API_CONFIG.RETRY_DELAY,
});

api.addRequestInterceptor({
  onRequest: async (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const headers = (config.headers as Record<string, string>) || {};
      headers.Authorization = `Bearer ${token}`;
      config.headers = headers;
    }

    return config;
  },
  onError: async (error) => {
    console.error("request error: ", error);
    return error;
  },
});

api.addResponseInterceptor({
  onResponse: async (response) => {
    return response;
  },
  onError: async (error: ApiError) => {
    console.error("response error: ", error);

    if (error.code === "401" || error.code === "UNAUTHORIZED") {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    if (error.code === "403" || error.code === "FORBIDDEN") {
      // console.warn('access denied');
    }

    if (error.code === "404" || error.code === "NOT_FOUND") {
      // console.warn('esource not found');
    }

    if (error.code === "500" || error.code === "INTERNAL_SERVER_ERROR") {
      // console.error('server error occurred');
    }

    return error;
  },
});

export * from "./apiClient";
export default api;
