import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import MainNav, { GitHubLink } from "@/components/layouts/MainNav";
import mainNavSource from "@/components/layouts/MainNav.tsx?raw";
import {
  type HomeScrollState,
  scrollToSection,
} from "@/utils/scrollToSection";

function HomeDestination(): React.JSX.Element {
  const { state } = useLocation();

  useEffect(() => {
    const scrollState = state as HomeScrollState | null;
    if (scrollState?.scrollTo) scrollToSection(scrollState.scrollTo);
  }, [state]);

  return <section id="quickstart">도착</section>;
}

const renderNav = (initialEntry = "/", variant: "bar" | "menu" = "bar") =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <MainNav variant={variant} />
    </MemoryRouter>,
  );

describe("MainNav", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  // >>> EXAMPLES_START
  it("[주 메뉴]가 개발 환경에서 렌더될 때 계약된 순서와 개발 항목을 표시한다", () => {
    vi.stubEnv("PROD", false);
    renderNav();

    expect(screen.getAllByRole("button")[0]).toHaveTextContent("시작하기");
    expect(screen.getAllByRole("button")[1]).toHaveTextContent("구조");
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveTextContent("디자인 시스템");
    expect(links[1]).toHaveTextContent("Examples");
    expect(screen.getByText("개발 모드")).toBeInTheDocument();
  });
  // <<< EXAMPLES_END

  it("[Examples 마커]가 MainNav에 있을 때 JSX 주석을 사용할 수 없다", () => {
    expect(mainNavSource).not.toMatch(/\{\/\*\s*(?:>>>|<<<) EXAMPLES_(?:START|END)\s*\*\/\}/);
  });

  it("[주 메뉴]가 프로덕션 환경에서 렌더될 때 개발 항목을 표시할 수 없다", () => {
    vi.stubEnv("PROD", true);
    const { container } = renderNav();

    expect(container.querySelector('a[href="/examples"]')).toBeNull();
  });

  it("[섹션 메뉴]가 홈에서 클릭될 때 해시 변경 없이 대상에 스크롤한다", async () => {
    vi.stubEnv("PROD", true);
    const user = userEvent.setup();
    document.body.insertAdjacentHTML(
      "beforeend",
      '<section id="quickstart" />',
    );
    const scrollIntoView = vi.spyOn(Element.prototype, "scrollIntoView");
    const beforeHash = window.location.hash;
    renderNav();

    await user.click(screen.getByRole("button", { name: "시작하기" }));

    await waitFor(() =>
      expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" }),
    );
    expect(window.location.hash).toBe(beforeHash);
  });

  it("[섹션 메뉴]가 홈에서 클릭될 때 한 프레임이 지난 뒤에야 스크롤한다", async () => {
    vi.stubEnv("PROD", true);
    const user = userEvent.setup();
    document.body.insertAdjacentHTML(
      "beforeend",
      '<section id="quickstart" />',
    );
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      frames.push(cb);
      return frames.length;
    });
    const scrollIntoView = vi.spyOn(Element.prototype, "scrollIntoView");
    renderNav("/", "menu");

    await user.click(screen.getByRole("button", { name: "시작하기" }));

    expect(scrollIntoView).not.toHaveBeenCalled();
    frames.forEach((cb) => cb(0));
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" });
  });

  it("[섹션 메뉴]가 다른 화면에서 클릭될 때 홈 이동 후 대상에 스크롤한다", async () => {
    vi.stubEnv("PROD", true);
    const user = userEvent.setup();
    const scrollIntoView = vi.spyOn(Element.prototype, "scrollIntoView");
    render(
      <MemoryRouter initialEntries={["/guide"]}>
        <Routes>
          <Route path="/" element={<HomeDestination />} />
          <Route path="/guide" element={<MainNav variant="bar" />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "시작하기" }));

    await waitFor(() =>
      expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" }),
    );
  });

  it("[라우트 메뉴]가 현재 가이드 화면을 가리킬 때 활성 상태를 표시한다", () => {
    vi.stubEnv("PROD", true);
    renderNav("/guide");

    expect(screen.getByRole("link", { name: "디자인 시스템" })).toHaveClass(
      "font-semibold",
    );
    expect(
      screen.getByRole("link", { name: "디자인 시스템" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("[모바일 주 메뉴]가 펼쳐질 때 구분선과 안전한 GitHub 링크를 표시한다", () => {
    vi.stubEnv("PROD", true);
    const { container } = renderNav("/", "menu");

    expect(container.querySelector('[role="presentation"]')).toHaveClass(
      "border-t",
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("[GitHub 링크]가 기본 형태로 렌더될 때 공통 포커스 링을 표시한다", () => {
    render(<GitHubLink />);

    expect(screen.getByRole("link", { name: "GitHub" })).toHaveClass(
      "rounded-sm",
      "transition-colors",
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-ring",
      "focus-visible:ring-offset-2",
    );
  });
});
