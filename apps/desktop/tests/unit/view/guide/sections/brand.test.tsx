import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BRAND_FILES, LOGO_VARIANTS, MISUSE_EXAMPLES, SYSTEM_ICON_NAMES } from "@/view/guide/brandData";
import {
  ClearSpaceSection,
  ConceptSection,
  FilesSection,
  IconsSection,
  LogosSection,
  MisuseSection,
} from "@/view/guide/sections/brand";

describe("브랜드 섹션", () => {
  it("공유 루트가 심볼과 요소 4행을 렌더한다", () => {
    const { container } = render(<ConceptSection />);
    expect(screen.getByRole("img", { name: "scalable-monorepo-starter 심볼" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(5);
    expect(container.querySelectorAll("code")).toHaveLength(2);
  });

  it("로고 조합이 변형 4개를 밝은·어두운 대체 텍스트와 함께 렌더한다", () => {
    render(<LogosSection />);
    expect(screen.getAllByRole("figure")).toHaveLength(4);
    screen.getAllByRole("figure").forEach((figure) => expect(figure).toHaveClass("content-start"));
    LOGO_VARIANTS.forEach((logo) => {
      expect(screen.getByRole("img", { name: logo.lightAlt })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: logo.darkAlt })).toBeInTheDocument();
      expect(screen.getByText(logo.file)).toBeInTheDocument();
    });
  });

  it("클리어 스페이스가 고정 트랙 클래스와 최소 크기 4행을 렌더한다", () => {
    const { container } = render(<ClearSpaceSection />);
    expect(container.querySelector(".desktop\\:w-92")).not.toBeNull();
    expect(screen.getByRole("img", { name: "클리어 스페이스 도식의 심볼" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(5);
  });

  it("잘못된 사용 예가 제목 6개와 대체 텍스트가 있는 이미지를 렌더한다", () => {
    const { container } = render(<MisuseSection />);
    MISUSE_EXAMPLES.forEach((m) => expect(screen.getByRole("heading", { level: 3, name: m.title })).toBeInTheDocument());
    expect(screen.getAllByText("금지")).toHaveLength(6);
    const images = Array.from(container.querySelectorAll("img"));
    expect(images).toHaveLength(6);
    expect(images.filter((img) => img.getAttribute("alt") === "")).toHaveLength(1);
    expect(screen.getByRole("img", { name: "가로로 늘린 심볼" })).toHaveClass("h-16", "w-40");
    expect(screen.getByText("scalable-monorepo-starter")).toBeInTheDocument();
  });

  it("시스템 아이콘이 타일 3개와 이름 칩 33개를 렌더한다", () => {
    render(<IconsSection />);
    ["github", "linkedin", "envelope-outline"].forEach((name) => expect(screen.getByText(name, { selector: "code" })).toBeInTheDocument());
    expect(screen.getByText("그 밖의 SystemIcon 이름")).toBeInTheDocument();
    const list = screen.getByRole("list", { name: "SystemIcon 이름 목록" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(SYSTEM_ICON_NAMES.length);
    expect(within(list).getAllByRole("listitem")).toHaveLength(33);
  });

  it("워드마크 다시 입력하기 견본의 글자가 줄바꿈 없이 한 줄로 그려진다", () => {
    render(<MisuseSection />);
    expect(screen.getByText("scalable-monorepo-starter", { selector: "span span" })).toHaveClass("whitespace-nowrap");
  });

  it("파일 목록이 아홉 행을 렌더한다", () => {
    render(<FilesSection />);
    expect(screen.getAllByRole("row")).toHaveLength(BRAND_FILES.length + 1);
    expect(screen.getByRole("table")).toHaveClass("min-w-150");
  });
});
