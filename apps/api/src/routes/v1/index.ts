import { Router } from "express";

import { systemRouter } from "./system.router";

export const v1Router = Router();

v1Router.use("/system", systemRouter);
