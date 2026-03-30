import { Router } from "express";

import { healthRouter } from "./health.router";
import { v1Router } from "./v1";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/api/v1", v1Router);
