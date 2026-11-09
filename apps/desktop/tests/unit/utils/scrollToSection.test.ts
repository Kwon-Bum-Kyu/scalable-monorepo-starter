import { afterEach, describe, expect, it, vi } from "vitest";

import { scrollToSection } from "@/utils/scrollToSection";

describe("scrollToSection", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("[섹션 스크롤]이 대상 요소가 있을 때 화면 위로 이동한다", () => {
    document.body.innerHTML = '<section id="quickstart" />';
    const scrollIntoView = vi.spyOn(Element.prototype, "scrollIntoView");

    scrollToSection("quickstart");

    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" });
  });

  it("[섹션 스크롤]이 제목 요소가 있을 때 스크롤 없이 제목에 포커스를 준다", () => {
    document.body.innerHTML =
      '<section id="quickstart"><h2 id="quickstart-title" tabindex="-1">제목</h2></section>';

    scrollToSection("quickstart");

    expect(document.getElementById("quickstart-title")).toHaveFocus();
  });

  it("[섹션 스크롤]이 대상 요소가 없을 때 URL 해시를 바꿀 수 없다", () => {
    const beforeHash = window.location.hash;

    expect(() => scrollToSection("missing")).not.toThrow();
    expect(window.location.hash).toBe(beforeHash);
  });
});
