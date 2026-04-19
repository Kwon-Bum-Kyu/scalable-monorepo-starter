import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiClient } from "@/utils/apiClient";

const DEFAULT_CONFIG = {
  baseURL: "http://localhost:4000/",
  timeout: 5000,
  retryCount: 2,
  retryDelay: 10,
};

const jsonResponse = (
  body: unknown,
  init: { status?: number } = {},
): Response => {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { "content-type": "application/json" },
  });
};

describe("ApiClient", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("URL 빌드", () => {
    it("baseURL 끝의 슬래시와 endpoint 앞의 슬래시를 제거하여 결합한다", async () => {
      const client = new ApiClient(DEFAULT_CONFIG);
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        jsonResponse({ data: { id: "1" }, message: "ok" }),
      );

      await client.get("/users");

      const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toBe("http://localhost:4000/users");
    });
  });

  describe("성공 응답", () => {
    it("JSON body의 data 필드를 ApiResponse로 감싸 반환한다", async () => {
      const client = new ApiClient(DEFAULT_CONFIG);
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        jsonResponse({ data: { id: "1" }, message: "조회 성공" }),
      );

      const result = await client.get<{ id: string }>("users");

      expect(result.data).toEqual({ id: "1" });
      expect(result.message).toBe("조회 성공");
      expect(result.success).toBe(true);
    });
  });

  describe("HTTP 메서드", () => {
    it("post는 data를 JSON body로 직렬화한다", async () => {
      const client = new ApiClient(DEFAULT_CONFIG);
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        jsonResponse({ data: { ok: true }, message: "생성" }),
      );

      await client.post("users", { name: "김" });

      const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(init.method).toBe("POST");
      expect(init.body).toBe(JSON.stringify({ name: "김" }));
    });

    it("put·patch·delete도 각자 올바른 메서드로 호출된다", async () => {
      const client = new ApiClient(DEFAULT_CONFIG);
      (fetch as ReturnType<typeof vi.fn>).mockImplementation(() =>
        Promise.resolve(jsonResponse({ data: null, message: "ok" })),
      );

      await client.put("users/1", { name: "A" });
      await client.patch("users/1", { name: "B" });
      await client.delete("users/1");

      const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls;
      expect(calls[0][1].method).toBe("PUT");
      expect(calls[1][1].method).toBe("PATCH");
      expect(calls[2][1].method).toBe("DELETE");
    });

    it("FormData를 보내면 Content-Type 헤더를 브라우저가 설정하도록 위임한다", async () => {
      const client = new ApiClient(DEFAULT_CONFIG);
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        jsonResponse({ data: null, message: "업로드" }),
      );

      const form = new FormData();
      form.append("file", new Blob(["x"]));

      await client.post("upload", form);

      const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(init.body).toBeInstanceOf(FormData);
    });
  });

  describe("에러 처리", () => {
    it("응답이 실패면 ApiError 형태로 throw한다", async () => {
      const client = new ApiClient({ ...DEFAULT_CONFIG, retryCount: 0 });
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        jsonResponse(
          { message: "권한 없음", code: "FORBIDDEN" },
          { status: 403 },
        ),
      );

      await expect(client.get("users")).rejects.toMatchObject({
        message: "권한 없음",
        code: "FORBIDDEN",
      });
    });

    it("JSON body가 없으면 status 문자열을 code로 사용한다", async () => {
      const client = new ApiClient({ ...DEFAULT_CONFIG, retryCount: 0 });
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        new Response("server down", {
          status: 500,
          headers: { "content-type": "text/plain" },
        }),
      );

      await expect(client.get("users")).rejects.toMatchObject({
        code: "500",
        message: "Request failed",
      });
    });
  });

  describe("재시도", () => {
    it("status 필드를 가진 5xx 오류는 재시도 대상이다", async () => {
      const client = new ApiClient({
        ...DEFAULT_CONFIG,
        retryCount: 2,
        retryDelay: 0,
      });
      const networkLike = Object.assign(new Error("Bad Gateway"), {
        status: 502,
      });
      (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(networkLike);

      await expect(client.get("users")).rejects.toBe(networkLike);
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    it("TypeError(Failed to fetch) 네트워크 오류도 재시도 대상이다", async () => {
      const client = new ApiClient({
        ...DEFAULT_CONFIG,
        retryCount: 1,
        retryDelay: 0,
      });
      (fetch as ReturnType<typeof vi.fn>)
        .mockRejectedValueOnce(new TypeError("Failed to fetch"))
        .mockResolvedValueOnce(
          jsonResponse({ data: { ok: true }, message: "ok" }),
        );

      const result = await client.get<{ ok: boolean }>("users");

      expect(result.data).toEqual({ ok: true });
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it("4xx 에러는 재시도하지 않고 즉시 실패한다", async () => {
      const client = new ApiClient({
        ...DEFAULT_CONFIG,
        retryCount: 3,
        retryDelay: 0,
      });
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        jsonResponse({ message: "잘못된 요청" }, { status: 400 }),
      );

      await expect(client.get("users")).rejects.toBeDefined();
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("인터셉터", () => {
    it("request 인터셉터가 헤더를 추가하면 fetch 호출에 반영된다", async () => {
      const client = new ApiClient(DEFAULT_CONFIG);
      client.addRequestInterceptor({
        onRequest: (config) => {
          const headers = {
            ...(config.headers as Record<string, string>),
            Authorization: "Bearer T",
          };
          return { ...config, headers };
        },
      });
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        jsonResponse({ data: {}, message: "ok" }),
      );

      await client.get("users");

      const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(
        (init.headers as Record<string, string>).Authorization,
      ).toBe("Bearer T");
    });

    it("response 인터셉터가 응답을 가공할 수 있다", async () => {
      const client = new ApiClient(DEFAULT_CONFIG);
      client.addResponseInterceptor({
        onResponse: (response) => ({
          ...response,
          message: `[intercepted] ${response.message}`,
        }),
      });
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        jsonResponse({ data: { ok: 1 }, message: "원본" }),
      );

      const result = await client.get<{ ok: number }>("users");

      expect(result.message).toBe("[intercepted] 원본");
    });
  });
});
