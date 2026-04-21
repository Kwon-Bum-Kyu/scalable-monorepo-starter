import {
  GithubBrandIcon,
  LinkedinBrandIcon,
} from "@repo/ui/components/brand-icons";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("BrandIcons", () => {
  it("GithubBrandIcon은 svg 요소로 렌더된다", () => {
    render(<GithubBrandIcon data-testid="github" />);
    const svg = screen.getByTestId("github");
    expect(svg.tagName.toLowerCase()).toBe("svg");
    expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
  });

  it("LinkedinBrandIcon은 size prop을 width·height에 반영한다", () => {
    render(<LinkedinBrandIcon size={32} data-testid="linkedin" />);
    const svg = screen.getByTestId("linkedin");
    expect(svg.getAttribute("width")).toBe("32");
    expect(svg.getAttribute("height")).toBe("32");
  });

  it("color prop이 fill에 반영된다", () => {
    render(<GithubBrandIcon color="#181717" data-testid="github" />);
    expect(screen.getByTestId("github").getAttribute("fill")).toBe("#181717");
  });
});
