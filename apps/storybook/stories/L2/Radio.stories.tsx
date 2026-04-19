import { Radio, RadioGroup } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Radio> = {
  title: "L2/Radio",
  component: Radio,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const InGroup: Story = {
  render: () => (
    <RadioGroup defaultValue="second">
      <Radio value="first" label="첫번째" />
      <Radio value="second" label="두번째" />
      <Radio value="third" label="세번째" disabled />
    </RadioGroup>
  ),
};
