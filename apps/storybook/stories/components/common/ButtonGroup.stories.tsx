import type { ButtonGroupProps } from "@repo/ui";
import { ButtonGroup, SystemIcon } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof ButtonGroup> = {
  title: "Common/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "여러 버튼을 그룹으로 묶어주는 컨테이너 컴포넌트입니다.",
      },
    },
  },
  argTypes: {
    buttons: { control: "object" },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const TextButtons: Story = {
  args: {
    buttons: [
      { label: "First", onClick: () => alert("테스트1") },
      { label: "Second", onClick: () => alert("테스트2") },
      { label: "Third", disabled: true },
    ],
  } as ButtonGroupProps,
};

export const IconButtons: Story = {
  args: {
    buttons: [
      { label: <SystemIcon name="arrow-left" />, onClick: () => alert("Left") },
      {
        label: <SystemIcon name="arrow-right" />,
        onClick: () => alert("Right"),
      },
      {
        label: <SystemIcon name="close" />,
        onClick: () => alert("Close"),
        disabled: true,
      },
    ],
  } as ButtonGroupProps,
};
