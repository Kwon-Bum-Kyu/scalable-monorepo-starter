import { type ChildProcess,spawn } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const CLI_ENTRY = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../src/cli/index.mjs",
);

export interface CliResult {
  code: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
}

const tempDirectories: string[] = [];

export function makeTempDir(prefix = "cli-flow-"): string {
  const directory = mkdtempSync(path.join(tmpdir(), prefix));
  tempDirectories.push(directory);
  return directory;
}

export function cleanupTempDirs(): void {
  for (const directory of tempDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
}

/** PATH 앞에 둘 가짜 실행 파일 폴더를 만든다. 각 스크립트는 sh 본문이다. */
export function makeFakeBin(scripts: Record<string, string>): string {
  const bin = makeTempDir("cli-bin-");
  for (const [name, body] of Object.entries(scripts)) {
    const file = path.join(bin, name);
    writeFileSync(file, `#!/bin/sh\n${body}\n`);
    chmodSync(file, 0o755);
  }
  return bin;
}

export function spawnCli(
  args: string[],
  options: { cwd: string; env?: Record<string, string> },
): { child: ChildProcess; done: Promise<CliResult> } {
  mkdirSync(options.cwd, { recursive: true });
  const child = spawn(process.execPath, [CLI_ENTRY, ...args], {
    cwd: options.cwd,
    env: { ...process.env, ...options.env },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout?.on("data", (chunk: Buffer) => (stdout += chunk.toString()));
  child.stderr?.on("data", (chunk: Buffer) => (stderr += chunk.toString()));
  const done = new Promise<CliResult>((resolve) => {
    child.on("close", (code, signal) => resolve({ code, signal, stdout, stderr }));
  });
  return { child, done };
}

export function runCli(
  args: string[],
  options: { cwd: string; env?: Record<string, string> },
): Promise<CliResult> {
  return spawnCli(args, options).done;
}

/** PATH 앞에 가짜 실행 파일 폴더를 둔 값. */
export function pathWith(bin: string): string {
  // eslint-disable-next-line turbo/no-undeclared-env-vars -- 테스트가 자식 프로세스의 PATH 앞에 가짜 실행 파일을 둔다
  return `${bin}${path.delimiter}${process.env.PATH}`;
}

/** pid 파일이 채워질 때까지 짧은 간격으로 확인한다(전체 시간 제한 있음). */
export async function waitForPid(file: string, timeoutMs = 15000): Promise<number> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (existsSync(file)) {
      const text = readFileSync(file, "utf8").trim();
      if (text !== "") return Number(text);
    }
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(`pid 파일이 생기지 않았습니다: ${file}`);
}

export function isAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/** 테스트가 끝나도 남은 프로세스를 정리한다. */
export function killQuietly(pid: number): void {
  try {
    process.kill(pid, "SIGKILL");
  } catch {
    // 이미 끝났다.
  }
}
