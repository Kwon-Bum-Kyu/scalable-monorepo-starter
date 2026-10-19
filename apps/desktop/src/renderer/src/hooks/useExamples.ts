import type {
  CreateExampleInput,
  ExampleDetail,
  ExampleListQuery,
  UpdateExampleInput,
} from "@repo/shared-types";

import { useApi } from "@/hooks/useApi";
import { useMutation } from "@/hooks/useMutation";
import {
  createExample,
  deleteExample,
  type ExamplesListResult,
  fetchExampleDetail,
  fetchExamplesList,
  updateExample,
} from "@/services/examples";

export function useExamplesList(query?: ExampleListQuery) {
  return useApi<ExamplesListResult>(() => fetchExamplesList(query));
}

export function useExampleDetail(id: string) {
  return useApi<ExampleDetail>(() => fetchExampleDetail(id), {
    immediate: Boolean(id),
  });
}

export function useCreateExample() {
  return useMutation<ExampleDetail, CreateExampleInput>((input) =>
    createExample(input),
  );
}

interface UpdateExampleVariables {
  id: string;
  input: UpdateExampleInput;
}

export function useUpdateExample() {
  return useMutation<ExampleDetail, UpdateExampleVariables>(({ id, input }) =>
    updateExample(id, input),
  );
}

export function useDeleteExample() {
  return useMutation<void, string>((id) => deleteExample(id));
}
