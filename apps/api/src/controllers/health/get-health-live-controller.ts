import type { RequestHandler } from "express";

import { sendSuccess } from "../../lib/http-response";
import { checkLiveness } from "../../services/health/check-liveness";

export const getHealthLiveController: RequestHandler = (
  _request,
  response,
) => {
  return sendSuccess(response, checkLiveness());
};
