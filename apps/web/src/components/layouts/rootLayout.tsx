import { Footer, type FooterColumn, Header, Logo, SystemIcon } from "@repo/ui";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const navLinks = [
  { to: "/link1", label: "Nav Link" },
  { to: "/link2", label: "Nav Link" },
  { to: "/link3", label: "Nav Link" },
];

const footerColumns: FooterColumn[] = [1, 2, 3, 4].map((n) => ({
  title: `Title ${n}`,
  links: [
    { label: `Nav Link ${n}-1`, href: "#1" },
    { label: `Nav Link ${n}-2`, href: "#2" },
    { label: `Nav Link ${n}-3`, href: "#3" },
  ],
}));

const socialIcons: {
  label: string;
  href: string;
  name: "linkedin" | "github" | "envelope-outline";
}[] = [
  {
    name: "linkedin",
    href: "https://www.linkedin.com/in/bumkyu98/",
    label: "LinkedIn",
  },
  {
    name: "github",
    href: "https://github.com/Kwon-Bum-Kyu",
    label: "GitHub",
  },
  {
    name: "envelope-outline",
    href: "mailto:missing107@gmail.com",
    label: "Email",
  },
];

const headerNav = (
  <>
    {navLinks.map((link) => (
      <Link
        key={link.to}
        to={link.to}
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        {link.label}
      </Link>
    ))}
  </>
);

const headerActions = (
  <>
    <Link
      to="/login"
      className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm"
    >
      Log in
    </Link>
    <Link
      to="/register"
      className="bg-secondary text-secondary-foreground rounded px-4 py-2 text-sm"
    >
      Register
    </Link>
  </>
);

const mobileMenu = (
  <nav aria-label="Mobile" className="flex flex-col gap-2 p-4">
    {navLinks.map((link) => (
      <Link
        key={link.to}
        to={link.to}
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        {link.label}
      </Link>
    ))}
  </nav>
);

const footerBottom = (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      {socialIcons.map((icon) => (
        <a
          key={icon.name}
          href={icon.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={icon.label}
          className="text-muted-foreground hover:text-foreground"
        >
          <SystemIcon name={icon.name} size={20} />
        </a>
      ))}
    </div>
    <span>© DEV KBK 2025</span>
  </div>
);

const RootLayout: React.FC = () => {
  return (
    <>
      <Header
        logo={<Logo />}
        nav={headerNav}
        actions={headerActions}
        mobileMenu={mobileMenu}
      />
      <Outlet />
      <Footer columns={footerColumns} bottom={footerBottom} />
    </>
  );
};

export default RootLayout;
