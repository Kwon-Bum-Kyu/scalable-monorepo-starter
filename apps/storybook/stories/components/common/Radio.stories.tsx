import type { RadioProps } from "@repo/ui";
import { Radio } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Radio> = {
  title: "Common/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "여러 옵션 중 하나를 선택하기 위한 라디오 버튼 컴포넌트입니다.",
      },
    },
  },
  argTypes: {
    label: {
      description: "라디오 버튼 옆에 표시될 텍스트 레이블입니다.",
      control: { type: "text" },
    },
    name: {
      description: "라디오 버튼 그룹을 식별하는 이름입니다.",
      control: { type: "text" },
    },
    disabled: {
      description: "라디오 버튼을 비활성화합니다.",
      control: { type: "boolean" },
    },
    checked: {
      description: "라디오 버튼의 선택 여부를 제어합니다.",
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    label: "Radio Label",
    name: "story-radio-1",
    checked: false,
    disabled: false,
    onChange: () => {},
  } as RadioProps,
};

export const Checked: Story = {
  args: {
    label: "Radio Label",
    name: "story-radio-2",
    checked: true,
    disabled: false,
    onChange: () => {},
  } as RadioProps,
};

export const Disabled: Story = {
  args: {
    label: "Radio Label",
    name: "story-radio-3",
    checked: false,
    disabled: true,
    onChange: () => {},
  } as RadioProps,
};
