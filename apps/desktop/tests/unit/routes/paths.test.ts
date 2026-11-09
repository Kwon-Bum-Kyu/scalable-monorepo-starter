import { describe, expect, it } from "vitest";

import { ROUTES } from "@/routes/paths";

describe("라우트 경로", () => {
  it("[라우트 경로]가 공개 화면을 연결할 때 계약된 값을 제공한다", () => {
    expect(ROUTES.root).toBe("/");
    expect(ROUTES.guide).toBe("/guide");
    expect(ROUTES.error).toBe("/error");
  });
});
