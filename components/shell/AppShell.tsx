"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import AppLink from "@/components/ui/AppLink";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";

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
  backHref,
  badge = "AGRIVEDA",
  hubPremium = false,
}: AppShellProps) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const Comp = reduced ? "div" : motion.div;
  const isHub = variant === "hub";
  const resolvedBackHref = backHref ?? "/";
  const handleBack = () => {
    // Prefer history back so "open page -> open next page -> back" behaves naturally.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    // Fallback when there is no meaningful history (fresh tab / hard navigation).
    router.push(resolvedBackHref);
  };

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
                  <button
                    type="button"
                    onClick={handleBack}
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border active:scale-95",
                      hubPremium
                        ? "border-amber-500/25 bg-amber-500/5 text-amber-400"
                        : "border-emerald-500/25 bg-emerald-500/5 text-emerald-600"
                    )}
                    aria-label="Back"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
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
        {(backHref || (breadcrumbs && breadcrumbs.length > 0)) && (
          <div className="mb-3 flex items-start gap-2 lg:mb-4">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Back"
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]/90 text-[var(--av-text-primary)] shadow-[var(--av-shadow-sm)] backdrop-blur transition hover:border-[var(--av-accent)] hover:text-[var(--av-accent)] active:scale-95"
            >
              <ArrowLeft className="h-[18px] w-[18px]" />
            </button>
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav className={`min-w-0 flex flex-wrap items-center gap-1 pt-1 ${AV.micro}`}>
                {breadcrumbs.map((crumb, i) => (
                  <span key={`${crumb.label}-${i}`} className="flex items-center gap-1 text-[var(--av-text-muted)]">
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
            ) : null}
          </div>
        )}

        {(title || subtitle || actions) && (
          <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between lg:mb-6">
            <div className="flex min-w-0 items-start gap-2.5">
              {title ? (
                <span
                  aria-hidden
                  className="mt-1.5 h-6 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600 lg:h-7"
                />
              ) : null}
              <div className="min-w-0">
                {title && <h1 className={AV.pageTitle}>{title}</h1>}
                {subtitle && <p className={AV.pageSubtitle}>{subtitle}</p>}
              </div>
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
    <div className="relative mt-4 overflow-hidden rounded-2xl border border-emerald-600/15 bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-3.5 shadow-[var(--av-shadow-sm)] dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/30">
      <span aria-hidden className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-emerald-400/15 blur-2xl" />
      <p className="relative text-[14px] font-bold leading-snug text-[var(--av-text-primary)]">{title}</p>
      <p className="relative mt-0.5 text-[13px] font-medium leading-relaxed text-[var(--av-text-secondary)]">{description}</p>
      <AppLink
        href={href}
        className="relative mt-2.5 inline-flex min-h-[40px] items-center gap-1 rounded-xl bg-[var(--av-accent)] px-3.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-[var(--av-accent-hover)] active:scale-95"
      >
        {buttonLabel}
        <ChevronRight className="h-4 w-4" />
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
    <div className="mb-4 flex gap-1 overflow-x-auto rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-1 scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`relative shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
            active === tab.id
              ? "bg-[var(--av-surface)] text-[var(--av-accent)] shadow-[var(--av-shadow-md)] ring-1 ring-[var(--av-accent-ring)]"
              : "text-[var(--av-text-muted)] hover:text-[var(--av-text-primary)]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
