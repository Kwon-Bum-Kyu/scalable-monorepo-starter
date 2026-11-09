import { Badge, cn, SystemIcon } from "@repo/ui";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { REPO_URL } from "@/config/links";
import { ROUTES } from "@/routes/paths";
import {
  type HomeScrollState,
  type HomeSectionId,
  scrollToSection,
} from "@/utils/scrollToSection";

type MainNavItem =
  | { kind: "section"; sectionId: HomeSectionId; label: string }
  | { kind: "route"; to: string; label: string; devBadge?: boolean };

export interface MainNavProps {
  variant: "bar" | "menu";
}

const BAR_ITEM_CLASS =
  "inline-flex items-center gap-2 self-stretch border-y-2 border-transparent text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const MENU_ITEM_CLASS =
  "flex min-h-11 items-center gap-2 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function GitHubLink({
  className,
}: {
  className?: string;
}): React.JSX.Element {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <SystemIcon name="github" size={16} aria-hidden />
      GitHub
    </a>
  );
}

export default function MainNav({ variant }: MainNavProps): React.JSX.Element {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const items: MainNavItem[] = [
    { kind: "section", sectionId: "quickstart", label: "시작하기" },
    { kind: "section", sectionId: "structure", label: "구조" },
    { kind: "route", to: ROUTES.guide, label: "디자인 시스템" },
  ];

  // >>> EXAMPLES_START
  if (!import.meta.env.PROD) {
    items.push({
      kind: "route",
      to: ROUTES.examples,
      label: "Examples",
      devBadge: true,
    });
  }
  // <<< EXAMPLES_END

  const itemClass = variant === "bar" ? BAR_ITEM_CLASS : MENU_ITEM_CLASS;
  const renderedItems = items.map((item) => {
    if (item.kind === "section") {
      return (
        <button
          key={item.sectionId}
          type="button"
          className={itemClass}
          onClick={() => {
            if (pathname === ROUTES.root) {
              requestAnimationFrame(() => scrollToSection(item.sectionId));
            } else {
              navigate(ROUTES.root, {
                state: { scrollTo: item.sectionId } satisfies HomeScrollState,
              });
            }
          }}
        >
          {item.label}
        </button>
      );
    }

    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          cn(
            itemClass,
            isActive &&
              (variant === "bar"
                ? "border-b-foreground font-semibold text-foreground"
                : "font-semibold"),
          )
        }
      >
        {item.label}
        {item.devBadge && <Badge>개발 모드</Badge>}
      </NavLink>
    );
  });

  if (variant === "bar") return <>{renderedItems}</>;

  return (
    <nav aria-label="주 메뉴" className="grid px-4 pb-4 pt-2">
      {renderedItems}
      <div role="presentation" className="my-2 border-t border-border" />
      <GitHubLink className={MENU_ITEM_CLASS} />
    </nav>
  );
}
