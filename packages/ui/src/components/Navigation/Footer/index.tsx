import { Link } from "react-router-dom";
import { FooterProps, FooterSection } from "./types";
import { cn } from "../../utils/cn";

const DEFAULT_SECTIONS: FooterSection[] = [
  {
    title: "서비스",
    links: [
      { label: "소개", href: "/about" },
      { label: "문서", href: "/docs" },
      { label: "요금제", href: "/pricing" },
    ],
  },
  {
    title: "지원",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "문의", href: "/contact" },
      { label: "릴리즈 노트", href: "/changelog" },
    ],
  },
  {
    title: "법적 고지",
    links: [
      { label: "개인정보처리방침", href: "/privacy" },
      { label: "이용약관", href: "/terms" },
    ],
  },
];

function Footer({ className, sections = DEFAULT_SECTIONS }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("w-full border-t border-(--color-border) bg-(--color-bg-secondary)", className)}>
      <div className="mx-auto max-w-screen-desktop px-4 py-8">
        <div className="flex flex-col gap-6 tablet:flex-row tablet:items-start tablet:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-base font-bold text-(--color-text-primary)">
              Logo
            </span>
            <p className="text-sm text-(--color-text-secondary)">
              확장 가능한 풀스택 모노레포 스타터 템플릿
            </p>
          </div>

          <nav aria-label="푸터 링크" className="flex flex-col gap-6 tablet:flex-row tablet:gap-8">
            {sections.map((section) => (
              <div key={section.title} className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-(--color-text-primary)">
                  {section.title}
                </span>
                <ul className="flex flex-col gap-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-(--color-text-secondary) hover:text-(--color-interactive-hover)"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-sm text-(--color-text-secondary) hover:text-(--color-interactive-hover)"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-(--color-border) pt-4">
          <p className="text-xs text-(--color-text-secondary)">
            &copy; {currentYear} scalable-monorepo-starter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
