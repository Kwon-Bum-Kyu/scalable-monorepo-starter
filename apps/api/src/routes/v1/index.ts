import { Router } from "express";

import { env } from "../../config/env";
import { isExamplesEnabled } from "../../config/examples-feature";
import { logger } from "../../lib/logger";
import { examplesRouter } from "./examples.router";
import { systemRouter } from "./system.router";

export const v1Router = Router();

v1Router.use("/system", systemRouter);

if (isExamplesEnabled(env)) {
  v1Router.use("/examples", examplesRouter);
} else {
  logger.info("examples router disabled");
}
