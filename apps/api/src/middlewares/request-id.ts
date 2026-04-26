import { randomUUID } from "node:crypto";

import type { RequestHandler } from "express";

/**
 * 요청·응답 간 X-Request-Id 헤더 키.
 * Express 의 헤더 키는 항상 소문자로 정규화되므로 소문자 값을 단일 출처로 둔다.
 */
export const HEADER_REQUEST_ID = "x-request-id";

/**
 * 요청 추적용 ID를 부여하는 미들웨어.
 * 1. 클라이언트가 X-Request-Id 를 보내면 그 값을 그대로 사용한다.
 * 2. 비어 있거나 누락이면 UUID v4 (Node 내장 crypto.randomUUID) 를 생성한다.
 * 3. 응답 헤더 X-Request-Id 로 동일한 값을 돌려주어 추적성을 보장한다.
 */
export const requestId: RequestHandler = (request, response, next) => {
  const incoming = request.headers[HEADER_REQUEST_ID];
  const candidate = Array.isArray(incoming) ? incoming[0] : incoming;
  const id =
    typeof candidate === "string" && candidate.length > 0
      ? candidate
      : randomUUID();

  request.id = id;
  response.setHeader(HEADER_REQUEST_ID, id);

  next();
};
