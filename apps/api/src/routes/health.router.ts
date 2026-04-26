import { Router } from "express";

import { getHealthController } from "../controllers/health/get-health-controller";
import { getHealthLiveController } from "../controllers/health/get-health-live-controller";
import { getHealthReadyController } from "../controllers/health/get-health-ready-controller";

export const healthRouter = Router();

/**
 * @deprecated v0 호환 엔드포인트. 신규 클라이언트는 `/health/live` 또는
 * `/health/ready`를 사용한다. 본 핸들러는 하위 호환을 위해 유지된다.
 */
healthRouter.get("/", getHealthController);

healthRouter.get("/live", getHealthLiveController);
healthRouter.get("/ready", getHealthReadyController);
