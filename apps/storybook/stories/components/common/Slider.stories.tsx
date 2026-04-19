import type { SliderProps } from "@repo/ui";
import { Slider } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof Slider> = {
  title: "Common/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "값의 범위를 시각적으로 선택하는 슬라이더 컴포넌트입니다.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    value: { control: "number" },
    onChange: { action: "changed" },
    disabled: { control: "boolean" },
    showValue: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

const SliderWithState = (args: SliderProps) => {
  const [value, setValue] = useState(args.value);
  return <Slider {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  args: {
    label: "Volume",
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    disabled: false,
    showValue: true,
  } as SliderProps,
  render: (args: SliderProps) => <SliderWithState {...args} />,
};
