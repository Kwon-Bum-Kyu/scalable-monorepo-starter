import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useApi } from "@/hooks/useApi";
import type { ApiError } from "@/types/api";

const apiError = (code: string, message = "실패"): ApiError => ({
  code,
  message,
  timestamp: new Date().toISOString(),
});

describe("useApi", () => {
  describe("immediate 옵션", () => {
    it("immediate=true이면 마운트 시 자동으로 요청한다", async () => {
      const fn = vi.fn().mockResolvedValue({ id: "1" });

      const { result } = renderHook(() => useApi(fn));

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(fn).toHaveBeenCalledTimes(1);
      expect(result.current.data).toEqual({ id: "1" });
    });

    it("immediate=false이면 자동 호출하지 않는다", async () => {
      const fn = vi.fn().mockResolvedValue({ id: "2" });

      const { result } = renderHook(() => useApi(fn, { immediate: false }));

      expect(fn).not.toHaveBeenCalled();
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
    });
  });

  describe("apiFunction 시그니처", () => {
    it("apiFunction이 데이터를 직접 반환할 때 data state에 그대로 저장한다", async () => {
      const payload = { name: "김", role: "admin" };
      const fn = vi.fn().mockResolvedValue(payload);

      const { result } = renderHook(() => useApi(fn));

      await waitFor(() => expect(result.current.data).toEqual(payload));
      expect(result.current.error).toBeNull();
    });

    it("apiFunction이 throw할 때 error state에 ApiError를 저장한다", async () => {
      const err = apiError("500", "서버 오류");
      const fn = vi.fn().mockRejectedValue(err);

      const { result } = renderHook(() => useApi(fn, { immediate: false }));

      await act(async () => {
        await expect(result.current.execute()).rejects.toBe(err);
      });

      expect(result.current.error).toEqual(err);
      expect(result.current.data).toBeNull();
    });
  });

  describe("상태 전이", () => {
    it("[상태: 성공] data를 채우고 error는 null이다", async () => {
      const fn = vi.fn().mockResolvedValue({ name: "김" });

      const { result } = renderHook(() => useApi(fn));

      await waitFor(() => expect(result.current.data).toEqual({ name: "김" }));
      expect(result.current.error).toBeNull();
    });

    it("[상태: 실패] error를 채우고 data는 null이다", async () => {
      const err = apiError("500", "서버 오류");
      const fn = vi.fn().mockRejectedValue(err);

      const { result } = renderHook(() => useApi(fn, { immediate: false }));

      await act(async () => {
        await expect(result.current.execute()).rejects.toBe(err);
      });

      expect(result.current.error).toEqual(err);
      expect(result.current.data).toBeNull();
    });
  });

  describe("콜백", () => {
    it("성공 시 onSuccess를 data와 함께 호출한다", async () => {
      const onSuccess = vi.fn();
      const fn = vi.fn().mockResolvedValue({ v: 42 });

      renderHook(() => useApi(fn, { onSuccess }));

      await waitFor(() => expect(onSuccess).toHaveBeenCalledWith({ v: 42 }));
    });

    it("실패 시 onError를 ApiError와 함께 호출한다", async () => {
      const onError = vi.fn();
      const err = apiError("404", "없음");
      const fn = vi.fn().mockRejectedValue(err);

      const { result } = renderHook(() =>
        useApi(fn, { immediate: false, onError }),
      );

      await act(async () => {
        await expect(result.current.execute()).rejects.toBe(err);
      });

      expect(onError).toHaveBeenCalledWith(err);
    });
  });

  describe("reset", () => {
    it("reset 호출 시 data·error를 초기화한다", async () => {
      const fn = vi.fn().mockResolvedValue({ id: "x" });

      const { result } = renderHook(() => useApi(fn));

      await waitFor(() => expect(result.current.data).toBeDefined());

      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  describe("refetch", () => {
    it("refetch는 execute와 동일하게 동작한다", async () => {
      const fn = vi
        .fn()
        .mockResolvedValueOnce({ v: 1 })
        .mockResolvedValueOnce({ v: 2 });

      const { result } = renderHook(() => useApi(fn));

      await waitFor(() => expect(result.current.data).toEqual({ v: 1 }));

      await act(async () => {
        await result.current.refetch();
      });

      expect(result.current.data).toEqual({ v: 2 });
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});
