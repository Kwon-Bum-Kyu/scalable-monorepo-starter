import rateLimit from "express-rate-limit";

import { rateLimitOptions } from "../config/rate-limit";

export const rateLimiter = rateLimit(rateLimitOptions);
