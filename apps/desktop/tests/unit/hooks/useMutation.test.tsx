import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useMutation } from "@/hooks/useMutation";
import type { ApiError } from "@/types/api";

const apiError = (code: string, message = "실패"): ApiError => ({
  code,
  message,
  timestamp: new Date().toISOString(),
});

describe("useMutation", () => {
  describe("초기 상태", () => {
    it("mutate를 호출하기 전에는 idle 상태이다", () => {
      const fn = vi.fn().mockResolvedValue({ id: "1" });

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
        .fn<() => Promise<{ id: string }>>()
        .mockResolvedValue({ id: "created" });

      const { result } = renderHook(() => useMutation(fn));

      await act(async () => {
        await result.current.mutate();
      });

      expect(result.current.data).toEqual({ id: "created" });
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it("mutate가 데이터를 반환하고 onSuccess가 호출된다", async () => {
      const onSuccess = vi.fn();
      const onSettled = vi.fn();
      const fn = vi
        .fn()
        .mockImplementation((v: { name: string }) =>
          Promise.resolve({ echoed: v.name }),
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
      const fn = vi.fn().mockResolvedValue(null);

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
        .fn<() => Promise<{ id: string }>>()
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
        .fn<() => Promise<{ id: string }>>()
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

  describe("외부 시그니처", () => {
    it("외부 시그니처(mutate/isLoading/isError/isSuccess/onSuccess/onSettled/reset)는 변경되지 않는다", async () => {
      const fn = vi
        .fn<() => Promise<{ id: string }>>()
        .mockResolvedValue({ id: "x" });

      const { result } = renderHook(() => useMutation(fn));

      // 외부 surface 검증: 모든 키 존재 + 타입
      expect(typeof result.current.mutate).toBe("function");
      expect(typeof result.current.reset).toBe("function");
      expect(typeof result.current.isLoading).toBe("boolean");
      expect(typeof result.current.isError).toBe("boolean");
      expect(typeof result.current.isSuccess).toBe("boolean");

      const onSuccess = vi.fn();
      const onSettled = vi.fn();
      const onError = vi.fn();
      const { result: result2 } = renderHook(() =>
        useMutation(fn, { onSuccess, onSettled, onError }),
      );

      await act(async () => {
        await result2.current.mutate();
      });

      // onSuccess/onSettled가 정상 발화되어야 외부 시그니처 보존이 검증된다
      expect(onSuccess).toHaveBeenCalled();
      expect(onSettled).toHaveBeenCalled();
    });
  });

  describe("reset", () => {
    it("reset 호출 시 data·error·loading을 모두 초기화한다", async () => {
      const fn = vi
        .fn<() => Promise<{ id: string }>>()
        .mockResolvedValue({ id: "x" });

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
