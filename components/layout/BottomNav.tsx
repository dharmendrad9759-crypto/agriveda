"use client";

import AppLink from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Home, Sprout, Users, User } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { FarmerUiKey } from "@/lib/i18n/farmer-ui";

const navItems: {
  nameKey: FarmerUiKey;
  path: string;
  icon: typeof Home;
  match: (pathname: string) => boolean;
}[] = [
  {
    nameKey: "navHome",
    path: "/",
    icon: Home,
    match: (pathname) => pathname === "/",
  },
  {
    nameKey: "navFarm",
    path: "/crops",
    icon: Sprout,
    match: (pathname) =>
      pathname.startsWith("/crops") ||
      pathname.startsWith("/crop-details") ||
      pathname.startsWith("/select-crops"),
  },
  {
    nameKey: "navCommunity",
    path: "/community",
    icon: Users,
    match: (pathname) =>
      pathname.startsWith("/community") || pathname.startsWith("/ask-query"),
  },
  {
    nameKey: "navProfile",
    path: "/profile",
    icon: User,
    match: (pathname) => pathname.startsWith("/profile"),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLocale();
  const reduced = useReducedMotion();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      aria-label={t("bottomNavLabel")}
    >
      <div className="mx-auto max-w-lg px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="agriveda-glass-strong relative flex items-center justify-around rounded-2xl border border-[var(--panel-border)] px-1 py-1.5 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.match(pathname);

            return (
              <AppLink
                key={item.path}
                href={item.path}
                className="relative flex min-h-[44px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 transition-colors duration-150"
              >
                {isActive && !reduced && (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="absolute inset-1 rounded-xl bg-emerald-500/15"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {isActive && reduced && (
                  <span className="absolute inset-1 rounded-xl bg-emerald-500/15" />
                )}
                <motion.span
                  className="relative z-10 flex flex-col items-center gap-0.5"
                  whileTap={reduced ? undefined : { scale: 0.94 }}
                  transition={{ duration: 0.15 }}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "theme-text-muted"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span
                    className={`truncate text-[9px] font-bold ${
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "theme-text-muted"
                    }`}
                  >
                    {t(item.nameKey)}
                  </span>
                </motion.span>
              </AppLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
