import type { RequestHandler } from "express";

import { sendSuccess } from "../../lib/http-response";
import type { ListExamplesQuery } from "../../schemas/examples/list-query";
import { listExamples } from "../../services/examples/list-examples";

export const listExamplesController: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    const query = (response.locals.validated?.query ?? {}) as ListExamplesQuery;
    const result = await listExamples(query);
    return sendSuccess(response, result.items, 200, result.meta);
  } catch (error) {
    return next(error);
  }
};
