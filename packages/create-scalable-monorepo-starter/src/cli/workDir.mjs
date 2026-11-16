import fs from "node:fs";
import path from "node:path";

const SIGNALS = ["SIGINT", "SIGTERM"];

// 지울 수 있는 경로는 createWorkDir가 만든 임시 폴더뿐이다.
const registered = new Set();

/**
 * 대상 폴더가 없거나 비어 있으면 쓸 수 있다.
 * @param {string} targetDir
 * @returns {{ usable: true } | { usable: false, reason: "not-empty" }}
 */
export function checkTargetDir(targetDir) {
  let entries;
  try {
    entries = fs.readdirSync(targetDir);
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT")
      return { usable: true };
    return { usable: false, reason: "not-empty" };
  }
  return entries.length === 0
    ? { usable: true }
    : { usable: false, reason: "not-empty" };
}

/**
 * 등록된 임시 폴더만 지운다. 이미 해제된 경로는 아무것도 하지 않는다.
 * @param {string} workPath
 */
export function removeWorkDir(workPath) {
  if (!registered.has(workPath)) {
    throw new Error(`등록되지 않은 경로는 지울 수 없습니다: ${workPath}`);
  }
  registered.delete(workPath);
  fs.rmSync(workPath, { recursive: true, force: true });
}

/**
 * 대상 폴더와 같은 부모에 임시 폴더를 만들고 등록한다.
 * 오류, SIGINT, SIGTERM이 모두 cleanup을 거친다.
 * @param {string} targetDir
 * @param {string} npmName
 * @returns {{ path: string, cleanup: () => void, promote: () => void }}
 */
export function createWorkDir(targetDir, npmName) {
  const target = path.resolve(targetDir);
  const workPath = fs.mkdtempSync(
    path.join(path.dirname(target), `.${npmName}.tmp-`),
  );
  registered.add(workPath);

  const onSignal = (/** @type {NodeJS.Signals} */ signal) => {
    cleanup();
    process.kill(process.pid, signal);
  };
  const detach = () => SIGNALS.forEach((s) => process.off(s, onSignal));
  SIGNALS.forEach((s) => process.once(s, onSignal));

  function cleanup() {
    detach();
    if (registered.has(workPath)) removeWorkDir(workPath);
  }

  function promote() {
    try {
      // rmdir은 비어 있지 않은 폴더에서 실패하므로 남의 파일을 지우지 않는다.
      if (fs.existsSync(target)) fs.rmdirSync(target);
      fs.renameSync(workPath, target);
    } catch (error) {
      cleanup();
      throw error;
    }
    registered.delete(workPath);
    detach();
  }

  return { path: workPath, cleanup, promote };
}
