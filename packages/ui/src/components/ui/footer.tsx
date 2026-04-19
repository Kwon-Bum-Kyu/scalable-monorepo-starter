import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

import { cn } from "@repo/ui/lib/utils";

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  columns: FooterColumn[];
  bottom?: React.ReactNode;
}

function Footer({
  columns,
  bottom,
  className,
  ...props
}: FooterProps): React.JSX.Element {
  return (
    <footer
      className={cn(
        "w-full border-t border-border bg-background text-foreground",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-6 py-10">
        {columns.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold">{col.title}</h3>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={`${link.label}-${link.href}`}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <RouterLink
                          to={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {link.label}
                        </RouterLink>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {bottom && (
          <div className="border-t border-border pt-6 text-xs text-muted-foreground">
            {bottom}
          </div>
        )}
      </div>
    </footer>
  );
}

export { Footer };
