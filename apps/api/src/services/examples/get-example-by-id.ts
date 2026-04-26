import type { ExampleDetail } from "@repo/shared-types";

import { fetchExampleOrThrow } from "./_helpers";

export function getExampleById(id: string): Promise<ExampleDetail> {
  return fetchExampleOrThrow(id);
}
