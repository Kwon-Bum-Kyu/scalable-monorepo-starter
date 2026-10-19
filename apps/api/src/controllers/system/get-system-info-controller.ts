import type { RequestHandler } from "express";

import { sendSuccess } from "../../lib/http-response";
import type { SystemInfoQuery } from "../../schemas/system/system-info-query-schema";
import { getSystemInfo } from "../../services/system/get-system-info";

export const getSystemInfoController: RequestHandler = (_request, response) => {
  const validatedQuery = (response.locals.validated?.query ??
    {}) as SystemInfoQuery;

  return sendSuccess(response, getSystemInfo(validatedQuery.format));
};
