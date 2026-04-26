import type { RequestHandler } from "express";

import { sendSuccess } from "../../lib/http-response";
import type { CreateExampleBody } from "../../schemas/examples/create";
import { createExample } from "../../services/examples/create-example";

export const createExampleController: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    const body = response.locals.validated?.body as CreateExampleBody;
    const result = await createExample(body);
    return sendSuccess(response, result, 201);
  } catch (error) {
    return next(error);
  }
};
