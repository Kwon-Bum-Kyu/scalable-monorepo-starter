import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@repo/ui";

const meta: Meta<typeof Button> = {
  title: "L1/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
    },
    size: { control: "radio", options: ["default", "sm", "lg", "icon"] },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: "Button" } };
export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};
export const Destructive: Story = {
  args: { variant: "destructive", children: "Destructive" },
};
export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};
export const Disabled: Story = {
  args: { children: "Disabled", disabled: true },
};
