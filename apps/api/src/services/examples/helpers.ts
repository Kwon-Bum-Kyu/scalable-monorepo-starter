import type { ExampleDetail } from "@repo/shared-types";

import { AppError } from "../../errors/app-error";
import { examplesRepository } from "../../repositories/examples/examples.repository";

export async function fetchExampleOrThrow(id: string): Promise<ExampleDetail> {
  const found = await examplesRepository.findById(id);
  if (!found) {
    throw new AppError(
      "요청한 example을 찾을 수 없습니다.",
      404,
      "EXAMPLE_NOT_FOUND",
    );
  }
  return found;
}
