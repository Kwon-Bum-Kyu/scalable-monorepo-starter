import type { ExampleStatus } from "@repo/shared-types";

export interface ExampleFormState {
  title: string;
  description: string;
  status: ExampleStatus;
}

export const EMPTY_EXAMPLE_FORM: ExampleFormState = {
  title: "",
  description: "",
  status: "draft",
};

export const STATUS_OPTIONS: ExampleStatus[] = ["draft", "published"];
