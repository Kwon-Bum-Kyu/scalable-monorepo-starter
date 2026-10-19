import express from "express";
import { pino } from "pino";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { buildLoggerOptions } from "../../src/config/logger";
import { requestId } from "../../src/middlewares/request-id";
import { createRequestLogger } from "../../src/middlewares/request-logger";

interface LogRecord {
  level: number;
  msg?: string;
  req?: { id?: string; method?: string; url?: string };
  res?: { statusCode?: number };
  responseTime?: number;
  [key: string]: unknown;
}

const PINO_LEVELS = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
} as const;

const buildAppWithCapturedLogs = () => {
  const records: LogRecord[] = [];
  const stream = {
    write: (chunk: string) => {
      for (const line of chunk.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          records.push(JSON.parse(trimmed) as LogRecord);
        } catch {
          // pino-pretty 등 비-JSON 라인은 무시
        }
      }
    },
  };

  const logger = pino(
    buildLoggerOptions({ level: "info", pretty: false }),
    stream,
  );

  const app = express();
  app.use(express.json());
  app.use(requestId);
  app.use(createRequestLogger(logger));

  app.get("/ok", (_req, res) => {
    res.status(200).json({ success: true });
  });

  app.get("/missing", (_req, res) => {
    res.status(404).json({ success: false });
  });

  app.get("/boom", (_req, res) => {
    res.status(500).json({ success: false });
  });

  return { app, records };
};

describe("request-logger", () => {
  let captured: ReturnType<typeof buildAppWithCapturedLogs>;

  beforeEach(() => {
    captured = buildAppWithCapturedLogs();
  });

  afterEach(() => {
    captured.records.length = 0;
  });

  it("요청 종료 시 logger가 requestId를 포함한 컨텍스트로 기록한다", async () => {
    const response = await request(captured.app)
      .get("/ok")
      .set("X-Request-Id", "trace-001");

    expect(response.status).toBe(200);

    const completed = captured.records.find(
      (record) => record.req?.id === "trace-001",
    );
    expect(completed).toBeDefined();
    expect(completed?.req?.method).toBe("GET");
    expect(completed?.req?.url).toBe("/ok");
  });

  it("응답 종료 시 statusCode와 responseTime이 기록된다", async () => {
    await request(captured.app).get("/ok");

    const completed = captured.records.find(
      (record) => record.res?.statusCode !== undefined,
    );
    expect(completed?.res?.statusCode).toBe(200);
    expect(typeof completed?.responseTime).toBe("number");
  });

  it("4xx 응답은 warn 레벨로 기록된다", async () => {
    await request(captured.app).get("/missing");

    const completed = captured.records.find(
      (record) => record.res?.statusCode === 404,
    );
    expect(completed?.level).toBe(PINO_LEVELS.warn);
  });

  it("5xx 응답은 error 레벨로 기록된다", async () => {
    await request(captured.app).get("/boom");

    const completed = captured.records.find(
      (record) => record.res?.statusCode === 500,
    );
    expect(completed?.level).toBe(PINO_LEVELS.error);
  });

  it("2xx 응답은 info 레벨로 기록된다", async () => {
    await request(captured.app).get("/ok");

    const completed = captured.records.find(
      (record) => record.res?.statusCode === 200,
    );
    expect(completed?.level).toBe(PINO_LEVELS.info);
  });
});
