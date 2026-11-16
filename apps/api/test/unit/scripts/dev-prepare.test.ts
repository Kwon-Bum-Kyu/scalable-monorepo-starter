import { describe, expect, it, vi } from "vitest";

import { prepareDev } from "../../../scripts/dev-prepare.mjs";

type Run = (
  command: string,
  args: string[],
  options?: { stdio?: "ignore" | "inherit" },
) => Promise<{ code: number }>;

describe("prepareDev", () => {
  it("개발 준비가 SKIP_DEV_BOOTSTRAP이 1일 때 외부 명령을 실행하지 않는다", async () => {
    const run = vi.fn<Run>();

    await prepareDev({ env: { SKIP_DEV_BOOTSTRAP: "1" }, run, log: () => {} });

    expect(run).not.toHaveBeenCalled();
  });

  it("개발 준비가 Postgres 대기에 실패할 때 마이그레이션을 실행할 수 없다", async () => {
    const run = vi
      .fn<Run>()
      .mockResolvedValueOnce({ code: 0 })
      .mockResolvedValue({ code: 1 });

    await expect(
      prepareDev({ env: {}, run, log: () => {}, sleep: async () => {} }),
    ).rejects.toThrow(/Postgres.*준비/);
    expect(run).not.toHaveBeenCalledWith("npx", [
      "prisma",
      "migrate",
      "deploy",
    ]);
  });

  it("개발 준비가 정상일 때 Docker 기동, 대기, 마이그레이션, Prisma Client 생성을 순서대로 실행한다", async () => {
    const run = vi.fn<Run>().mockResolvedValue({ code: 0 });

    await prepareDev({ env: {}, run, log: () => {} });

    expect(run.mock.calls.map(([command, args]) => [command, ...args])).toEqual(
      [
        ["docker", "compose", "up", "-d"],
        [
          "docker",
          "compose",
          "exec",
          "-T",
          "db",
          "pg_isready",
          "-U",
          "postgres",
          "-d",
          "myapp",
        ],
        ["npx", "prisma", "migrate", "deploy"],
        ["npx", "prisma", "generate"],
      ],
    );
  });
});
