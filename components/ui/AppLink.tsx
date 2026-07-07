"use client";

import NextLink from "next/link";
import { useCallback, type ComponentProps, type MouseEvent } from "react";
import { hardNavigate, hrefToPath, isCapacitorNative } from "@/lib/capacitorNav";

type AppLinkProps = ComponentProps<typeof NextLink>;

function pathFromHref(href: AppLinkProps["href"]): string | null {
  if (typeof href === "string") return hrefToPath(href);
  if (href && typeof href === "object" && "pathname" in href && href.pathname) {
    const q = href.query
      ? `?${new URLSearchParams(href.query as Record<string, string>).toString()}`
      : "";
    const hash = href.hash ? `#${href.hash}` : "";
    return `${href.pathname}${q}${hash}`;
  }
  return null;
}

export default function AppLink({ href, onClick, prefetch, ...props }: AppLinkProps) {
  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      if (!isCapacitorNative()) return;

      const path = pathFromHref(href);
      if (!path) return;

      e.preventDefault();
      e.stopPropagation();
      hardNavigate(path);
    },
    [href, onClick]
  );

  return (
    <NextLink
      href={href}
      onClick={handleClick}
      prefetch={isCapacitorNative() ? false : prefetch}
      {...props}
    />
  );
}
