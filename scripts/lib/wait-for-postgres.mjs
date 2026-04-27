/**
 * @typedef {Object} ExecResult
 * @property {number} code
 *
 * @typedef {Object} WaitForPostgresOptions
 * @property {() => Promise<ExecResult>} exec   pg_isready 호출을 흉내내는 함수. code===0 이면 성공.
 * @property {number} [maxAttempts]             최대 시도 횟수. 기본 30.
 * @property {number} [intervalMs]              실패 후 다음 시도까지 대기 ms. 기본 1000.
 * @property {(message: string) => void} [log]  진행 상황 로그. 기본 무시.
 * @property {(ms: number) => Promise<void>} [sleep] 테스트용 sleep 주입. 기본 setTimeout.
 *
 * @param {WaitForPostgresOptions} options
 * @returns {Promise<{attempts: number}>} 성공한 시도 번호(1-based)
 */
export async function waitForPostgres(options) {
  const {
    exec,
    maxAttempts = 30,
    intervalMs = 1000,
    log = () => {},
    sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const result = await exec();
      if (result.code === 0) {
        return { attempts: attempt };
      }
      log(`Postgres not ready (attempt ${attempt}/${maxAttempts}, exit=${result.code})`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log(`Postgres probe error (attempt ${attempt}/${maxAttempts}): ${message}`);
    }

    if (attempt < maxAttempts) {
      await sleep(intervalMs);
    }
  }

  throw new Error(`Postgres가 ${maxAttempts}번 시도 후에도 준비되지 않았습니다.`);
}
