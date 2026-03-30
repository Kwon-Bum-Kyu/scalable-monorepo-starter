import type { RequestHandler } from "express";

import { sendSuccess } from "../../lib/http-response";
import { getHealthStatus } from "../../services/health/get-health-status";

export const getHealthController: RequestHandler = (_request, response) => {
  return sendSuccess(response, getHealthStatus());
};
