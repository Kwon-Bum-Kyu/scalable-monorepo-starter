import { useCallback, useState } from "react";

import { ApiError, ApiResponse } from "@/types/api";

interface UseMutationState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  onSettled?: (data: T | null, error: ApiError | null) => void;
}

export function useMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: UseMutationOptions<TData> = {},
) {
  const { onSuccess, onError, onSettled } = options;

  const [state, setState] = useState<UseMutationState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: TVariables) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await mutationFn(variables);
        const data = response.data;

        setState({
          data,
          loading: false,
          error: null,
        });

        if (onSuccess) {
          onSuccess(data);
        }

        if (onSettled) {
          onSettled(data, null);
        }

        return response;
      } catch (error) {
        const apiError = error as ApiError;

        setState({
          data: null,
          loading: false,
          error: apiError,
        });

        if (onError) {
          onError(apiError);
        }

        if (onSettled) {
          onSettled(null, apiError);
        }

        throw error;
      }
    },
    [mutationFn, onSuccess, onError, onSettled],
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
    isLoading: state.loading,
    isError: !!state.error,
    isSuccess: !!state.data && !state.error,
  };
}
