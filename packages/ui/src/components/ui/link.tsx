import { cn } from "@repo/ui/lib/utils";
import * as React from "react";
import { Link as RouterLink, type LinkProps as RouterLinkProps } from "react-router-dom";

type ExternalAnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

interface LinkBaseProps {
  to: RouterLinkProps["to"];
  className?: string;
  children?: React.ReactNode;
}

export type LinkProps =
  | (LinkBaseProps & { external?: false } & Omit<RouterLinkProps, "to" | "className" | "children">)
  | (LinkBaseProps & { external: true } & ExternalAnchorProps);

function isExternal(
  props: LinkProps
): props is LinkBaseProps & { external: true } & ExternalAnchorProps {
  return (props as { external?: boolean }).external === true;
}

function Link(props: LinkProps): React.JSX.Element {
  if (isExternal(props)) {
    const { to, className, children, external: _external, rel, target, ...rest } = props;
    const href = typeof to === "string" ? to : "#";
    return (
      <a
        href={href}
        className={cn(className)}
        target={target ?? "_blank"}
        rel={rel ?? "noopener noreferrer"}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const { to, className, children, external: _external, ...rest } = props as LinkBaseProps & {
    external?: false;
  } & Omit<RouterLinkProps, "to" | "className" | "children">;
  return (
    <RouterLink to={to} className={cn(className)} {...rest}>
      {children}
    </RouterLink>
  );
}

export { Link };
