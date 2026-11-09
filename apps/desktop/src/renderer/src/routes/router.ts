import { createHashRouter } from "react-router-dom";

import { routes } from "@/routes/index";

// Electron은 프로덕션에서 file:// 로 로드되므로 history API 대신 HashRouter를 사용한다.
export const router = createHashRouter(routes);
