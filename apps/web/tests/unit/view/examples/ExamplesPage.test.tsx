import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createExample,
  deleteExample,
  fetchExamplesList,
} from "@/services/examples";
import ExamplesPage from "@/view/examples/ExamplesPage";

vi.mock("@/services/examples", () => {
  return {
    fetchExamplesList: vi.fn(),
    createExample: vi.fn(),
    updateExample: vi.fn(),
    deleteExample: vi.fn(),
  };
});

const successResponse = <T,>(data: T, requestId?: string) => ({
  data,
  message: "ok",
  success: true as const,
  timestamp: new Date().toISOString(),
  requestId,
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

describe("ExamplesPage", () => {
  beforeEach(() => {
    (fetchExamplesList as ReturnType<typeof vi.fn>).mockResolvedValue(
      successResponse(sampleItems(5)),
    );
    (createExample as ReturnType<typeof vi.fn>).mockResolvedValue(
      successResponse({
        id: "new-id",
        title: "새 예제",
        description: null,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );
    (deleteExample as ReturnType<typeof vi.fn>).mockResolvedValue(
      successResponse(null),
    );
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
      .mockResolvedValueOnce(successResponse(sampleItems(5)))
      .mockResolvedValueOnce(successResponse(sampleItems(4)));

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
});
