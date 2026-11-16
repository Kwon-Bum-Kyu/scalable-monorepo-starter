import path from "node:path";

import * as clack from "@clack/prompts";

import { resolveProjectName } from "../setup/projectName.mjs";
import { resolveSelection } from "../setup/resolveSelection.mjs";
import { buildSelectOptions } from "./selectOptions.mjs";
import { checkTargetDir } from "./workDir.mjs";

const MESSAGES = {
  name: "프로젝트 이름을 입력해 주세요.",
  empty: "프로젝트 이름이 비어 있습니다. 이름을 입력해 주세요.",
  invalid:
    "영문 소문자, 숫자, 하이픈으로 바꿀 수 있는 이름을 입력해 주세요. 예: my-app",
  scope: "스코프(@org/)는 지원하지 않습니다. 이름만 입력해 주세요.",
  apps: "설치할 앱을 선택해 주세요. (스페이스: 선택, 엔터: 확정)",
  noApps: "앱을 하나 이상 선택해야 합니다.",
  examples: "예제 코드(Examples CRUD)를 남겨 둘까요?",
  keepExamples: "남겨 둔다 (레이어 구조를 참고할 수 있습니다)",
  removeExamples: "제거한다",
  noApi: "api를 설치하지 않으므로 api를 호출하는 예제 화면은 제거합니다.",
};

/**
 * 프롬프트 함수 묶음. 기본값은 @clack/prompts이고 테스트는 가짜를 주입한다.
 * @typedef {{
 *   text: (opts: any) => Promise<any>,
 *   select: (opts: any) => Promise<any>,
 *   multiselect: (opts: any) => Promise<any>,
 *   isCancel: (value: unknown) => boolean,
 *   log: { error: (message: string) => void, info: (message: string) => void }
 * }} Prompts
 */

/** @param {string} npmName */
const existsMessage = (npmName) =>
  `"${npmName}" 폴더가 이미 있고 비어 있지 않습니다. 다른 이름을 입력해 주세요.`;

/** 거부 사유의 문장. 거부되지 않으면 null. */
function rejection(
  /** @type {import("../setup/projectName.mjs").ProjectNameResult} */ name,
  /** @type {string} */ cwd,
) {
  if (!name.ok)
    return name.reason === "empty" || name.reason === "scope"
      ? MESSAGES[name.reason]
      : MESSAGES.invalid;
  return checkTargetDir(path.join(cwd, name.npmName)).usable
    ? null
    : existsMessage(name.npmName);
}

/**
 * 이름을 받을 때까지 같은 질문을 다시 한다.
 * @param {{ prompts?: Prompts, cwd?: string }} [options]
 * @returns {Promise<{ cancelled: true } |
 *   { cancelled: false, displayName: string, npmName: string }>}
 */
export async function askProjectName({
  prompts = clack,
  cwd = process.cwd(),
} = {}) {
  for (;;) {
    const input = await prompts.text({
      message: MESSAGES.name,
      placeholder: "my-app",
    });
    if (prompts.isCancel(input)) return { cancelled: true };

    const name = resolveProjectName(input);
    const error = rejection(name, cwd);
    if (error !== null) {
      prompts.log.error(error);
      continue;
    }
    const { displayName, npmName } =
      /** @type {{ displayName: string, npmName: string }} */ (name);
    if (npmName !== displayName) {
      prompts.log.info(`폴더와 패키지 이름은 "${npmName}"으로 만듭니다.`);
    }
    return { cancelled: false, displayName, npmName };
  }
}

/**
 * 빈 선택은 CLI가 직접 검사해 다시 묻는다(라이브러리 오류 문장은 영어 고정).
 * 자동 포함 안내는 확정한 뒤에만 보인다.
 * @param {{ prompts?: Prompts, manifest: { apps: Array<{ id: string, label: string, hint: string, default: boolean, requires: string[] }> } }} options
 * @returns {Promise<{ cancelled: true } |
 *   { cancelled: false, apps: string[], autoAdded: string[] }>}
 */
export async function askApps({ prompts = clack, manifest }) {
  for (;;) {
    const selected = await prompts.multiselect({
      message: MESSAGES.apps,
      options: buildSelectOptions(manifest.apps),
      initialValues: manifest.apps
        .filter((app) => app.default)
        .map((app) => app.id),
      required: false,
      showInstructions: false,
    });
    if (prompts.isCancel(selected)) return { cancelled: true };
    if (selected.length === 0) {
      prompts.log.error(MESSAGES.noApps);
      continue;
    }

    const { apps, autoAdded } = resolveSelection(manifest, selected, false);
    for (const id of autoAdded) {
      // ponytail: 조사는 고정이다. 영문 id 중 받침 발음이 다른 앱이 생기면 조사 선택을 더한다.
      const requester = manifest.apps.find(
        (app) => selected.includes(app.id) && app.requires.includes(id),
      )?.id;
      prompts.log.info(
        `${requester}은 ${id}이 필요해서 ${id}을 함께 설치합니다.`,
      );
    }
    return { cancelled: false, apps, autoAdded };
  }
}

/**
 * api가 없으면 묻지 않고 제거 안내만 보인다.
 * @param {{ prompts?: Prompts, apps: string[] }} options
 * @returns {Promise<{ cancelled: true } | { cancelled: false, removeExamples: boolean }>}
 */
export async function askRemoveExamples({ prompts = clack, apps }) {
  if (!apps.includes("api")) {
    prompts.log.info(MESSAGES.noApi);
    return { cancelled: false, removeExamples: true };
  }
  const choice = await prompts.select({
    message: MESSAGES.examples,
    options: [
      { value: "keep", label: MESSAGES.keepExamples },
      { value: "remove", label: MESSAGES.removeExamples },
    ],
    initialValue: "keep",
    showInstructions: false,
  });
  if (prompts.isCancel(choice)) return { cancelled: true };
  return { cancelled: false, removeExamples: choice === "remove" };
}
