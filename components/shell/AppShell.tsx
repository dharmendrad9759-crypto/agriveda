"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import AppLink from "@/components/ui/AppLink";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";

interface Breadcrumb {
  label: string;
  href?: string;
}

export type AppShellVariant = "default" | "hub";

interface AppShellProps {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  hero?: ReactNode;
  actions?: ReactNode;
  className?: string;
  variant?: AppShellVariant;
  backHref?: string;
  badge?: string;
  hubPremium?: boolean;
}

export default function AppShell({
  children,
  title,
  subtitle,
  breadcrumbs,
  hero,
  actions,
  className = "",
  variant = "default",
  backHref = "/",
  badge = "AGRIVEDA",
  hubPremium = false,
}: AppShellProps) {
  const reduced = useReducedMotion();
  const Comp = reduced ? "div" : motion.div;
  const isHub = variant === "hub";

  if (isHub) {
    return (
      <div className={cn("crop-premium-page relative min-h-screen pb-28", className)}>
        <div className="relative z-10">
          <header
            className={cn(
              "sticky top-0 z-40 border-b backdrop-blur-xl",
              hubPremium
                ? "border-amber-500/15 bg-stone-950/90"
                : "border-emerald-500/15 bg-[var(--background)]/92"
            )}
          >
            <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3.5">
              <AppLink
                href={backHref}
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border active:scale-95",
                  hubPremium
                    ? "border-amber-500/25 bg-amber-500/5 text-amber-400"
                    : "border-emerald-500/25 bg-emerald-500/5 text-emerald-600"
                )}
              >
                <ArrowLeft className="h-5 w-5" />
              </AppLink>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles
                    className={cn("h-3.5 w-3.5", hubPremium ? "text-amber-500" : "text-emerald-500")}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-bold tracking-wide",
                      hubPremium ? "text-amber-500" : "text-emerald-600"
                    )}
                  >
                    {badge}
                  </span>
                </div>
                {title && (
                  <h1
                    className={cn(
                      "truncate text-base font-extrabold",
                      hubPremium ? "text-amber-50" : "text-[var(--av-text-primary)]"
                    )}
                  >
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p
                    className={cn(
                      "truncate text-[11px]",
                      hubPremium ? "text-amber-200/60" : "text-[var(--av-text-muted)]"
                    )}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </header>
          <div className="relative mx-auto max-w-lg space-y-5 px-4 py-5">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("av-page min-w-0 font-sans", className)}>
      <Comp
        {...(reduced
          ? {}
          : {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: MOTION.normal, ease: EASE_OUT },
            })}
        className="mx-auto w-full min-w-0 max-w-lg overflow-x-hidden px-3 py-3 pb-28 sm:max-w-2xl sm:px-4 sm:py-4 md:max-w-4xl lg:max-w-7xl lg:px-6 lg:pb-8 lg:pt-5"
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className={`mb-3 flex flex-wrap items-center gap-1 lg:mb-4 ${AV.micro}`}>
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-1 text-[var(--av-text-muted)]">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                {crumb.href ? (
                  <AppLink href={crumb.href} className="hover:text-[var(--av-accent)]">
                    {crumb.label}
                  </AppLink>
                ) : (
                  <span className="text-[var(--av-text-secondary)]">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {(title || subtitle || actions) && (
          <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between lg:mb-6">
            <div className="min-w-0">
              {title && <h1 className={AV.pageTitle}>{title}</h1>}
              {subtitle && <p className={AV.pageSubtitle}>{subtitle}</p>}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </header>
        )}

        {hero}

        {children}
      </Comp>
    </div>
  );
}

export function ShellCtaBanner({
  title,
  description,
  buttonLabel,
  href,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
}) {
  return (
    <div className="av-hero mt-6 p-5 lg:flex lg:items-center lg:justify-between lg:gap-6">
      <div>
        <h3 className={AV.sectionTitle}>{title}</h3>
        <p className={`mt-1 ${AV.body}`}>{description}</p>
      </div>
      <AppLink href={href} className={`mt-4 lg:mt-0 ${AV.btnPrimarySm}`}>
        {buttonLabel} →
      </AppLink>
    </div>
  );
}

export function ShellTabBar<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="mb-4 flex gap-1 overflow-x-auto border-b border-[var(--av-border)] pb-px scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`relative shrink-0 px-3 py-2.5 text-xs font-semibold transition-colors duration-150 ${
            active === tab.id
              ? "text-[var(--av-accent)]"
              : "text-[var(--av-text-muted)] hover:text-[var(--av-text-primary)]"
          }`}
        >
          {tab.label}
          {active === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[var(--av-accent)]" />
          )}
        </button>
      ))}
    </div>
  );
}
