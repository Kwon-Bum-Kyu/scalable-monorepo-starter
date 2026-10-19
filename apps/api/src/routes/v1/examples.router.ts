import { Router } from "express";

import { createExampleController } from "../../controllers/examples/create-example-controller";
import { deleteExampleController } from "../../controllers/examples/delete-example-controller";
import { getExampleByIdController } from "../../controllers/examples/get-example-by-id-controller";
import { listExamplesController } from "../../controllers/examples/list-examples-controller";
import { updateExampleController } from "../../controllers/examples/update-example-controller";
import { validateRequest } from "../../middlewares/validate-request";
import { createExampleSchema } from "../../schemas/examples/create";
import { idParamsSchema } from "../../schemas/examples/id-params";
import { listExamplesQuerySchema } from "../../schemas/examples/list-query";
import { updateExampleSchema } from "../../schemas/examples/update";

export const examplesRouter = Router();

examplesRouter.get(
  "/",
  validateRequest({ query: listExamplesQuerySchema }),
  listExamplesController,
);

examplesRouter.get(
  "/:id",
  validateRequest({ params: idParamsSchema }),
  getExampleByIdController,
);

examplesRouter.post(
  "/",
  validateRequest({ body: createExampleSchema }),
  createExampleController,
);

examplesRouter.patch(
  "/:id",
  validateRequest({ params: idParamsSchema, body: updateExampleSchema }),
  updateExampleController,
);

examplesRouter.delete(
  "/:id",
  validateRequest({ params: idParamsSchema }),
  deleteExampleController,
);
