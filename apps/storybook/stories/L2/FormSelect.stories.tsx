import { FormSelect } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof FormSelect> = {
  title: "L2/FormSelect",
  component: FormSelect,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormSelect>;

const options = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
];

export const Default: Story = {
  args: { label: "Label", options, placeholder: "Select" },
};
export const WithAssistive: Story = {
  args: {
    label: "Label",
    options,
    placeholder: "Select",
    assistiveText: "선택하면 안내가 표시됩니다",
  },
};
export const WithError: Story = {
  args: {
    label: "Label",
    options,
    placeholder: "Select",
    errorMessage: "필수 값입니다",
  },
};
export const Disabled: Story = {
  args: { label: "Label", options, placeholder: "Select", disabled: true },
};
