import { Footer, type FooterColumn, Header, Logo, SystemIcon } from "@repo/ui";
import { Outlet, ScrollRestoration } from "react-router-dom";

import MainNav, { GitHubLink } from "@/components/layouts/MainNav";
import { AUTHOR_LINKS, REPO_URL } from "@/config/links";

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "문서",
    links: [
      { label: "README", href: `${REPO_URL}/blob/main/README.md`, external: true },
      {
        label: "CONTRIBUTING",
        href: `${REPO_URL}/blob/main/CONTRIBUTING.md`,
        external: true,
      },
      {
        label: "CLAUDE.md",
        href: `${REPO_URL}/blob/main/CLAUDE.md`,
        external: true,
      },
    ],
  },
  {
    title: "워크스페이스",
    links: ["web", "api", "storybook", "desktop"].map((name) => ({
      label: `apps/${name}`,
      href: `${REPO_URL}/tree/main/apps/${name}`,
      external: true,
      className: "font-mono",
    })),
  },
  {
    title: "저장소",
    links: [
      { label: "GitHub", href: REPO_URL, external: true },
      { label: "Issues", href: `${REPO_URL}/issues`, external: true },
    ],
  },
  {
    title: "라이선스",
    links: [
      { label: "MIT", href: `${REPO_URL}/blob/main/LICENSE`, external: true },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: AUTHOR_LINKS.linkedin, icon: "linkedin" },
  { label: "GitHub", href: AUTHOR_LINKS.github, icon: "github" },
  { label: "Email", href: AUTHOR_LINKS.email, icon: "envelope-outline" },
] as const;

function FooterBottom(): React.JSX.Element {
  return (
    <div className="flex flex-col items-start gap-2 tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-4">
      <div className="-ml-3 flex items-center gap-1">
        {SOCIAL_LINKS.map(({ label, href, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <SystemIcon name={icon} size={20} aria-hidden />
          </a>
        ))}
      </div>
      <p>© scalable-monorepo-starter contributors</p>
    </div>
  );
}

export default function RootLayout(): React.JSX.Element {
  return (
    <>
      <Header
        logo={<Logo imgClassName="w-50 desktop:w-62.5" />}
        nav={<MainNav variant="bar" />}
        actions={<GitHubLink />}
        mobileMenu={<MainNav variant="menu" />}
      />
      <main>
        <Outlet />
      </main>
      <Footer columns={FOOTER_COLUMNS} bottom={<FooterBottom />} />
      <ScrollRestoration />
    </>
  );
}
