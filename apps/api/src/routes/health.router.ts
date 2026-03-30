import { Router } from "express";

import { getHealthController } from "../controllers/health/get-health-controller";

export const healthRouter = Router();

healthRouter.get("/", getHealthController);
