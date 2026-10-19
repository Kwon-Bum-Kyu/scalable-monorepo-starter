import { Router } from "express";

import { getSystemInfoController } from "../../controllers/system/get-system-info-controller";
import { validateRequest } from "../../middlewares/validate-request";
import { systemInfoQuerySchema } from "../../schemas/system/system-info-query-schema";

export const systemRouter = Router();

systemRouter.get(
  "/info",
  validateRequest({ query: systemInfoQuerySchema }),
  getSystemInfoController,
);
