import type { Meta, StoryObj } from "@storybook/react";
import { SimpleTabs } from "@repo/ui";

const meta: Meta<typeof SimpleTabs> = {
  title: "L3/SimpleTabs",
  component: SimpleTabs,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SimpleTabs>;

const items = [
  { value: "overview", label: "Overview", content: <p>Overview 내용</p> },
  { value: "usage", label: "Usage", content: <p>Usage 내용</p> },
  { value: "api", label: "API", content: <p>API 내용</p> },
];

export const Default: Story = { args: { items } };
export const WithDisabled: Story = {
  args: {
    items: [
      ...items,
      { value: "changelog", label: "Changelog", content: <p>—</p>, disabled: true },
    ],
  },
};
export const ControlledDefault: Story = {
  args: { items, defaultValue: "usage" },
};
