"use client";

import AppLink from "@/components/ui/AppLink";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Crown, Leaf, Menu, MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { SHELL_NAV, isNavActive } from "@/lib/shell/nav";
import { BRAND } from "@/lib/brand";
import { APP_VERSION } from "@/lib/appMeta";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { useNavDrawer } from "./NavDrawerProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface ShellNavDrawerProps {
  open: boolean;
  onClose: () => void;
}

/** Slide-in list navigation — matches desktop sidebar (photo mockups) */
export default function ShellNavDrawer({ open, onClose }: ShellNavDrawerProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { t } = useLocale();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="presentation">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION.fast }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-label={t("shellCloseMenu")}
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-label={t("bottomNavLabel")}
            initial={reduced ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={reduced ? undefined : { x: "-100%" }}
            transition={{ duration: MOTION.normal, ease: EASE_OUT }}
            className="av-sidebar absolute left-0 top-0 flex h-full w-[min(18rem,88vw)] flex-col shadow-[var(--av-shadow-lg)]"
          >
            <div className="flex h-14 items-center justify-between border-b border-[var(--av-border)] px-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-[var(--av-accent)]" />
                <span className="text-sm font-black tracking-wider text-[var(--av-text-primary)]">
                  {BRAND.toUpperCase()}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--av-border)] text-[var(--av-text-muted)] hover:text-[var(--av-text-primary)]"
                aria-label={t("shellCloseMenu")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-hide" aria-label={t("bottomNavLabel")}>
              <ul className="space-y-0.5">
                {SHELL_NAV.map((item) => {
                  const active = isNavActive(item, pathname);
                  const Icon = item.icon;
                  const label = t(item.labelKey);
                  return (
                    <li key={item.href + item.labelKey}>
                      <AppLink
                        href={item.href}
                        onClick={onClose}
                        className={`relative flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                          active
                            ? "bg-[var(--av-accent-soft)] text-[var(--av-accent)]"
                            : "text-[var(--av-text-secondary)] hover:bg-[var(--av-surface-muted)] hover:text-[var(--av-text-primary)]"
                        }`}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-[var(--av-accent)]" />
                        )}
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{label}</span>
                      </AppLink>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="space-y-2 border-t border-[var(--av-border)] p-3">
              <AppLink
                href="/settings/upgrade"
                onClick={onClose}
                className="block rounded-xl border border-[var(--av-accent)]/30 bg-[var(--av-accent-soft)] p-3"
              >
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold text-[var(--av-text-primary)]">
                    {t("shellGoPremium")}
                  </span>
                </div>
                <p className="mt-1 text-[10px] leading-snug text-[var(--av-text-muted)]">
                  {t("shellPremiumDesc")}
                </p>
              </AppLink>

              <AppLink
                href="/kisan-saathi"
                onClick={onClose}
                className="flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-muted)] px-3 py-2 text-xs font-medium text-[var(--av-text-secondary)]"
              >
                <MessageCircle className="h-4 w-4 text-[var(--av-accent)]" />
                {t("shellNeedHelp")}
              </AppLink>

              <p className="px-1 text-[9px] text-[var(--av-text-muted)]">
                v{APP_VERSION} · {t("shellBuiltForFarmers")}
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Hamburger / brand trigger for mobile header */
export function NavDrawerTrigger({
  variant = "menu",
  className = "",
}: {
  variant?: "menu" | "brand";
  className?: string;
}) {
  const { openDrawer } = useNavDrawer();
  const { t } = useLocale();

  if (variant === "brand") {
    return (
      <button
        type="button"
        onClick={openDrawer}
        className={`flex items-center gap-1.5 text-left ${className}`}
        aria-label={t("shellOpenMenu")}
      >
        <Leaf className="h-4 w-4 text-[var(--av-accent)]" />
        <span className="text-xs font-black tracking-wide text-[var(--av-text-primary)]">{BRAND}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openDrawer}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)] hover:text-[var(--av-accent)] ${className}`}
      aria-label={t("shellOpenMenu")}
    >
      <Menu className="h-4 w-4" />
    </button>
  );
}
