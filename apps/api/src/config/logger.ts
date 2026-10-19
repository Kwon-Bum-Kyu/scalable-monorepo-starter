import type { IncomingMessage, ServerResponse } from "node:http";

import type { LoggerOptions } from "pino";
import type { Options as PinoHttpOptions } from "pino-http";

/**
 * pino redaction paths.
 * 민감 정보가 로그에 노출되지 않도록 요청 단위로 마스킹한다.
 */
export const REDACT_PATHS = [
  "req.headers.authorization",
  "req.headers.cookie",
  "req.body.password",
  "req.body.token",
] as const;

export interface LoggerOptionsInput {
  level: string;
  pretty: boolean;
}

/**
 * env (LOG_LEVEL · LOG_PRETTY) 기반 pino 옵션 빌더.
 * pretty=true 일 때만 pino-pretty transport 를 활성화한다.
 */
export function buildLoggerOptions(input: LoggerOptionsInput): LoggerOptions {
  const options: LoggerOptions = {
    level: input.level,
    redact: {
      paths: [...REDACT_PATHS],
      censor: "[Redacted]",
    },
  };

  if (input.pretty) {
    options.transport = {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    };
  }

  return options;
}

/**
 * pino-http serializers — 요청 / 응답에서 노출할 필드 화이트리스트.
 * id 는 request-id 미들웨어가 부여한 X-Request-Id 와 동일.
 */
export const httpSerializers: PinoHttpOptions["serializers"] = {
  req: (request: IncomingMessage & { id?: string }) => ({
    id: request.id,
    method: request.method,
    url: request.url,
  }),
  res: (response: ServerResponse) => ({
    statusCode: response.statusCode,
  }),
};

/**
 * pino-http customLogLevel — HTTP 상태 코드 기반 로그 레벨 결정.
 * - 5xx 또는 에러: error
 * - 4xx: warn
 * - 그 외: info
 */
export const httpCustomLogLevel: NonNullable<
  PinoHttpOptions["customLogLevel"]
> = (_request, response, error) => {
  if (error || response.statusCode >= 500) {
    return "error";
  }
  if (response.statusCode >= 400) {
    return "warn";
  }
  return "info";
};
