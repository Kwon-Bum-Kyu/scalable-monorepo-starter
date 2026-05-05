import type { CorsOptions } from "cors";
import * as corsModule from "cors";
import type { Express, RequestHandler } from "express";
import * as expressModule from "express";

import { corsOptions } from "./config/cors";
import { interopDefault } from "./lib/interop-default";
import { errorHandler } from "./middlewares/error-handler";
import { createHelmetMiddleware } from "./middlewares/helmet";
import { notFoundHandler } from "./middlewares/not-found-handler";
import { rateLimiter } from "./middlewares/rate-limiter";
import { requestId } from "./middlewares/request-id";
import { requestLogger } from "./middlewares/request-logger";
import { apiRouter } from "./routes";

type ExpressFactory = (() => Express) & { json: () => RequestHandler };
const express = interopDefault<ExpressFactory>(expressModule);
const cors = interopDefault<(options?: CorsOptions) => RequestHandler>(corsModule);

export function createApp() {
  const app = express();

  app.use(requestId);
  app.use(requestLogger);
  app.use(createHelmetMiddleware());
  app.use(cors(corsOptions));
  app.use(rateLimiter);
  app.use(express.json());
  app.use(apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

const app = createApp();

export default app;
