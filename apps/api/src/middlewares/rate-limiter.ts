import type { RequestHandler } from "express";
import type { Options } from "express-rate-limit";
import * as rateLimitModule from "express-rate-limit";

import { rateLimitOptions } from "../config/rate-limit";
import { interopDefault } from "../lib/interop-default";

const rateLimit = interopDefault<(options?: Partial<Options>) => RequestHandler>(rateLimitModule);

export const rateLimiter = rateLimit(rateLimitOptions);
