import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

type RequestSchemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

export function validateRequest(schemas: RequestSchemas): RequestHandler {
  return (request, response, next) => {
    try {
      response.locals.validated = {
        body: schemas.body ? schemas.body.parse(request.body) : undefined,
        params: schemas.params
          ? schemas.params.parse(request.params)
          : undefined,
        query: schemas.query ? schemas.query.parse(request.query) : undefined,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}
