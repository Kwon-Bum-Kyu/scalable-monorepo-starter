import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@repo/ui";

const meta: Meta<typeof Input> = {
  title: "L1/Input",
  component: Input,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: "Text input" } };
export const Disabled: Story = {
  args: { placeholder: "Disabled", disabled: true },
};
export const Email: Story = {
  args: { type: "email", placeholder: "you@example.com" },
};
