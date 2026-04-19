import type { Meta, StoryObj } from "@storybook/react";
import { SimpleCheckboxGroup } from "@repo/ui";

const meta: Meta<typeof SimpleCheckboxGroup> = {
  title: "L3/SimpleCheckboxGroup",
  component: SimpleCheckboxGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SimpleCheckboxGroup>;

const options = [
  { value: "email", label: "이메일 알림" },
  { value: "sms", label: "SMS 알림" },
  { value: "push", label: "푸시 알림" },
];

export const Vertical: Story = {
  args: { options, defaultValue: ["email"] },
};
export const Horizontal: Story = {
  args: {
    options,
    defaultValue: ["email", "push"],
    orientation: "horizontal",
  },
};
export const WithDisabledOption: Story = {
  args: {
    options: [...options, { value: "fax", label: "팩스", disabled: true }],
    defaultValue: ["email"],
  },
};
export const AllDisabled: Story = {
  args: { options, defaultValue: ["email"], disabled: true },
};
