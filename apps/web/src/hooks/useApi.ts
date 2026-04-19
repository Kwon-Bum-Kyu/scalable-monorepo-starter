import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError, ApiResponse } from "@/types/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiOptions<T = unknown> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {},
) {
  const { immediate = true, onSuccess, onError } = options;
  const apiFunctionRef = useRef(apiFunction);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  // Update refs when props change
  apiFunctionRef.current = apiFunction;
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunctionRef.current();
      setState({
        data: response.data,
        loading: false,
        error: null,
      });

      if (onSuccessRef.current) {
        onSuccessRef.current(response.data);
      }

      return response;
    } catch (error) {
      const apiError = error as ApiError;
      setState({
        data: null,
        loading: false,
        error: apiError,
      });

      if (onErrorRef.current) {
        onErrorRef.current(apiError);
      }

      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
    refetch: execute,
  };
}
