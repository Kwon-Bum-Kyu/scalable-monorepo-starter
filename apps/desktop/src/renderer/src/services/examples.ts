import type {
  CreateExampleInput,
  ExampleDetail,
  ExampleListItem,
  ExampleListQuery,
  PaginationMeta,
  UpdateExampleInput,
} from "@repo/shared-types";

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
): Promise<ExamplesListResult> {
  const response = await api.get<ExampleListItem[]>(
    `${EXAMPLES_BASE}${buildListQuery(query)}`,
  );
  return { items: response.data, meta: response.meta };
}

export async function fetchExampleDetail(
  id: string,
): Promise<ExampleDetail> {
  const response = await api.get<ExampleDetail>(`${EXAMPLES_BASE}/${id}`);
  return response.data;
}

export async function createExample(
  input: CreateExampleInput,
): Promise<ExampleDetail> {
  const response = await api.post<ExampleDetail>(EXAMPLES_BASE, input);
  return response.data;
}

export async function updateExample(
  id: string,
  input: UpdateExampleInput,
): Promise<ExampleDetail> {
  const response = await api.patch<ExampleDetail>(
    `${EXAMPLES_BASE}/${id}`,
    input,
  );
  return response.data;
}

export async function deleteExample(id: string): Promise<void> {
  await api.delete<null>(`${EXAMPLES_BASE}/${id}`);
}
