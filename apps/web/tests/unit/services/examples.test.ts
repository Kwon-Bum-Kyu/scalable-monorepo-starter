import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createExample,
  deleteExample,
  fetchExampleDetail,
  fetchExamplesList,
  updateExample,
} from "@/services/examples";

const successEnvelope = (
  body: { data: unknown; meta?: unknown },
  init: { status?: number; requestId?: string } = {},
): Response => {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (init.requestId) {
    headers["X-Request-Id"] = init.requestId;
  }
  return new Response(
    JSON.stringify({ success: true, data: body.data, meta: body.meta }),
    {
      status: init.status ?? 200,
      headers,
    },
  );
};

const failureEnvelope = (
  error: { code: string; message: string; details?: unknown },
  init: { status?: number; requestId?: string } = {},
): Response => {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (init.requestId) {
    headers["X-Request-Id"] = init.requestId;
  }
  return new Response(JSON.stringify({ success: false, error }), {
    status: init.status ?? 400,
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
        successEnvelope({ data: [] }),
      );

      await fetchExamplesList();

      const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toBe("http://localhost:4000/api/v1/examples");
      expect(init.method).toBe("GET");
    });

    it("page·pageSize·status가 주어지면 query string으로 직렬화한다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        successEnvelope({ data: [] }),
      );

      await fetchExamplesList({ page: 2, pageSize: 20, status: "published" });

      const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toContain("page=2");
      expect(url).toContain("pageSize=20");
      expect(url).toContain("status=published");
    });

    it("BE가 success+meta envelope를 반환할 때 {items, meta}로 언래핑한다", async () => {
      const items = [
        { id: "x1", title: "첫 항목" },
        { id: "x2", title: "두 번째" },
      ];
      const meta = { total: 12, page: 1, pageSize: 10 };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        successEnvelope({ data: items, meta }),
      );

      const result = await fetchExamplesList();

      expect(result).toEqual({ items, meta });
    });

    it("BE가 실패 envelope를 반환할 때 ApiError를 throw한다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        failureEnvelope(
          { code: "VALIDATION_FAILED", message: "잘못된 query" },
          { status: 400 },
        ),
      );

      await expect(fetchExamplesList()).rejects.toMatchObject(
        {
          code: "VALIDATION_FAILED",
          message: "잘못된 query",
        },
      );
    });
  });

  describe("fetchExampleDetail", () => {
    it("id로 GET /api/v1/examples/:id 를 요청한다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        successEnvelope({ data: { id: "x1" } }),
      );

      await fetchExampleDetail("x1");

      const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toBe("http://localhost:4000/api/v1/examples/x1");
      expect(init.method).toBe("GET");
    });

    it("BE가 success envelope를 반환할 때 ExampleDetail을 그대로 반환한다", async () => {
      const detail = {
        id: "d1",
        title: "상세",
        status: "published",
        body: "본문",
      };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        successEnvelope({ data: detail }),
      );

      const result = await fetchExampleDetail("d1");

      expect(result).toEqual(detail);
    });

    it("BE가 4xx 실패 envelope를 반환할 때 ApiError를 throw한다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        failureEnvelope(
          { code: "NOT_FOUND", message: "항목을 찾을 수 없다" },
          { status: 404 },
        ),
      );

      await expect(
        fetchExampleDetail("missing"),
      ).rejects.toMatchObject({
        code: "NOT_FOUND",
        message: "항목을 찾을 수 없다",
      });
    });
  });

  describe("createExample", () => {
    it("POST /api/v1/examples 에 입력 객체를 JSON body로 보낸다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        successEnvelope({ data: { id: "n1" } }, { status: 201 }),
      );

      await createExample({ title: "새 항목", status: "draft" });

      const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toBe("http://localhost:4000/api/v1/examples");
      expect(init.method).toBe("POST");
      expect(init.body).toBe(
        JSON.stringify({ title: "새 항목", status: "draft" }),
      );
    });

    it("BE가 success envelope를 반환할 때 ExampleDetail을 반환한다", async () => {
      const created = {
        id: "c1",
        title: "신규",
        status: "draft",
        body: "",
      };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        successEnvelope({ data: created }, { status: 201 }),
      );

      const result = await createExample({ title: "신규", status: "draft" });

      expect(result).toEqual(created);
    });

    it("BE가 4xx 실패 envelope를 반환할 때 ApiError를 throw한다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        failureEnvelope(
          { code: "VALIDATION_FAILED", message: "title이 비었다" },
          { status: 422 },
        ),
      );

      await expect(
        createExample({ title: "", status: "draft" }),
      ).rejects.toMatchObject({
        code: "VALIDATION_FAILED",
        message: "title이 비었다",
      });
    });
  });

  describe("updateExample", () => {
    it("PATCH /api/v1/examples/:id 에 부분 입력을 JSON body로 보낸다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        successEnvelope({ data: { id: "u1" } }),
      );

      await updateExample("u1", { title: "수정" });

      const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toBe("http://localhost:4000/api/v1/examples/u1");
      expect(init.method).toBe("PATCH");
      expect(init.body).toBe(JSON.stringify({ title: "수정" }));
    });

    it("BE가 success envelope를 반환할 때 ExampleDetail을 반환한다", async () => {
      const updated = {
        id: "u1",
        title: "수정",
        status: "published",
        body: "본문",
      };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        successEnvelope({ data: updated }),
      );

      const result = await updateExample("u1", { title: "수정" });

      expect(result).toEqual(updated);
    });

    it("BE가 4xx 실패 envelope를 반환할 때 ApiError를 throw한다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        failureEnvelope(
          { code: "FORBIDDEN", message: "권한 없음" },
          { status: 403 },
        ),
      );

      await expect(
        updateExample("u1", { title: "x" }),
      ).rejects.toMatchObject({
        code: "FORBIDDEN",
        message: "권한 없음",
      });
    });
  });

  describe("deleteExample", () => {
    it("DELETE /api/v1/examples/:id 를 호출한다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        successEnvelope({ data: null }),
      );

      await deleteExample("d1");

      const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toBe("http://localhost:4000/api/v1/examples/d1");
      expect(init.method).toBe("DELETE");
    });

    it("BE가 success envelope를 반환할 때 void를 반환한다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        successEnvelope({ data: null }),
      );

      const result = await deleteExample("d1");

      expect(result).toBeUndefined();
    });

    it("BE가 4xx 실패 envelope를 반환할 때 ApiError를 throw한다", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        failureEnvelope(
          { code: "NOT_FOUND", message: "삭제 대상 없음" },
          { status: 404 },
        ),
      );

      await expect(
        deleteExample("missing"),
      ).rejects.toMatchObject({
        code: "NOT_FOUND",
        message: "삭제 대상 없음",
      });
    });
  });
});
