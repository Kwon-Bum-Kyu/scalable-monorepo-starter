import { describe, expect, it } from "vitest";

import type { ApiError } from "@/types/api";
import {
  PAGE_ACTION_CLASS,
  resolveListView,
  ROW_ACTION_CLASS,
} from "@/view/examples/examplesView";

const apiError: ApiError = {
  message: "실패",
  code: "500",
  timestamp: "2026-11-09T00:00:00.000Z",
};
const withItems = (count: number) => ({
  items: Array.from({ length: count }).map((_, i) => ({
    id: `id-${i}`,
    title: `t${i}`,
    status: "draft" as const,
    createdAt: "2026-11-01T00:00:00.000Z",
  })),
});

describe("resolveListView", () => {
  it("error가 있으면 data가 있어도 error 보기를 고른다", () => {
    expect(resolveListView({ data: withItems(2), error: apiError })).toBe(
      "error",
    );
  });

  it("data가 null이고 error가 없을 때 loading 보기를 고른다", () => {
    expect(resolveListView({ data: null, error: null })).toBe("loading");
  });

  it("items가 비어 있을 때 empty 보기를 고른다", () => {
    expect(resolveListView({ data: withItems(0), error: null })).toBe("empty");
  });

  it("items가 있을 때 list 보기를 고른다", () => {
    expect(resolveListView({ data: withItems(1), error: null })).toBe("list");
  });
});

describe("액션 클래스 상수", () => {
  it("페이지 액션은 Mobile 44px 전폭, Tablet부터 40px 자동 폭이다", () => {
    expect(PAGE_ACTION_CLASS).toBe(
      "w-full tablet:h-10 tablet:w-auto tablet:px-4 tablet:text-sm",
    );
  });

  it("행 액션은 Mobile 44px, Tablet부터 32px이다", () => {
    expect(ROW_ACTION_CLASS).toBe(
      "tablet:h-8 tablet:px-3 tablet:text-sm",
    );
  });
});
