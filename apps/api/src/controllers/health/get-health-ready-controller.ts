import type { RequestHandler } from "express";

import { sendSuccess } from "../../lib/http-response";
import { checkReadiness } from "../../services/health/check-readiness";

export const getHealthReadyController: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    const result = await checkReadiness();
    return sendSuccess(response, result);
  } catch (error) {
    return next(error);
  }
};
