import { examplesRepository } from "../../repositories/examples/examples.repository";
import { fetchExampleOrThrow } from "./_helpers";

export async function deleteExample(id: string): Promise<void> {
  await fetchExampleOrThrow(id);
  await examplesRepository.delete(id);
}
