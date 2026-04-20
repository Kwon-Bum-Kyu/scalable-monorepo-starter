import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useMutation } from "@/hooks/useMutation";
import { ApiError, ApiResponse } from "@/types/api";

const okResponse = <T,>(data: T): ApiResponse<T> => ({
  data,
  message: "ok",
  success: true,
  timestamp: new Date().toISOString(),
});

const apiError = (code: string, message = "실패"): ApiError => ({
  code,
  message,
  timestamp: new Date().toISOString(),
});

describe("useMutation", () => {
  describe("초기 상태", () => {
    it("mutate를 호출하기 전에는 idle 상태이다", () => {
      const fn = vi.fn().mockResolvedValue(okResponse({ id: "1" }));

      const { result } = renderHook(() => useMutation(fn));

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe("성공 경로", () => {
    it("mutate 성공 시 data와 isSuccess가 갱신된다", async () => {
      const fn = vi
        .fn<() => Promise<ApiResponse<{ id: string }>>>()
        .mockResolvedValue(okResponse({ id: "created" }));

      const { result } = renderHook(() => useMutation(fn));

      await act(async () => {
        await result.current.mutate();
      });

      expect(result.current.data).toEqual({ id: "created" });
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it("mutate 성공 시 onSuccess와 onSettled를 순서대로 호출한다", async () => {
      const onSuccess = vi.fn();
      const onSettled = vi.fn();
      const fn = vi
        .fn()
        .mockImplementation((v: { name: string }) =>
          Promise.resolve(okResponse({ echoed: v.name })),
        );

      const { result } = renderHook(() =>
        useMutation(fn, { onSuccess, onSettled }),
      );

      await act(async () => {
        await result.current.mutate({ name: "김" });
      });

      expect(onSuccess).toHaveBeenCalledWith({ echoed: "김" });
      expect(onSettled).toHaveBeenCalledWith({ echoed: "김" }, null);
    });

    it("mutate의 variables가 mutationFn에 그대로 전달된다", async () => {
      const fn = vi.fn().mockResolvedValue(okResponse(null));

      const { result } = renderHook(() =>
        useMutation<null, { id: string }>(fn),
      );

      await act(async () => {
        await result.current.mutate({ id: "42" });
      });

      expect(fn).toHaveBeenCalledWith({ id: "42" });
    });
  });

  describe("실패 경로", () => {
    it("mutate 실패 시 error를 저장하고 isError를 true로 만든다", async () => {
      const err = apiError("500", "서버 다운");
      const fn = vi
        .fn<() => Promise<ApiResponse<{ id: string }>>>()
        .mockRejectedValue(err);

      const { result } = renderHook(() => useMutation(fn));

      await act(async () => {
        await expect(result.current.mutate()).rejects.toBe(err);
      });

      expect(result.current.error).toEqual(err);
      expect(result.current.isError).toBe(true);
      expect(result.current.data).toBeNull();
    });

    it("실패 시 onError와 onSettled(null, error)를 호출한다", async () => {
      const onError = vi.fn();
      const onSettled = vi.fn();
      const err = apiError("400", "검증 실패");
      const fn = vi
        .fn<() => Promise<ApiResponse<{ id: string }>>>()
        .mockRejectedValue(err);

      const { result } = renderHook(() =>
        useMutation(fn, { onError, onSettled }),
      );

      await act(async () => {
        await expect(result.current.mutate()).rejects.toBe(err);
      });

      expect(onError).toHaveBeenCalledWith(err);
      expect(onSettled).toHaveBeenCalledWith(null, err);
    });
  });

  describe("reset", () => {
    it("reset 호출 시 data·error·loading을 모두 초기화한다", async () => {
      const fn = vi
        .fn<() => Promise<ApiResponse<{ id: string }>>>()
        .mockResolvedValue(okResponse({ id: "x" }));

      const { result } = renderHook(() => useMutation(fn));

      await act(async () => {
        await result.current.mutate();
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });
  });
});
