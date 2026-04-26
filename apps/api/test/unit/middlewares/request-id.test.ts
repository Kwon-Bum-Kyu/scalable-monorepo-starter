import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

import {
  HEADER_REQUEST_ID,
  requestId,
} from "../../../src/middlewares/request-id";

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const makeResponse = () => {
  const setHeader = vi.fn();
  return {
    setHeader,
  } as unknown as Response & {
    setHeader: ReturnType<typeof vi.fn>;
  };
};

const makeRequest = (headers: Record<string, string | undefined> = {}) =>
  ({
    headers,
  }) as unknown as Request;

describe("requestId 미들웨어", () => {
  it("요청 헤더에 X-Request-Id가 있으면 그 값을 req.id에 보존한다", () => {
    const request = makeRequest({ "x-request-id": "abc-123" });
    const response = makeResponse();
    const next = vi.fn();

    requestId(request, response, next);

    expect(request.id).toBe("abc-123");
    expect(next).toHaveBeenCalledWith();
  });

  it("요청 헤더에 X-Request-Id가 없으면 UUID v4를 생성한다", () => {
    const request = makeRequest();
    const response = makeResponse();
    const next = vi.fn();

    requestId(request, response, next);

    expect(request.id).toMatch(UUID_V4_PATTERN);
    expect(next).toHaveBeenCalledWith();
  });

  it("응답 헤더에 X-Request-Id를 부여한다", () => {
    const request = makeRequest({ "x-request-id": "preserved-id" });
    const response = makeResponse();
    const next = vi.fn();

    requestId(request, response, next);

    expect(response.setHeader).toHaveBeenCalledWith(
      HEADER_REQUEST_ID,
      "preserved-id",
    );
  });

  it("응답 헤더의 키가 소문자 x-request-id로 통일된다", () => {
    expect(HEADER_REQUEST_ID).toBe("x-request-id");
  });

  it("X-Request-Id 헤더가 빈 문자열이면 새 UUID를 생성한다", () => {
    const request = makeRequest({ "x-request-id": "" });
    const response = makeResponse();
    const next = vi.fn();

    requestId(request, response, next);

    expect(request.id).toMatch(UUID_V4_PATTERN);
  });
});
