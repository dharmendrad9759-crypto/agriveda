"use client";

import AppLink from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Crown, MessageCircle, Leaf } from "lucide-react";
import { SHELL_NAV, isNavActive } from "@/lib/shell/nav";
import { BRAND } from "@/lib/brand";
import { APP_VERSION } from "@/lib/appMeta";

export default function AppSidebar() {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <aside className="av-sidebar hidden lg:flex lg:w-60 xl:w-64 lg:shrink-0 lg:flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-[var(--av-border)] px-4">
        <AppLink href="/" className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-[var(--av-accent)]" />
          <span className="text-sm font-black tracking-wider text-[var(--av-text-primary)]">
            {BRAND.toUpperCase()}
          </span>
        </AppLink>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-hide" aria-label="Main navigation">
        <ul className="space-y-0.5">
          {SHELL_NAV.map((item) => {
            const active = isNavActive(item, pathname);
            const Icon = item.icon;
            return (
              <li key={item.href + item.label}>
                <AppLink
                  href={item.href}
                  className={`relative flex min-h-[40px] items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors duration-150 ${
                    active
                      ? "text-[var(--av-accent)]"
                      : "text-[var(--av-text-muted)] hover:bg-[var(--av-surface-muted)] hover:text-[var(--av-text-primary)]"
                  }`}
                >
                  {active && !reduced && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-[var(--av-accent-soft)] ring-1 ring-[var(--av-accent)]/25"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  {active && reduced && (
                    <span className="absolute inset-0 rounded-lg bg-[var(--av-accent-soft)] ring-1 ring-[var(--av-accent)]/25" />
                  )}
                  <Icon className="relative z-10 h-4 w-4 shrink-0" />
                  <span className="relative z-10 truncate">{item.label}</span>
                </AppLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-2 border-t border-[var(--av-border)] p-3">
        <AppLink
          href="/settings/upgrade"
          className="block rounded-xl border border-[var(--av-accent)]/30 bg-[var(--av-accent-soft)] p-3 transition hover:border-[var(--av-accent)]/50"
        >
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-bold text-[var(--av-text-primary)]">Go Premium</span>
          </div>
          <p className="mt-1 text-[10px] leading-snug text-[var(--av-text-muted)]">
            Advanced tools & expert support
          </p>
          <span className="mt-2 inline-block text-[10px] font-bold text-[var(--av-accent)]">Upgrade Now →</span>
        </AppLink>

        <AppLink
          href="/kisan-saathi"
          className="flex items-center gap-2 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-muted)] px-3 py-2 text-[10px] font-medium text-[var(--av-text-secondary)] hover:border-[var(--av-accent)]/30"
        >
          <MessageCircle className="h-4 w-4 text-[var(--av-accent)]" />
          Need Help? AI Assistant
        </AppLink>

        <p className="px-1 text-[9px] text-[var(--av-text-muted)]">v{APP_VERSION} · Built for farmers</p>
      </div>
    </aside>
  );
}
