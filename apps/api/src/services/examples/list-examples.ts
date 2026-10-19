import type {
  ExampleListItem,
  ExampleStatus,
  PaginationMeta,
} from "@repo/shared-types";

import { examplesRepository } from "../../repositories/examples/examples.repository";

interface ListExamplesParams {
  page: number;
  pageSize: number;
  status?: ExampleStatus;
}

interface ListExamplesResult {
  items: ExampleListItem[];
  meta: PaginationMeta;
}

export async function listExamples(
  params: ListExamplesParams,
): Promise<ListExamplesResult> {
  const { items, total } = await examplesRepository.findAll(params);
  return {
    items,
    meta: {
      total,
      page: params.page,
      pageSize: params.pageSize,
    },
  };
}
