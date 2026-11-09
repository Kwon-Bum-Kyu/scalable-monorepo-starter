import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useActiveSection } from "@/hooks/useActiveSection";

const IDS = ["a", "b", "c"] as const;
type Callback = (entries: Array<Partial<IntersectionObserverEntry>>) => void;

let callback: Callback;
const disconnect = vi.fn();
const observed: Element[] = [];

beforeEach(() => {
  observed.length = 0;
  disconnect.mockClear();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: Callback) {
        callback = cb;
      }
      observe = (el: Element) => observed.push(el);
      disconnect = disconnect;
    },
  );
  IDS.forEach((id) => {
    const el = document.createElement("section");
    el.id = id;
    document.body.append(el);
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

const setTops = (tops: Record<string, number>) =>
  Object.entries(tops).forEach(([id, top]) => {
    document.getElementById(id)!.getBoundingClientRect = () => ({ top }) as DOMRect;
  });

describe("useActiveSection", () => {
  it("처음 렌더할 때 첫 id를 활성으로 둔다", () => {
    const { result } = renderHook(() => useActiveSection(IDS));
    expect(result.current.activeId).toBe("a");
    expect(observed).toHaveLength(3);
  });

  it("두 섹션이 한 콜백에서 함께 교차할 때 30% 선 위로 올라간 뒤 섹션을 활성으로 둔다", () => {
    const { result } = renderHook(() => useActiveSection(IDS));
    setTops({ a: -500, b: 100, c: 900 });
    act(() =>
      callback([
        { target: document.getElementById("a")!, isIntersecting: true },
        { target: document.getElementById("b")!, isIntersecting: true },
      ]),
    );
    expect(result.current.activeId).toBe("b");
  });

  it("맨 위로 돌아와 모든 섹션이 선 아래에 있을 때 첫 섹션으로 돌아간다", () => {
    const { result } = renderHook(() => useActiveSection(IDS));
    setTops({ a: -500, b: 100, c: 900 });
    act(() => callback([{ target: document.getElementById("b")!, isIntersecting: true }]));
    expect(result.current.activeId).toBe("b");
    setTops({ a: 400, b: 1200, c: 2000 });
    act(() => callback([{ target: document.getElementById("b")!, isIntersecting: false }]));
    expect(result.current.activeId).toBe("a");
  });

  it("선 위로 올라간 섹션이 없을 때 첫 섹션을 활성으로 둔다", () => {
    const { result } = renderHook(() => useActiveSection(IDS));
    setTops({ a: 300, b: 900, c: 1500 });
    act(() => callback([{ target: document.getElementById("c")!, isIntersecting: false }]));
    expect(result.current.activeId).toBe("a");
  });

  it("setActiveId를 호출할 때 즉시 반영한다", () => {
    const { result } = renderHook(() => useActiveSection(IDS));
    act(() => result.current.setActiveId("c"));
    expect(result.current.activeId).toBe("c");
  });

  it("unmount될 때 관찰을 해제한다", () => {
    const { unmount } = renderHook(() => useActiveSection(IDS));
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
