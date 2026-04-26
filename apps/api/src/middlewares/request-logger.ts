import type { RequestHandler } from "express";
import type { Logger } from "pino";
import { pinoHttp } from "pino-http";

import {
  httpCustomLogLevel,
  httpSerializers,
} from "../config/logger";
import { logger as defaultLogger } from "../lib/logger";

/**
 * 주어진 logger 로 pino-http 미들웨어를 생성한다.
 * - genReqId: request-id 미들웨어가 부여한 req.id 를 그대로 사용 (중복 ID 생성 방지)
 * - customLogLevel: 5xx → error, 4xx → warn, 그 외 → info
 * - serializers: 요청·응답 필드 화이트리스트
 *
 * 테스트 환경에서 logger 를 주입할 수 있도록 팩토리 형태로 노출한다.
 */
export function createRequestLogger(logger: Logger): RequestHandler {
  return pinoHttp({
    logger,
    genReqId: (request) => (request as { id?: string }).id ?? "",
    customLogLevel: httpCustomLogLevel,
    serializers: httpSerializers,
  });
}

/**
 * 기본 logger 를 사용하는 request-logger 미들웨어.
 * app.ts 등 운영 코드에서는 이 인스턴스를 등록한다.
 */
export const requestLogger: RequestHandler = createRequestLogger(defaultLogger);
