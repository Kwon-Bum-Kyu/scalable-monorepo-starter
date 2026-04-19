import type { Meta, StoryObj } from "@storybook/react";
import { Grid, GridItem } from "@repo/ui";

const meta: Meta<typeof Grid> = {
  title: "L2/Grid",
  component: Grid,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const TwelveColumns: Story = {
  render: () => (
    <Grid>
      {Array.from({ length: 12 }, (_, i) => (
        <GridItem
          key={i}
          className="rounded bg-secondary p-4 text-center text-secondary-foreground"
        >
          {i + 1}
        </GridItem>
      ))}
    </Grid>
  ),
};
