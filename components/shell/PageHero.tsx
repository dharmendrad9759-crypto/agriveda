"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import AppLink from "@/components/ui/AppLink";
import { AV } from "@/lib/design/tokens";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: LucideIcon;
  action?: { label: string; href: string };
  children?: ReactNode;
}

export default function PageHero({ title, subtitle, badge, icon: Icon, action, children }: PageHeroProps) {
  return (
    <div className="av-hero mb-5 p-5 lg:mb-6 lg:flex lg:items-center lg:justify-between lg:gap-6 lg:p-6">
      <div className="min-w-0 flex-1">
        {badge && (
          <span className="mb-2 inline-flex items-center rounded-md border border-[var(--av-accent)]/25 bg-[var(--av-accent-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--av-accent)]">
            {badge}
          </span>
        )}
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--av-accent-soft)] text-[var(--av-accent)]">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div>
            <h1 className={AV.pageTitle}>{title}</h1>
            {subtitle && <p className={AV.pageSubtitle}>{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
      {action && (
        <AppLink href={action.href} className={`mt-4 shrink-0 lg:mt-0 ${AV.btnPrimarySm}`}>
          {action.label}
        </AppLink>
      )}
    </div>
  );
}
