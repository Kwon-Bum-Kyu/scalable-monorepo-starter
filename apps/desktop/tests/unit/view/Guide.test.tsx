import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Guide from "@/view/Guide";
import { GUIDE_NAV_GROUPS, GUIDE_SECTION_IDS } from "@/view/guide/navData";

type Callback = (entries: Array<Partial<IntersectionObserverEntry>>) => void;
let observerCallback: Callback | undefined;

beforeEach(() => {
  observerCallback = undefined;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: Callback) {
        observerCallback = cb;
      }
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const SECTION_TITLES: ReadonlyArray<readonly [string, string]> = [
  ["principles", "원칙"],
  ["color", "컬러"],
  ["type", "타이포그래피"],
  ["space", "스페이싱 · 라운딩 · 그림자"],
  ["bp", "브레이크포인트"],
  ["components", "기본 컴포넌트"],
  ["concept", "공유 루트"],
  ["logos", "로고 조합 4종"],
  ["clear", "클리어 스페이스와 최소 크기"],
  ["misuse", "잘못된 사용 예"],
  ["icons", "시스템 아이콘"],
  ["files", "파일 목록"],
];

describe("Guide 페이지 - 디자인 시스템 가이드", () => {
  it("페이지 제목이 h1로 노출된다", () => {
    render(<Guide />);
    expect(screen.getByRole("heading", { level: 1, name: "디자인 시스템 가이드" })).toBeInTheDocument();
  });

  it("사이드바가 4그룹 12항목을 노출한다", () => {
    render(<Guide />);
    const nav = screen.getByRole("navigation", { name: "가이드 섹션" });
    expect(within(nav).getAllByRole("button")).toHaveLength(12);
    expect(GUIDE_NAV_GROUPS).toHaveLength(4);
  });

  it("처음에는 첫 항목이 현재 항목으로 굵게 표시된다", () => {
    render(<Guide />);
    const current = screen.getByRole("button", { name: "원칙" });
    expect(current).toHaveAttribute("aria-current", "true");
    expect(current).toHaveClass("font-semibold");
  });

  it("사이드바 항목을 클릭할 때 현재 항목이 바뀌고 해당 섹션으로 스크롤한다", async () => {
    const scroll = vi.spyOn(Element.prototype, "scrollIntoView");
    render(<Guide />);
    await userEvent.click(screen.getByRole("button", { name: "컬러" }));
    expect(screen.getByRole("button", { name: "컬러" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: "원칙" })).not.toHaveAttribute("aria-current");
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(scroll.mock.contexts[0]).toBe(document.getElementById("color"));
  });

  it("모바일 선택 메뉴가 그룹 4개를 보여 주고 값을 바꿀 때 스크롤한다", async () => {
    const scroll = vi.spyOn(Element.prototype, "scrollIntoView");
    render(<Guide />);
    await userEvent.click(screen.getByRole("combobox", { name: "가이드 섹션" }));
    expect(screen.getAllByRole("group")).toHaveLength(4);
    await userEvent.click(screen.getByRole("option", { name: "파일 목록" }));
    expect(scroll.mock.contexts[scroll.mock.contexts.length - 1]).toBe(document.getElementById("files"));
    expect(screen.getByRole("button", { name: "파일 목록" })).toHaveAttribute("aria-current", "true");
  });

  it.each(SECTION_TITLES)("섹션 %s가 제목 %s와 함께 렌더된다", (id, title) => {
    render(<Guide />);
    const section = document.getElementById(id);
    expect(section).not.toBeNull();
    expect(within(section!).getByRole("heading", { level: 2, name: title })).toBeInTheDocument();
  });

  it("섹션 id 12개가 내비 데이터와 같은 순서로 문서에 있다", () => {
    const { container } = render(<Guide />);
    const ids = Array.from(container.querySelectorAll("section[id]")).map((el) => el.id);
    expect(ids).toEqual([...GUIDE_SECTION_IDS]);
  });

  it("스크롤로 섹션이 교차할 때 현재 항목이 갱신된다", () => {
    render(<Guide />);
    const line = window.innerHeight * 0.3;
    GUIDE_SECTION_IDS.forEach((id, index) => {
      const top = id === "type" || index < GUIDE_SECTION_IDS.indexOf("type") ? line - 100 : line + 500;
      document.getElementById(id)!.getBoundingClientRect = () => ({ top }) as DOMRect;
    });
    act(() => observerCallback?.([{ target: document.getElementById("type")!, isIntersecting: true }]));
    expect(screen.getByRole("button", { name: "타이포그래피" })).toHaveAttribute("aria-current", "true");
  });

  it("견본 자리 문구와 색·글꼴 인라인 style이 없다", () => {
    const { container } = render(<Guide />);
    expect(container).not.toHaveTextContent("견본 자리");
    // Radix가 위치 계산용으로 쓰는 style은 허용하고, 색·배경·글꼴 style만 막는다
    const painted = Array.from(container.querySelectorAll("[style]")).filter((el) =>
      /color|background|font/.test(el.getAttribute("style") ?? ""),
    );
    expect(painted).toHaveLength(0);
  });
});
