import { Button, ButtonGroup } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof ButtonGroup> = {
  title: "L2/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Horizontal: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">One</Button>
      <Button variant="outline">Two</Button>
      <Button variant="outline">Three</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Up</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Down</Button>
    </ButtonGroup>
  ),
};
