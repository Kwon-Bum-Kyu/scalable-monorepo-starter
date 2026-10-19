import type { RequestHandler } from "express";

import type { IdParams } from "../../schemas/examples/id-params";
import { deleteExample } from "../../services/examples/delete-example";

export const deleteExampleController: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    const params = response.locals.validated?.params as IdParams;
    await deleteExample(params.id);
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
};
