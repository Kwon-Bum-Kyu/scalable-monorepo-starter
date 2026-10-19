import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  useCreateExample,
  useDeleteExample,
  useExampleDetail,
  useExamplesList,
  useUpdateExample,
} from "@/hooks/useExamples";

const successEnvelope = (
  data: unknown,
  init: { status?: number } = {},
): Response => {
  return new Response(JSON.stringify({ success: true, data }), {
    status: init.status ?? 200,
    headers: { "content-type": "application/json" },
  });
};

describe("examples hooks", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("useExamplesList 가 마운트 시 목록을 로딩한다", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      successEnvelope([{ id: "x1" }]),
    );

    const { result } = renderHook(() => useExamplesList());

    await waitFor(() => {
      expect(result.current.data).toEqual({ items: [{ id: "x1" }] });
    });
  });

  it("useExampleDetail 이 id로 상세를 로딩한다", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      successEnvelope({ id: "d1" }),
    );

    const { result } = renderHook(() => useExampleDetail("d1"));

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: "d1" });
    });
  });

  it("useCreateExample 이 mutate 호출 시 POST 요청을 발사한다", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      successEnvelope({ id: "n1" }, { status: 201 }),
    );

    const { result } = renderHook(() => useCreateExample());

    await act(async () => {
      await result.current.mutate({ title: "신규" });
    });

    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.method).toBe("POST");
  });

  it("useUpdateExample 이 mutate 호출 시 PATCH 요청을 발사한다", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      successEnvelope({ id: "u1" }),
    );

    const { result } = renderHook(() => useUpdateExample());

    await act(async () => {
      await result.current.mutate({ id: "u1", input: { title: "수정" } });
    });

    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/api/v1/examples/u1");
    expect(init.method).toBe("PATCH");
  });

  it("useDeleteExample 이 mutate 호출 시 DELETE 요청을 발사한다", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      successEnvelope(null),
    );

    const { result } = renderHook(() => useDeleteExample());

    await act(async () => {
      await result.current.mutate("d1");
    });

    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/api/v1/examples/d1");
    expect(init.method).toBe("DELETE");
  });
});
