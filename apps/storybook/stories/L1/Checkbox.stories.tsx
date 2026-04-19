import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, Label } from "@repo/ui";

const meta: Meta<typeof Checkbox> = {
  title: "L1/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="c1" />
      <Label htmlFor="c1">Accept terms</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="c2" defaultChecked />
      <Label htmlFor="c2">Subscribe</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="c3" disabled />
      <Label htmlFor="c3">Disabled</Label>
    </div>
  ),
};
