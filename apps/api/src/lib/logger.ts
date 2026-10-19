import { pino } from "pino";

import { env } from "../config/env";
import { buildLoggerOptions } from "../config/logger";

/**
 * 애플리케이션 단일 pino 로거 인스턴스.
 * env.LOG_LEVEL, env.LOG_PRETTY 기반으로 옵션이 결정된다.
 */
export const logger = pino(
  buildLoggerOptions({ level: env.LOG_LEVEL, pretty: env.LOG_PRETTY }),
);

export type Logger = typeof logger;
