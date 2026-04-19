import type { Meta, StoryObj } from "@storybook/react";
import { SystemIcon } from "@repo/ui";

const meta: Meta<typeof SystemIcon> = {
  title: "L2/SystemIcon",
  component: SystemIcon,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SystemIcon>;

export const Eye: Story = { args: { name: "eye", size: 24 } };
export const Close: Story = {
  args: { name: "close", size: 24, className: "text-destructive" },
};
export const Check: Story = { args: { name: "check-circle", size: 24 } };
export const Menu: Story = { args: { name: "bars", size: 24 } };
