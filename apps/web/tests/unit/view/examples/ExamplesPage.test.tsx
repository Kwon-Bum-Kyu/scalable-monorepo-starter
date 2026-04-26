import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createExample,
  deleteExample,
  fetchExamplesList,
  updateExample,
} from "@/services/examples";
import ExamplesPage from "@/view/examples/ExamplesPage";

vi.mock("@/services/examples", async () => {
  const actual = await vi.importActual<
    typeof import("@/services/examples")
  >("@/services/examples");
  return {
    ...actual,
    fetchExamplesList: vi.fn(),
    fetchExampleDetail: vi.fn(),
    createExample: vi.fn(),
    updateExample: vi.fn(),
    deleteExample: vi.fn(),
  };
});

const sampleItems = (count: number) =>
  Array.from({ length: count }).map((_, index) => ({
    id: `id-${index + 1}`,
    title: `Example ${index + 1}`,
    status: index % 2 === 0 ? "draft" : "published",
    createdAt: new Date(2026, 0, index + 1).toISOString(),
  }));

const renderPage = () =>
  render(
    <MemoryRouter>
      <ExamplesPage />
    </MemoryRouter>,
  );

const detailFixture = (overrides: Record<string, unknown> = {}) => ({
  id: "new-id",
  title: "새 예제",
  description: null,
  status: "draft",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe("ExamplesPage", () => {
  beforeEach(() => {
    (fetchExamplesList as ReturnType<typeof vi.fn>).mockResolvedValue({
      items: sampleItems(5),
    });
    (createExample as ReturnType<typeof vi.fn>).mockResolvedValue(
      detailFixture(),
    );
    (updateExample as ReturnType<typeof vi.fn>).mockResolvedValue(
      detailFixture(),
    );
    (deleteExample as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("목록 페이지가 examples 5건을 렌더링한다", async () => {
    renderPage();

    for (let i = 1; i <= 5; i++) {
      await screen.findByText(`Example ${i}`);
    }
  });

  it("[+ New Example] 클릭 시 다이얼로그가 열린다", async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByText("Example 1");
    await user.click(screen.getByRole("button", { name: /new example/i }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("title이 비어있으면 Create 버튼이 비활성된다", async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByText("Example 1");
    await user.click(screen.getByRole("button", { name: /new example/i }));

    const dialog = await screen.findByRole("dialog");
    const createBtn = within(dialog).getByRole("button", { name: /^create$/i });
    expect(createBtn).toBeDisabled();
  });

  it("삭제 확인 시 X 클릭 후 목록에서 제거된다", async () => {
    const user = userEvent.setup();
    (fetchExamplesList as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ items: sampleItems(5) })
      .mockResolvedValueOnce({ items: sampleItems(4) });

    renderPage();

    await screen.findByText("Example 5");

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[deleteButtons.length - 1]);

    await waitFor(() => {
      expect(deleteExample).toHaveBeenCalledWith("id-5");
    });

    await waitFor(() => {
      expect(screen.queryByText("Example 5")).not.toBeInTheDocument();
    });
  });

  it("에러 발생 시 토스트에 requestId 앞 8자리가 표시된다", async () => {
    (fetchExamplesList as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
      message: "조회 실패",
      code: "500",
      timestamp: new Date().toISOString(),
      requestId: "7f3a3c5b-aaaa-bbbb-cccc-dddddddddddd",
    });

    renderPage();

    const toast = await screen.findByRole("status");
    expect(toast.textContent).toContain("(req: 7f3a3c5b)");
  });

  it("마운트 시 목록이 자동 로드되고 aria-busy가 true→false로 전환된다", async () => {
    let resolveList: ((value: { items: ReturnType<typeof sampleItems> }) => void) | null = null;
    (fetchExamplesList as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveList = resolve as typeof resolveList;
        }),
    );

    renderPage();

    const region = await screen.findByRole("table");
    const section = region.closest("section");
    expect(section).not.toBeNull();
    expect(section).toHaveAttribute("aria-busy", "true");

    resolveList?.({ items: sampleItems(2) });

    await waitFor(() => {
      expect(section).toHaveAttribute("aria-busy", "false");
    });

    expect(await screen.findByText("Example 1")).toBeInTheDocument();
    expect(fetchExamplesList).toHaveBeenCalledTimes(1);
  });

  it("[+ New Example] 클릭 후 폼 제출이 성공할 때 다이얼로그가 닫히고 목록이 refetch된다", async () => {
    const user = userEvent.setup();
    (fetchExamplesList as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ items: sampleItems(2) })
      .mockResolvedValueOnce({
        items: [
          ...sampleItems(2),
          {
            id: "new-id",
            title: "새 항목",
            status: "draft",
            createdAt: new Date().toISOString(),
          },
        ],
      });

    renderPage();

    await screen.findByText("Example 1");
    await user.click(screen.getByRole("button", { name: /new example/i }));

    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByLabelText(/Title/), "새 항목");
    await user.click(within(dialog).getByRole("button", { name: /^create$/i }));

    await waitFor(() => {
      expect(createExample).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(fetchExamplesList).toHaveBeenCalledTimes(2);
    });

    expect(await screen.findByText("새 항목")).toBeInTheDocument();
  });

  it("BE가 실패 응답을 반환할 때 toast가 표시된다", async () => {
    const user = userEvent.setup();
    (createExample as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
      message: "생성 실패",
      code: "500",
      timestamp: new Date().toISOString(),
      requestId: "ab12cd34-ffff-eeee-dddd-cccccccccccc",
    });

    renderPage();
    await screen.findByText("Example 1");

    await user.click(screen.getByRole("button", { name: /new example/i }));
    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByLabelText(/Title/), "x");
    await user.click(within(dialog).getByRole("button", { name: /^create$/i }));

    const toast = await screen.findByRole("status");
    expect(toast.textContent).toContain("(req: ab12cd34)");
  });

  it("Edit 클릭 시 title/status가 prefill되고 description은 빈 문자열로 시작한다", async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByText("Example 2");

    const editButtons = screen.getAllByRole("button", { name: /^edit/i });
    await user.click(editButtons[1]);

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Edit Example")).toBeInTheDocument();

    const titleInput = within(dialog).getByLabelText(/Title/) as HTMLInputElement;
    expect(titleInput.value).toBe("Example 2");

    const descriptionInput = within(dialog).getByLabelText(
      /Description/,
    ) as HTMLTextAreaElement;
    expect(descriptionInput.value).toBe("");

    const publishedRadio = within(dialog).getByRole("radio", {
      name: /published/i,
    }) as HTMLInputElement;
    expect(publishedRadio.checked).toBe(true);
  });

  it("Delete 성공 시 목록이 refetch되어 항목이 제거된다", async () => {
    const user = userEvent.setup();
    (fetchExamplesList as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ items: sampleItems(3) })
      .mockResolvedValueOnce({ items: sampleItems(2) });

    renderPage();

    await screen.findByText("Example 3");

    const deleteButtons = screen.getAllByRole("button", { name: /^delete/i });
    await user.click(deleteButtons[deleteButtons.length - 1]);

    await waitFor(() => {
      expect(deleteExample).toHaveBeenCalledWith("id-3");
    });

    await waitFor(() => {
      expect(fetchExamplesList).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(screen.queryByText("Example 3")).not.toBeInTheDocument();
    });
  });

  it("mutation 진행 중에는 두 번째 제출이 무시된다", async () => {
    const user = userEvent.setup();

    let resolveCreate: ((value: ReturnType<typeof detailFixture>) => void) | null =
      null;
    (createExample as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveCreate = resolve as typeof resolveCreate;
        }),
    );

    renderPage();
    await screen.findByText("Example 1");

    await user.click(screen.getByRole("button", { name: /new example/i }));
    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByLabelText(/Title/), "이중 클릭");

    const submitBtn = within(dialog).getByRole("button", {
      name: /^create$/i,
    });
    await user.click(submitBtn);
    await user.click(submitBtn);

    expect(createExample).toHaveBeenCalledTimes(1);

    resolveCreate?.(detailFixture({ id: "new-id", title: "이중 클릭" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
