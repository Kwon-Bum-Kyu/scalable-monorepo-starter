import { CheckboxField } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof CheckboxField> = {
  title: "L2/CheckboxField",
  component: CheckboxField,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CheckboxField>;

export const Default: Story = { args: { label: "약관에 동의합니다" } };
export const Checked: Story = {
  args: { label: "이메일 수신 동의", defaultChecked: true },
};
export const Disabled: Story = { args: { label: "비활성화", disabled: true } };
