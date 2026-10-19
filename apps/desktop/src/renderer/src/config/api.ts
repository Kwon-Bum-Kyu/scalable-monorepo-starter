export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
} as const;

export const API_ENDPOINTS = {} as const;
