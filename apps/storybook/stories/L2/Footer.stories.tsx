import { Footer } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";

const meta: Meta<typeof Footer> = {
  title: "L2/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Footer>;

const columns = [
  {
    title: "Workspace",
    links: [
      { label: "apps/web", href: "/apps/web", className: "font-mono" },
      { label: "apps/api", href: "/apps/api", className: "font-mono" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export const Default: Story = {
  args: { columns },
};

export const WithBottom: Story = {
  args: {
    columns,
    bottom: <span>© 2026 Scalable Monorepo Starter. All rights reserved.</span>,
  },
};

export const ColumnsOnly: Story = {
  args: { columns: columns.slice(0, 2) },
};
