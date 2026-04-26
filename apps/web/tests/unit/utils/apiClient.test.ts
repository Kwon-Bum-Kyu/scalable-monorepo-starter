import type { ApiResponse } from "@repo/shared-types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiClient } from "@/utils/apiClient";

const DEFAULT_CONFIG = {
  baseURL: "http://localhost:4000/",
  timeout: 5000,
  retryCount: 2,
  retryDelay: 10,
};

const envelopeResponse = (
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

describe("ApiClient envelope 언래핑", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("apiClient가 success: true envelope를 받을 때 data를 반환한다", async () => {
    const client = new ApiClient(DEFAULT_CONFIG);
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      envelopeResponse({ success: true, data: { id: "1", title: "T" } }),
    );

    const result = await client.get<{ id: string; title: string }>("examples");

    expect(result.data).toEqual({ id: "1", title: "T" });
    expect(result.meta).toBeUndefined();
  });

  it("apiClient가 success: true envelope에 meta가 있을 때 meta를 함께 반환한다", async () => {
    const client = new ApiClient(DEFAULT_CONFIG);
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      envelopeResponse({
        success: true,
        data: [{ id: "1" }],
        meta: { total: 1, page: 1, pageSize: 10 },
      }),
    );

    const result = await client.get<Array<{ id: string }>>("examples");

    expect(result.data).toEqual([{ id: "1" }]);
    expect(result.meta).toEqual({ total: 1, page: 1, pageSize: 10 });
  });

  it("apiClient가 success: false envelope를 받을 때 ApiError를 throw한다", async () => {
    const client = new ApiClient({ ...DEFAULT_CONFIG, retryCount: 0 });
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      envelopeResponse(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "잘못된 입력" },
        },
        { status: 200 },
      ),
    );

    await expect(client.get("examples")).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      message: "잘못된 입력",
    });
  });

  it("apiClient가 envelope 형태가 아닌 응답을 받을 때 INVALID_ENVELOPE 에러를 throw한다", async () => {
    const client = new ApiClient({ ...DEFAULT_CONFIG, retryCount: 0 });
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      envelopeResponse({ data: { id: "1" }, message: "ok" }),
    );

    await expect(client.get("examples")).rejects.toMatchObject({
      code: "INVALID_ENVELOPE",
    });
  });

  it("apiClient가 4xx HTTP status일 때 envelope의 error를 그대로 throw한다", async () => {
    const client = new ApiClient({ ...DEFAULT_CONFIG, retryCount: 0 });
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      envelopeResponse(
        {
          success: false,
          error: { code: "FORBIDDEN", message: "권한 없음" },
        },
        {
          status: 403,
          requestId: "7f3a3c5b-1234-5678-9abc-def012345678",
        },
      ),
    );

    await expect(client.get("examples")).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "권한 없음",
      requestId: "7f3a3c5b-1234-5678-9abc-def012345678",
    });
  });

  it("apiClient가 5xx HTTP status일 때 retry 후에도 실패하면 throw한다", async () => {
    const client = new ApiClient({
      ...DEFAULT_CONFIG,
      retryCount: 2,
      retryDelay: 0,
    });
    const networkLike = Object.assign(new Error("Bad Gateway"), {
      status: 502,
    });
    (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(networkLike);

    await expect(client.get("examples")).rejects.toBe(networkLike);
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});

describe("ApiClient 컴파일러 강제 (Q-4)", () => {
  it("envelope 자체를 제네릭에 넘기면 결과의 data가 사용 불가 타입(never)이 되어 컴파일 차단된다", () => {
    const client = new ApiClient(DEFAULT_CONFIG);
    // 본 블록은 런타임 검증이 아니라 타입 시스템 검증이다.
    // envelope 제네릭을 넘기면 UnwrappedPayload<T> = never로 평가되어 data를 의미 있게 사용할 수 없다.
    const _typeOnly = async (): Promise<{ id: string }> => {
      const response = await client.get<ApiResponse<{ id: string }>>(
        "examples",
      );
      // @ts-expect-error envelope 직접 제네릭은 결과를 사용할 수 없다 (data가 never)
      const id: string = response.data.id;
      return { id };
    };
    expect(typeof _typeOnly).toBe("function");
  });
});
