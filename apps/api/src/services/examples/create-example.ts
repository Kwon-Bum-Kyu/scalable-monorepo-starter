import type { CreateExampleInput, ExampleDetail } from "@repo/shared-types";

import { examplesRepository } from "../../repositories/examples/examples.repository";

export function createExample(
  input: CreateExampleInput,
): Promise<ExampleDetail> {
  return examplesRepository.create(input);
}
