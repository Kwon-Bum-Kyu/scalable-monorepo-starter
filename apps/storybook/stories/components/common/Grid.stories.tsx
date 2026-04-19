import { Grid, GridItem } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Grid> = {
  title: "Common/Grid",
  component: Grid,
  tags: ["autodocs"],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: "반응형 그리드 시스템을 제공하는 레이아웃 컴포넌트입니다.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const Default: Story = {
  render: () => (
    <Grid>
      {[...Array(12)].map((_, i) => (
        <GridItem key={i} className="bg-blue-50 text-center">
          {i + 1}
        </GridItem>
      ))}
    </Grid>
  ),
};
