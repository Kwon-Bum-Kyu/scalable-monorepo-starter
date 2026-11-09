import { Toaster } from "@repo/ui";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createExample,
  deleteExample,
  fetchExampleDetail,
  fetchExamplesList,
  updateExample,
} from "@/services/examples";
import ExamplesPage from "@/view/examples/ExamplesPage";

vi.mock("@/services/examples", async () => {
  const actual = await vi.importActual<typeof import("@/services/examples")>(
    "@/services/examples",
  );
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
      <Toaster />
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
    (fetchExampleDetail as ReturnType<typeof vi.fn>).mockResolvedValue(
      detailFixture({
        id: "id-1",
        title: "Example 1",
        description: "기존 설명",
      }),
    );
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

    const deleteButtons = screen.getAllByRole("button", { name: /^delete/i });
    await user.click(deleteButtons[deleteButtons.length - 1]);
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Delete",
      }),
    );

    await waitFor(() => {
      expect(deleteExample).toHaveBeenCalledWith("id-5");
    });

    await waitFor(() => {
      expect(screen.queryByText("Example 5")).not.toBeInTheDocument();
    });
  });

  it("마운트 시 목록이 자동 로드되고 aria-busy가 true→false로 전환된다", async () => {
    type ListResolve = (value: {
      items: ReturnType<typeof sampleItems>;
    }) => void;
    let resolveList: ListResolve | null = null;
    (fetchExamplesList as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () =>
        new Promise<{ items: ReturnType<typeof sampleItems> }>((resolve) => {
          resolveList = resolve;
        }),
    );

    renderPage();

    const region = await screen.findByRole("table");
    const section = region.parentElement;
    expect(section).not.toBeNull();
    expect(section).toHaveAttribute("aria-busy", "true");

    (resolveList as ListResolve | null)?.({ items: sampleItems(2) });

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

  it("[예제 생성]이 성공한 뒤 목록 재조회에 실패할 때 생성 실패 토스트를 표시할 수 없다", async () => {
    const user = userEvent.setup();
    (fetchExamplesList as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ items: sampleItems(2) })
      .mockRejectedValueOnce(new Error("refetch failed"));

    renderPage();
    await screen.findByText("Example 1");
    await user.click(screen.getByRole("button", { name: /new example/i }));
    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByLabelText(/Title/), "새 항목");
    await user.click(within(dialog).getByRole("button", { name: /^create$/i }));

    await waitFor(() => expect(fetchExamplesList).toHaveBeenCalledTimes(2));
    expect(screen.queryByText("refetch failed")).not.toBeInTheDocument();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "예제 목록을 불러오지 못했습니다.",
    );
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

    expect(await screen.findByText(/\(req: ab12cd34\)/)).toBeInTheDocument();
  });

  it("[수정 다이얼로그]가 [설명이 있는 예제로 열릴 때] [기존 설명을 표시한다]", async () => {
    const user = userEvent.setup();
    (fetchExampleDetail as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      detailFixture({
        id: "id-2",
        title: "Example 2",
        description: "보존할 설명",
        status: "published",
      }),
    );
    renderPage();

    await screen.findByText("Example 2");

    const editButtons = screen.getAllByRole("button", { name: /^edit/i });
    await user.click(editButtons[1]);

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Edit Example")).toBeInTheDocument();

    const titleInput = within(dialog).getByLabelText(
      /Title/,
    ) as HTMLInputElement;
    expect(titleInput.value).toBe("Example 2");

    const descriptionInput = within(dialog).getByLabelText(
      /Description/,
    ) as HTMLTextAreaElement;
    await waitFor(() => expect(descriptionInput.value).toBe("보존할 설명"));

    expect(
      within(dialog).getByRole("radio", { name: /published/i }),
    ).toHaveAttribute("aria-checked", "true");
  });

  it("[수정 저장]이 [제목만 바뀔 때] [기존 설명을 그대로 전달한다]", async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByText("Example 1");
    await user.click(screen.getByRole("button", { name: "Edit Example 1" }));

    const dialog = await screen.findByRole("dialog");
    const title = within(dialog).getByLabelText(/Title/);
    await waitFor(() =>
      expect(within(dialog).getByLabelText("Description")).toHaveValue(
        "기존 설명",
      ),
    );
    await user.clear(title);
    await user.type(title, "바뀐 제목");
    await user.click(within(dialog).getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(updateExample).toHaveBeenCalledWith("id-1", {
        title: "바뀐 제목",
        description: "기존 설명",
        status: "draft",
      }),
    );
  });

  it("[수정 다이얼로그]가 [상세 조회 중일 때] [폼을 비활성화한다]", async () => {
    const user = userEvent.setup();
    (fetchExampleDetail as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      new Promise(() => {}),
    );
    renderPage();

    await screen.findByText("Example 1");
    await user.click(screen.getByRole("button", { name: "Edit Example 1" }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog.querySelector("form")).toHaveAttribute("aria-busy", "true");
    expect(within(dialog).getByLabelText(/Title/)).toBeDisabled();
    expect(within(dialog).getByLabelText("Description")).toBeDisabled();
    expect(within(dialog).getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("[수정 다이얼로그]가 [상세 조회에 실패할 때] [토스트를 표시하고 열린 채로 유지된다]", async () => {
    const user = userEvent.setup();
    (fetchExampleDetail as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
      message: "상세 조회 실패",
      code: "500",
      timestamp: "2026-11-09T00:00:00.000Z",
      requestId: "ef123456-0000-0000-0000-000000000000",
    });
    renderPage();

    await screen.findByText("Example 1");
    await user.click(screen.getByRole("button", { name: "Edit Example 1" }));

    const dialog = await screen.findByRole("dialog");
    expect(await screen.findByText(/\(req: ef123456\)/)).toBeInTheDocument();
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("[수정 다이얼로그]가 닫히는 동안 기존 제목과 입력값을 빈 생성 폼으로 바꿀 수 없다", async () => {
    const user = userEvent.setup();
    (fetchExampleDetail as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      detailFixture({
        id: "id-2",
        title: "Example 2",
        description: "기존 설명",
        status: "published",
      }),
    );
    renderPage();
    await screen.findByText("Example 2");
    await user.click(screen.getByRole("button", { name: "Edit Example 2" }));

    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));

    expect(dialog).toHaveTextContent("Edit Example");
    expect(within(dialog).getByLabelText(/Title/)).toHaveValue("Example 2");
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
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Delete",
      }),
    );

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

    type CreateResolve = (value: ReturnType<typeof detailFixture>) => void;
    let resolveCreate: CreateResolve | null = null;
    (createExample as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () =>
        new Promise<ReturnType<typeof detailFixture>>((resolve) => {
          resolveCreate = resolve;
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

    (resolveCreate as CreateResolve | null)?.(
      detailFixture({ id: "new-id", title: "이중 클릭" }),
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("머리와 표", () => {
    it("Status가 Badge 문자 값으로, 행 버튼이 제목이 담긴 aria-label로 보인다", async () => {
      renderPage();

      await screen.findByText("Example 1");

      expect(screen.getAllByText("draft")[0]).toHaveClass("rounded-full");
      expect(screen.getAllByText("published").length).toBeGreaterThan(0);
      expect(
        screen.getByRole("button", { name: "Edit Example 1" }),
      ).toHaveClass("h-11");
      expect(
        screen.getByRole("button", { name: "Delete Example 1" }),
      ).toBeInTheDocument();
    });

    it("머리에 개발 모드 전용 Badge와 정확한 설명이 보인다", async () => {
      renderPage();

      await screen.findByText("Example 1");

      expect(screen.getByText("개발 모드 전용")).toBeInTheDocument();
      expect(
        screen.getByText(
          "개발 환경에서만 열리는 CRUD 예제입니다. 배포 환경(production, staging)에서는 API가 이 기능을 마운트하지 않습니다.",
        ),
      ).toBeInTheDocument();
    });

    it("Mobile에서 표가 가로 스크롤 최소 폭 min-w-150을 가진다", async () => {
      renderPage();

      expect(await screen.findByRole("table")).toHaveClass(
        "min-w-150",
        "tablet:min-w-0",
      );
    });
  });

  describe("모바일 리듬", () => {
    it("빈 상태 Empty는 Mobile에서 버튼이 폭을 채우도록 items-stretch를 가진다", async () => {
      (fetchExamplesList as ReturnType<typeof vi.fn>).mockResolvedValue({
        items: [],
      });
      renderPage();

      const title = await screen.findByText("아직 예제가 없습니다.");

      expect(title.parentElement).toHaveClass(
        "items-stretch",
        "px-6",
        "tablet:items-center",
      );
    });

    it("머리가 Mobile 우선 여백 pt-8 gap-5를 가지고 Tablet에서 넓어진다", async () => {
      renderPage();
      await screen.findByText("Example 1");

      const heading = screen.getByRole("heading", { level: 1 });
      const header = heading.closest("header");

      expect(header).toHaveClass("gap-5", "tablet:gap-6");
      expect(header?.parentElement).toHaveClass(
        "pt-8",
        "pb-12",
        "tablet:pt-12",
        "tablet:pb-16",
      );
    });
  });

  describe("빈 상태", () => {
    it("목록이 비어 있을 때 안내와 첫 예제 만들기만 보이고 머리 버튼은 숨는다", async () => {
      (fetchExamplesList as ReturnType<typeof vi.fn>).mockResolvedValue({
        items: [],
      });
      renderPage();

      expect(
        await screen.findByText("아직 예제가 없습니다."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("첫 예제를 만들면 이 목록에 표시됩니다."),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "+ New Example" }),
      ).not.toBeInTheDocument();
    });

    it("첫 예제 만들기를 클릭하면 생성 다이얼로그가 열린다", async () => {
      const user = userEvent.setup();
      (fetchExamplesList as ReturnType<typeof vi.fn>).mockResolvedValue({
        items: [],
      });
      renderPage();

      await user.click(
        await screen.findByRole("button", { name: "첫 예제 만들기" }),
      );

      expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("로딩 상태", () => {
    it("[상태: 로딩 중] 표가 aria-busy이고 자리표시 행 3개와 안내 설명이 보인다", () => {
      (fetchExamplesList as ReturnType<typeof vi.fn>).mockReturnValue(
        new Promise(() => {}),
      );
      renderPage();

      const table = screen.getByRole("table");
      expect(table.parentElement).toHaveAttribute("aria-busy", "true");
      const bodyRows = within(table)
        .getAllByRole("row")
        .filter((row) => row.parentElement?.tagName === "TBODY");
      expect(bodyRows).toHaveLength(3);
      bodyRows.forEach((row) => expect(row).toHaveClass("h-17", "tablet:h-14"));
      expect(
        screen.getByText("예제 목록을 불러오는 중입니다."),
      ).toBeInTheDocument();
    });
  });

  describe("조회 실패", () => {
    const failure = {
      message: "조회 실패",
      code: "500",
      timestamp: "2026-11-09T00:00:00.000Z",
      requestId: "7f3a3c5b-aaaa-bbbb-cccc-dddddddddddd",
    };

    it("목록 조회에 실패하면 표 자리 안내만 보이고 토스트는 뜨지 않는다", async () => {
      (fetchExamplesList as ReturnType<typeof vi.fn>).mockRejectedValue(
        failure,
      );
      renderPage();

      const alert = await screen.findByRole("alert");
      expect(alert).toHaveTextContent("예제 목록을 불러오지 못했습니다.");
      expect(alert).toHaveTextContent(
        "잠시 후 다시 시도해 주세요. 개발 환경에서는 api 앱(포트 4000)이 실행 중인지 확인해 보세요.",
      );
      expect(screen.queryByText(/\(req: /)).not.toBeInTheDocument();
    });

    it("다시 시도를 클릭하면 목록을 다시 요청해 성공 시 행이 보인다", async () => {
      const user = userEvent.setup();
      (fetchExamplesList as ReturnType<typeof vi.fn>)
        .mockRejectedValueOnce(failure)
        .mockResolvedValueOnce({ items: sampleItems(2) });
      renderPage();

      await user.click(
        await screen.findByRole("button", { name: "다시 시도" }),
      );

      expect(await screen.findByText("Example 1")).toBeInTheDocument();
      expect(fetchExamplesList).toHaveBeenCalledTimes(2);
    });

    it("다시 시도가 또 실패해도 오류 안내가 유지되고 예외가 새지 않는다", async () => {
      const user = userEvent.setup();
      (fetchExamplesList as ReturnType<typeof vi.fn>).mockRejectedValue(
        failure,
      );
      renderPage();

      await user.click(
        await screen.findByRole("button", { name: "다시 시도" }),
      );

      await waitFor(() => expect(fetchExamplesList).toHaveBeenCalledTimes(2));
      expect(await screen.findByRole("alert")).toBeInTheDocument();
    });
  });

  describe("토스트", () => {
    it("요청 ID가 없는 생성 실패는 괄호 없이 토스트로 알리고 인라인 상자는 없다", async () => {
      const user = userEvent.setup();
      (createExample as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
        message: "생성 실패",
        code: "500",
        timestamp: "2026-11-09T00:00:00.000Z",
      });
      renderPage();
      await screen.findByText("Example 1");

      await user.click(screen.getByRole("button", { name: /new example/i }));
      const dialog = await screen.findByRole("dialog");
      await user.type(within(dialog).getByLabelText(/Title/), "x");
      await user.click(
        within(dialog).getByRole("button", { name: /^create$/i }),
      );

      const message = await screen.findByText(
        "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      );
      expect(message.textContent).not.toContain("(req");
      expect(document.querySelector(".bg-destructive")).toBeNull();
    });

    it("수정 실패 시 요청 ID 앞 8자와 함께 토스트가 뜬다", async () => {
      const user = userEvent.setup();
      (updateExample as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
        message: "수정 실패",
        code: "500",
        timestamp: "2026-11-09T00:00:00.000Z",
        requestId: "cd34ef56-0000-0000-0000-000000000000",
      });
      renderPage();
      await screen.findByText("Example 1");

      await user.click(screen.getByRole("button", { name: "Edit Example 1" }));
      const dialog = await screen.findByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: "Save" }));

      expect(await screen.findByText(/\(req: cd34ef56\)/)).toBeInTheDocument();
    });

    it("알 수 없는 형태의 삭제 실패는 알 수 없는 오류로 알린다", async () => {
      const user = userEvent.setup();
      (deleteExample as ReturnType<typeof vi.fn>).mockRejectedValueOnce("boom");
      renderPage();
      await screen.findByText("Example 1");

      await user.click(
        screen.getByRole("button", { name: "Delete Example 1" }),
      );
      await user.click(
        within(await screen.findByRole("alertdialog")).getByRole("button", {
          name: "Delete",
        }),
      );

      expect(await screen.findByText("알 수 없는 오류")).toBeInTheDocument();
    });

    it("생성이 실패한 뒤 삭제가 실패하면 두 번째 토스트에 삭제 요청 ID가 보인다", async () => {
      const user = userEvent.setup();
      (createExample as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
        message: "생성 실패",
        code: "500",
        timestamp: "2026-11-09T00:00:00.000Z",
        requestId: "11111111-0000-0000-0000-000000000000",
      });
      (deleteExample as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
        message: "삭제 실패",
        code: "500",
        timestamp: "2026-11-09T00:00:00.000Z",
        requestId: "22222222-0000-0000-0000-000000000000",
      });
      renderPage();
      await screen.findByText("Example 1");

      await user.click(screen.getByRole("button", { name: /new example/i }));
      const dialog = await screen.findByRole("dialog");
      await user.type(within(dialog).getByLabelText(/Title/), "x");
      await user.click(
        within(dialog).getByRole("button", { name: /^create$/i }),
      );
      await screen.findByText(/\(req: 11111111\)/);
      await user.click(
        within(await screen.findByRole("dialog")).getByRole("button", {
          name: "Cancel",
        }),
      );

      await user.click(
        screen.getByRole("button", { name: "Delete Example 1" }),
      );
      await user.click(
        within(await screen.findByRole("alertdialog")).getByRole("button", {
          name: "Delete",
        }),
      );

      expect(await screen.findByText(/\(req: 22222222\)/)).toBeInTheDocument();
      expect(screen.getAllByText(/\(req: 11111111\)/)).toHaveLength(1);
    });

    it("같은 오류로 다시 렌더되어도 토스트가 늘지 않는다", async () => {
      const user = userEvent.setup();
      (deleteExample as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
        message: "삭제 실패",
        code: "500",
        timestamp: "2026-11-09T00:00:00.000Z",
        requestId: "33333333-0000-0000-0000-000000000000",
      });
      renderPage();
      await screen.findByText("Example 1");

      await user.click(
        screen.getByRole("button", { name: "Delete Example 1" }),
      );
      await user.click(
        within(await screen.findByRole("alertdialog")).getByRole("button", {
          name: "Delete",
        }),
      );
      await screen.findByText(/\(req: 33333333\)/);
      await user.click(screen.getByRole("button", { name: /new example/i }));
      await screen.findByRole("dialog");

      expect(screen.getAllByText(/\(req: 33333333\)/)).toHaveLength(1);
    });
  });

  describe("삭제 확인과 포커스 복귀", () => {
    it("삭제에 성공하면 포커스가 페이지 제목 h1로 이동한다", async () => {
      const user = userEvent.setup();
      renderPage();
      await screen.findByText("Example 1");

      await user.click(
        screen.getByRole("button", { name: "Delete Example 1" }),
      );
      await user.click(
        within(await screen.findByRole("alertdialog")).getByRole("button", {
          name: "Delete",
        }),
      );

      await waitFor(() =>
        expect(screen.getByRole("heading", { level: 1 })).toHaveFocus(),
      );
    });
    it("행 Delete를 클릭하면 확인 다이얼로그가 열리고 즉시 삭제하지 않는다", async () => {
      const user = userEvent.setup();
      renderPage();
      await screen.findByText("Example 1");

      await user.click(
        screen.getByRole("button", { name: "Delete Example 1" }),
      );

      const alertDialog = await screen.findByRole("alertdialog");
      expect(alertDialog).toHaveTextContent(
        "'Example 1'를 삭제하면 되돌릴 수 없습니다.",
      );
      expect(deleteExample).not.toHaveBeenCalled();
    });

    it("삭제 확인에서 Cancel하면 행이 남고 서비스를 호출하지 않는다", async () => {
      const user = userEvent.setup();
      renderPage();
      await screen.findByText("Example 1");

      await user.click(
        screen.getByRole("button", { name: "Delete Example 1" }),
      );
      await user.click(
        within(await screen.findByRole("alertdialog")).getByRole("button", {
          name: "Cancel",
        }),
      );

      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
      expect(screen.getByText("Example 1")).toBeInTheDocument();
      expect(deleteExample).not.toHaveBeenCalled();
    });

    it("삭제 확인에서 Delete하면 서비스를 호출하고 목록을 다시 불러온다", async () => {
      const user = userEvent.setup();
      renderPage();
      await screen.findByText("Example 1");

      await user.click(
        screen.getByRole("button", { name: "Delete Example 1" }),
      );
      await user.click(
        within(await screen.findByRole("alertdialog")).getByRole("button", {
          name: "Delete",
        }),
      );

      await waitFor(() => expect(deleteExample).toHaveBeenCalledWith("id-1"));
      await waitFor(() => expect(fetchExamplesList).toHaveBeenCalledTimes(2));
    });

    it("삭제 확인을 Esc로 닫으면 포커스가 Delete 버튼으로 돌아온다", async () => {
      const user = userEvent.setup();
      renderPage();
      await screen.findByText("Example 1");
      const opener = screen.getByRole("button", { name: "Delete Example 1" });

      await user.click(opener);
      await screen.findByRole("alertdialog");
      await user.keyboard("{Escape}");

      await waitFor(() => expect(opener).toHaveFocus());
    });

    it("생성 다이얼로그를 Cancel로 닫으면 포커스가 + New Example 버튼으로 돌아온다", async () => {
      const user = userEvent.setup();
      renderPage();
      await screen.findByText("Example 1");
      const opener = screen.getByRole("button", { name: "+ New Example" });

      await user.click(opener);
      await user.click(
        within(await screen.findByRole("dialog")).getByRole("button", {
          name: "Cancel",
        }),
      );

      await waitFor(() => expect(opener).toHaveFocus());
    });

    it("수정 다이얼로그를 Esc로 닫으면 포커스가 Edit 버튼으로 돌아온다", async () => {
      const user = userEvent.setup();
      renderPage();
      await screen.findByText("Example 1");
      const opener = screen.getByRole("button", { name: "Edit Example 1" });

      await user.click(opener);
      await screen.findByRole("dialog");
      await user.keyboard("{Escape}");

      await waitFor(() => expect(opener).toHaveFocus());
    });
  });
});
