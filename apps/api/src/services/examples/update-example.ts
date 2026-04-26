import type { ExampleDetail, UpdateExampleInput } from "@repo/shared-types";

import { examplesRepository } from "../../repositories/examples/examples.repository";
import { fetchExampleOrThrow } from "./_helpers";

export async function updateExample(
  id: string,
  input: UpdateExampleInput,
): Promise<ExampleDetail> {
  const existing = await fetchExampleOrThrow(id);

  const hasChange =
    input.title !== undefined ||
    input.description !== undefined ||
    input.status !== undefined;

  if (!hasChange) {
    return existing;
  }

  return examplesRepository.update(id, input);
}
