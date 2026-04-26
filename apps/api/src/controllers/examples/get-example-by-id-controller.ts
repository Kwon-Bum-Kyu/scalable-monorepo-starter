import type { RequestHandler } from "express";

import { sendSuccess } from "../../lib/http-response";
import type { IdParams } from "../../schemas/examples/id-params";
import { getExampleById } from "../../services/examples/get-example-by-id";

export const getExampleByIdController: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    const params = response.locals.validated?.params as IdParams;
    const result = await getExampleById(params.id);
    return sendSuccess(response, result);
  } catch (error) {
    return next(error);
  }
};
