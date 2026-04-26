import type {
  CreateExampleInput,
  ExampleDetail,
  ExampleListItem,
  ExampleListQuery,
  PaginationMeta,
  UpdateExampleInput,
} from "@repo/shared-types";

import { useApi } from "@/hooks/useApi";
import { useMutation } from "@/hooks/useMutation";
import type { ApiResponse } from "@/types/api";
import { api } from "@/utils/api";

const EXAMPLES_BASE = "/api/v1/examples";

export interface ExamplesListResult {
  items: ExampleListItem[];
  meta?: PaginationMeta;
}

const buildListQuery = (query?: ExampleListQuery): string => {
  if (!query) {
    return "";
  }

  const params = new URLSearchParams();
  if (typeof query.page === "number") {
    params.set("page", String(query.page));
  }
  if (typeof query.pageSize === "number") {
    params.set("pageSize", String(query.pageSize));
  }
  if (query.status) {
    params.set("status", query.status);
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
};

export async function fetchExamplesList(
  query?: ExampleListQuery,
): Promise<ApiResponse<ExampleListItem[]>> {
  return api.get<ExampleListItem[]>(`${EXAMPLES_BASE}${buildListQuery(query)}`);
}

export async function fetchExampleDetail(
  id: string,
): Promise<ApiResponse<ExampleDetail>> {
  return api.get<ExampleDetail>(`${EXAMPLES_BASE}/${id}`);
}

export async function createExample(
  input: CreateExampleInput,
): Promise<ApiResponse<ExampleDetail>> {
  return api.post<ExampleDetail>(EXAMPLES_BASE, input);
}

export async function updateExample(
  id: string,
  input: UpdateExampleInput,
): Promise<ApiResponse<ExampleDetail>> {
  return api.patch<ExampleDetail>(`${EXAMPLES_BASE}/${id}`, input);
}

export async function deleteExample(
  id: string,
): Promise<ApiResponse<null>> {
  return api.delete<null>(`${EXAMPLES_BASE}/${id}`);
}

export function useExamplesList(query?: ExampleListQuery) {
  return useApi<ExampleListItem[]>(() => fetchExamplesList(query));
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
  return useMutation<null, string>((id) => deleteExample(id));
}
