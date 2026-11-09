/**
 * 홈 히어로용 /guide 첫 화면 캡처 (결과: src/assets/hero-guide.png, 2560x1600).
 * 사전 조건:
 *   1. web 개발 서버가 http://localhost:3000 에서 실행 중이다 (turbo run dev --filter=web).
 *   2. chromium이 설치되어 있다 (npx playwright install chromium).
 *   3. 새 /guide 구현 뒤에 실행한다. 가이드가 바뀌면 다시 실행한다.
 * 실행: npm run capture:hero -w web
 */
import { statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const BASE_URL = "http://localhost:3000";
const OUTPUT = resolve(dirname(fileURLToPath(import.meta.url)), "../src/assets/hero-guide.png");

let browser;
try {
  browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/guide`, { waitUntil: "networkidle" });
  await page.evaluate("document.fonts.ready");
  // 사이드바 "컬러" 클릭과 같은 위치(#color 위 16px)로 옮기고, 현재 항목이 "컬러"가 될 때까지 기다린다
  await page.evaluate('document.getElementById("color").scrollIntoView({ block: "start" })');
  await page.locator('nav[aria-label="가이드 섹션"] button[aria-current="true"]', { hasText: "컬러" }).waitFor({ timeout: 5000 });
  await page.screenshot({ path: OUTPUT, animations: "disabled" });
  process.stdout.write(`${OUTPUT} (${statSync(OUTPUT).size} bytes)\n`);
} catch (error) {
  process.stderr.write(
    `web 개발 서버(${BASE_URL})에 연결하지 못했다. turbo run dev --filter=web 실행 후 다시 시도한다.\n${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
} finally {
  await browser?.close();
}
