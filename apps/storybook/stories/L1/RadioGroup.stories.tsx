import { Label, RadioGroup, RadioGroupItem } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof RadioGroup> = {
  title: "L1/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="apple">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="r-apple" value="apple" />
        <Label htmlFor="r-apple">Apple</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="r-banana" value="banana" />
        <Label htmlFor="r-banana">Banana</Label>
      </div>
    </RadioGroup>
  ),
};
