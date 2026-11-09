import { Input } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
export const Invalid: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Input {...args} aria-invalid="true" aria-describedby="input-error" />
      <p id="input-error" className="text-sm text-destructive">
        입력값을 확인해 주세요.
      </p>
    </div>
  ),
  args: { defaultValue: "Invalid value" },
};
