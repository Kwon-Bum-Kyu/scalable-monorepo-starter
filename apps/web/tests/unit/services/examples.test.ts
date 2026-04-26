import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createExample,
  deleteExample,
  fetchExampleDetail,
  fetchExamplesList,
  updateExample,
} from "@/services/examples";

const jsonResponse = (
  body: unknown,
  init: { status?: number; requestId?: string } = {},
): Response => {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (init.requestId) {
    headers["X-Request-Id"] = init.requestId;
  }
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers,
  });
};

describe("services/examples", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("fetchExamplesList", () => {
    it("query 없이 호출 시 GET /api/v1/examples 를 요청한다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        jsonResponse({ data: [], message: "ok" }),
      );

      await fetchExamplesList();

      const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toBe("http://localhost:4000/api/v1/examples");
      expect(init.method).toBe("GET");
    });

    it("page·pageSize·status가 주어지면 query string으로 직렬화한다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        jsonResponse({ data: [], message: "ok" }),
      );

      await fetchExamplesList({ page: 2, pageSize: 20, status: "published" });

      const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toContain("page=2");
      expect(url).toContain("pageSize=20");
      expect(url).toContain("status=published");
    });
  });

  describe("fetchExampleDetail", () => {
    it("id로 GET /api/v1/examples/:id 를 요청한다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        jsonResponse({ data: { id: "x1" }, message: "ok" }),
      );

      await fetchExampleDetail("x1");

      const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toBe("http://localhost:4000/api/v1/examples/x1");
      expect(init.method).toBe("GET");
    });
  });

  describe("createExample", () => {
    it("POST /api/v1/examples 에 입력 객체를 JSON body로 보낸다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        jsonResponse({ data: { id: "n1" }, message: "ok" }, { status: 201 }),
      );

      await createExample({ title: "새 항목", status: "draft" });

      const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toBe("http://localhost:4000/api/v1/examples");
      expect(init.method).toBe("POST");
      expect(init.body).toBe(
        JSON.stringify({ title: "새 항목", status: "draft" }),
      );
    });
  });

  describe("updateExample", () => {
    it("PATCH /api/v1/examples/:id 에 부분 입력을 JSON body로 보낸다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        jsonResponse({ data: { id: "u1" }, message: "ok" }),
      );

      await updateExample("u1", { title: "수정" });

      const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toBe("http://localhost:4000/api/v1/examples/u1");
      expect(init.method).toBe("PATCH");
      expect(init.body).toBe(JSON.stringify({ title: "수정" }));
    });
  });

  describe("deleteExample", () => {
    it("DELETE /api/v1/examples/:id 를 호출한다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        jsonResponse({ data: null, message: "ok" }),
      );

      await deleteExample("d1");

      const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toBe("http://localhost:4000/api/v1/examples/d1");
      expect(init.method).toBe("DELETE");
    });
  });
});
