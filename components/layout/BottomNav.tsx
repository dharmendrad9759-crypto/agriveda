"use client";

import AppLink from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Camera, Home, Sprout, IndianRupee, User } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { softTap } from "@/lib/appEssentials";
import type { FarmerUiKey } from "@/lib/i18n/farmer-ui";
import { cn } from "@/lib/cn";

const SIDE_ITEMS: {
  labelKey: FarmerUiKey;
  path: string;
  icon: typeof Home;
  match: (pathname: string) => boolean;
}[] = [
  {
    labelKey: "navHome",
    path: "/",
    icon: Home,
    match: (pathname) => pathname === "/",
  },
  {
    labelKey: "navCrops",
    path: "/crops",
    icon: Sprout,
    match: (pathname) =>
      pathname.startsWith("/crops") ||
      pathname.startsWith("/crop-details") ||
      pathname.startsWith("/select-crops"),
  },
];

const RIGHT_ITEMS: {
  labelKey: FarmerUiKey;
  path: string;
  icon: typeof Home;
  match: (pathname: string) => boolean;
}[] = [
  {
    labelKey: "market",
    path: "/mandi",
    icon: IndianRupee,
    match: (pathname) => pathname.startsWith("/mandi"),
  },
  {
    labelKey: "navProfile",
    path: "/profile",
    icon: User,
    match: (pathname) => pathname.startsWith("/profile"),
  },
];

function NavItem({
  label,
  path,
  icon: Icon,
  isActive,
  reduced,
}: {
  label: string;
  path: string;
  icon: typeof Home;
  isActive: boolean;
  reduced: boolean | null;
}) {
  return (
    <AppLink
      href={path}
      onClick={() => softTap(10)}
      className="relative flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 transition-colors duration-150"
    >
      {isActive && !reduced && (
        <motion.span
          layoutId="bottom-nav-active"
          className="absolute inset-1 rounded-xl bg-emerald-500/20 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.25)]"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      {isActive && reduced && (
        <span className="absolute inset-1 rounded-xl bg-emerald-500/20" />
      )}
      <motion.span
        className="relative z-10 flex flex-col items-center gap-0.5"
        whileTap={reduced ? undefined : { scale: 0.92 }}
        transition={{ duration: 0.15 }}
      >
        <Icon
          className={cn(
            "h-5 w-5 transition-colors",
            isActive ? "text-emerald-500 dark:text-emerald-300" : "theme-text-muted"
          )}
          strokeWidth={isActive ? 2.5 : 2}
        />
        <span
          className={cn(
            "truncate text-[10px] font-bold",
            isActive ? "text-emerald-600 dark:text-emerald-300" : "theme-text-muted"
          )}
        >
          {label}
        </span>
      </motion.span>
    </AppLink>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLocale();
  const reduced = useReducedMotion();
  const aiActive = pathname.startsWith("/ai-doctor");

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      aria-label={t("bottomNavLabel")}
    >
      <div className="mx-auto max-w-lg px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="agriveda-glass-strong relative flex items-end justify-around rounded-[22px] border border-emerald-500/20 bg-[var(--av-surface)]/80 px-1 py-1.5 shadow-[0_-8px_40px_rgba(4,120,87,0.18),0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-xl">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
          />
          {SIDE_ITEMS.map((item) => (
            <NavItem
              key={item.path}
              label={t(item.labelKey)}
              path={item.path}
              icon={item.icon}
              isActive={item.match(pathname)}
              reduced={reduced}
            />
          ))}

          <AppLink
            href="/ai-doctor"
            onClick={() => softTap(16)}
            className="group relative -mt-8 flex min-w-[76px] flex-col items-center"
            aria-label={t("toolAi")}
          >
            {/* Luminous multi-color glow shadow behind FAB so it stands out immediately */}
            {!reduced && (
              <motion.span
                aria-hidden
                className="absolute -top-1.5 h-18 w-18 rounded-full bg-gradient-to-tr from-emerald-500/50 via-teal-400/40 to-amber-400/50 blur-xl"
                animate={{ opacity: [0.55, 0.95, 0.55], scale: [1, 1.14, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <motion.span
              className={cn(
                "relative flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gradient-to-tr from-emerald-700 via-teal-600 to-amber-400 text-white shadow-[0_12px_28px_rgba(5,150,105,0.45),0_6px_20px_rgba(245,158,11,0.4)] ring-4 ring-white dark:ring-slate-900 transition-all duration-200 border border-amber-300/50",
                aiActive
                  ? "ring-4 ring-amber-300 dark:ring-amber-400 shadow-[0_14px_36px_rgba(245,158,11,0.55)] scale-105"
                  : "group-hover:scale-105"
              )}
              whileTap={reduced ? undefined : { scale: 0.92 }}
              whileHover={reduced ? undefined : { scale: 1.06 }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-2 top-1 h-4 rounded-full bg-gradient-to-b from-white/40 to-transparent blur-[1px]"
              />
              <Camera
                className="relative z-10 h-7 w-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] transition-transform group-hover:scale-110"
                strokeWidth={2.5}
              />
              {/* Subtle AI sparkle badge indicator */}
              <span
                aria-hidden
                className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-amber-950 shadow-sm ring-1 ring-white"
              >
                ✦
              </span>
            </motion.span>
            <span
              className={cn(
                "mt-1 max-w-[76px] truncate text-center text-[11px] font-black tracking-tight transition-colors",
                aiActive ? "text-emerald-700 dark:text-emerald-300" : "text-emerald-800 dark:text-emerald-200 group-hover:text-amber-600"
              )}
            >
              {t("toolAi")}
            </span>
          </AppLink>

          {RIGHT_ITEMS.map((item) => (
            <NavItem
              key={item.path}
              label={t(item.labelKey)}
              path={item.path}
              icon={item.icon}
              isActive={item.match(pathname)}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
