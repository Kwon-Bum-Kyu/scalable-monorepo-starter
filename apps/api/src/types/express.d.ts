import type { AuthContext, RequestId } from "@repo/shared-types";

declare global {
  namespace Express {
    interface Request {
      id: RequestId;
      context?: {
        auth?: AuthContext;
      };
    }
  }
}

export {};
