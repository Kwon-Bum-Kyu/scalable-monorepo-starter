import type { Response } from "express";
import { describe, expect, it, vi } from "vitest";

import { sendError, sendSuccess } from "../../../src/lib/http-response";

const makeResponse = () => {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  return { status, json } as unknown as Response & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
};

describe("sendSuccess", () => {
  it("data만 전달하면 success true와 data를 가진 envelope을 응답한다", () => {
    const response = makeResponse();
    sendSuccess(response, { id: "1" });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: { id: "1" },
    });
  });

  it("statusCode를 전달하면 해당 상태코드로 응답한다", () => {
    const response = makeResponse();
    sendSuccess(response, { id: "1" }, 201);

    expect(response.status).toHaveBeenCalledWith(201);
  });

  it("sendSuccess에 meta를 전달하면 응답 envelope에 meta가 포함된다", () => {
    const response = makeResponse();
    const meta = { total: 30, page: 1, pageSize: 10 };

    sendSuccess(response, [{ id: "1" }], 200, meta);

    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: [{ id: "1" }],
      meta,
    });
  });

  it("sendSuccess에 meta를 생략하면 응답 envelope에 meta 키가 포함되지 않는다", () => {
    const response = makeResponse();
    sendSuccess(response, { id: "1" });

    const body = response.json.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(body).not.toHaveProperty("meta");
  });
});

describe("sendError", () => {
  it("error와 statusCode를 전달하면 success false envelope을 응답한다", () => {
    const response = makeResponse();
    sendError(
      response,
      { code: "BAD_REQUEST", message: "잘못된 요청" },
      400,
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error: { code: "BAD_REQUEST", message: "잘못된 요청" },
    });
  });
});
