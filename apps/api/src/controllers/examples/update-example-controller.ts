import type { RequestHandler } from "express";

import { sendSuccess } from "../../lib/http-response";
import type { IdParams } from "../../schemas/examples/id-params";
import type { UpdateExampleBody } from "../../schemas/examples/update";
import { updateExample } from "../../services/examples/update-example";

export const updateExampleController: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    const params = response.locals.validated?.params as IdParams;
    const body = response.locals.validated?.body as UpdateExampleBody;
    const result = await updateExample(params.id, body);
    return sendSuccess(response, result);
  } catch (error) {
    return next(error);
  }
};
