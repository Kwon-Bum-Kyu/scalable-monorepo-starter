import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Button, Header, Link, Logo } from "@repo/ui";

const meta: Meta<typeof Header> = {
  title: "L2/Header",
  component: Header,
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
type Story = StoryObj<typeof Header>;

const nav = (
  <>
    <Link to="/">Home</Link>
    <Link to="/guide">Guide</Link>
    <Link to="/about">About</Link>
  </>
);

const actions = (
  <>
    <Button variant="ghost" size="sm">
      로그인
    </Button>
    <Button size="sm">회원가입</Button>
  </>
);

const mobileMenu = (
  <div className="flex flex-col gap-2 p-4">
    <Link to="/">Home</Link>
    <Link to="/guide">Guide</Link>
    <Link to="/about">About</Link>
  </div>
);

export const Default: Story = {
  args: { logo: <Logo />, nav, actions },
};

export const WithMobileMenu: Story = {
  args: { logo: <Logo />, nav, actions, mobileMenu },
};

export const LogoOnly: Story = {
  args: { logo: <Logo /> },
};
