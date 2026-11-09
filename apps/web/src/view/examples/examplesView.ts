import type { ExamplesListResult } from "@/services/examples";
import type { ApiError } from "@/types/api";

export type ExamplesListView = "loading" | "error" | "empty" | "list";

export function resolveListView(list: {
  data: ExamplesListResult | null;
  error: ApiError | null;
}): ExamplesListView {
  if (list.error !== null) {
    return "error";
  }
  if (list.data === null) {
    return "loading";
  }
  return list.data.items.length === 0 ? "empty" : "list";
}

export const PAGE_ACTION_CLASS =
  "h-11 w-full px-8 text-base tablet:h-10 tablet:w-auto tablet:px-4 tablet:text-sm";
export const ROW_ACTION_CLASS =
  "h-11 px-8 text-base tablet:h-8 tablet:px-3 tablet:text-sm";
