"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { ChevronRight } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { AV } from "@/lib/design/tokens";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface AppShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  hero?: ReactNode;
  className?: string;
}

export default function AppShell({
  children,
  title,
  subtitle,
  breadcrumbs,
  hero,
  className = "",
}: AppShellProps) {
  const reduced = useReducedMotion();
  const Comp = reduced ? "div" : motion.div;

  return (
    <div className={`av-page font-sans ${className}`}>
      <Comp
        {...(reduced
          ? {}
          : {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: MOTION.normal, ease: EASE_OUT },
            })}
        className="mx-auto max-w-7xl px-4 py-4 pb-28 lg:px-6 lg:pb-8 lg:pt-5"
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

        {(title || subtitle) && (
          <header className="mb-4 lg:mb-6">
            {title && <h1 className={AV.pageTitle}>{title}</h1>}
            {subtitle && <p className={AV.pageSubtitle}>{subtitle}</p>}
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
