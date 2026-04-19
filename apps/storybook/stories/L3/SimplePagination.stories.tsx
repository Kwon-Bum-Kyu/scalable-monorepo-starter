import type { Meta, StoryObj } from "@storybook/react";
import { SimplePagination } from "@repo/ui";

const meta: Meta<typeof SimplePagination> = {
  title: "L3/SimplePagination",
  component: SimplePagination,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SimplePagination>;

export const FirstPage: Story = { args: { current: 1, total: 5 } };
export const MiddlePage: Story = { args: { current: 3, total: 5 } };
export const LastPage: Story = { args: { current: 5, total: 5 } };
export const SinglePage: Story = { args: { current: 1, total: 1 } };
