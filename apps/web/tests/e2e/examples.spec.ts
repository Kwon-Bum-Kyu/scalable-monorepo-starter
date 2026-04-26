import { expect, test } from "@playwright/test";

/**
 * Examples CRUD E2E
 *
 * 전제:
 *  - apps/api(4000) + apps/web(3000)이 가동 중이어야 한다.
 *  - playwright.config.ts의 webServer가 root `npm run dev` (web+api 필터)를
 *    자동 기동하지만, 로컬에서 `npm run dev`가 이미 떠 있으면 reuse한다.
 *  - 테스트 데이터는 "E2E Example" prefix로 격리한다.
 *
 * BE envelope 회귀(P0-1) 검증 포인트:
 *  - 목록/생성/수정/삭제 응답이 `{ success, data }` envelope으로 들어와도
 *    UI 상에서 행이 정확히 렌더링되어야 한다 (ApiClient 단일 언래핑).
 */
test.describe("Examples CRUD 흐름", () => {
  const uniqueSuffix = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  test("사용자가 example을 생성·수정·삭제할 수 있다", async ({ page }) => {
    const initialTitle = `E2E Example ${uniqueSuffix()}`;
    const updatedTitle = `${initialTitle} (updated)`;

    // 1) 목록 화면 진입
    await page.goto("/examples");

    await expect(
      page.getByRole("heading", { name: "Examples", level: 1 }),
    ).toBeVisible();

    // 2) 생성: + New Example 다이얼로그 열기
    await page.getByRole("button", { name: "+ New Example" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { name: "New Example" }),
    ).toBeVisible();

    await dialog.getByLabel(/Title/).fill(initialTitle);
    await dialog.getByLabel("Description").fill("created from e2e");
    await dialog.getByRole("button", { name: "Create" }).click();

    // 다이얼로그 닫힘 + 새 행 노출
    await expect(dialog).toBeHidden();
    const createdRow = page.getByRole("row", { name: new RegExp(initialTitle) });
    await expect(createdRow).toBeVisible();

    // 3) 수정: Edit 버튼 -> 제목 갱신 -> Save
    await page
      .getByRole("button", { name: `Edit ${initialTitle}` })
      .click();

    const editDialog = page.getByRole("dialog");
    await expect(editDialog).toBeVisible();
    await expect(
      editDialog.getByRole("heading", { name: "Edit Example" }),
    ).toBeVisible();

    const titleInput = editDialog.getByLabel(/Title/);
    await titleInput.fill(updatedTitle);
    await editDialog.getByRole("button", { name: "Save" }).click();

    await expect(editDialog).toBeHidden();
    await expect(
      page.getByRole("row", { name: new RegExp(updatedTitle) }),
    ).toBeVisible();

    // 4) 삭제: Delete 버튼 -> 행이 목록에서 사라짐
    page.once("dialog", (browserDialog) => {
      // confirm 등 native dialog가 뜨면 수락 (현재 UI엔 없지만 안전망).
      void browserDialog.accept();
    });
    await page
      .getByRole("button", { name: `Delete ${updatedTitle}` })
      .click();

    await expect(
      page.getByRole("row", { name: new RegExp(updatedTitle) }),
    ).toHaveCount(0);
  });
});
