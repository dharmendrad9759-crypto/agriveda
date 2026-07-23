"use client";

import AppLink from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Home, Sprout, IndianRupee, User, Stethoscope } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { softTap } from "@/lib/appEssentials";
import type { FarmerUiKey } from "@/lib/i18n/farmer-ui";

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
    labelKey: "navMandi",
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
      className="relative flex min-h-[44px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 transition-colors duration-150"
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
          className={`h-5 w-5 transition-colors ${
            isActive ? "text-emerald-500 dark:text-emerald-300" : "theme-text-muted"
          }`}
          strokeWidth={isActive ? 2.5 : 2}
        />
        <span
          className={`truncate text-[9px] font-bold ${
            isActive ? "text-emerald-600 dark:text-emerald-300" : "theme-text-muted"
          }`}
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
            className="relative -mt-6 flex min-w-[68px] flex-col items-center gap-1"
            aria-label={t("navAiDoctor")}
          >
            {!reduced && (
              <motion.span
                aria-hidden
                className="absolute top-0 h-14 w-14 rounded-full bg-emerald-400/35 blur-md"
                animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.12, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <motion.span
              className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-[0_8px_28px_rgba(5,150,105,0.55)] transition ${
                aiActive
                  ? "bg-gradient-to-br from-emerald-400 to-teal-600 text-white ring-4 ring-emerald-400/30"
                  : "bg-gradient-to-br from-emerald-500 to-teal-700 text-white"
              }`}
              whileTap={reduced ? undefined : { scale: 0.92 }}
              whileHover={reduced ? undefined : { scale: 1.04 }}
            >
              <Stethoscope className="h-6 w-6" strokeWidth={2.25} />
            </motion.span>
            <span
              className={`text-[9px] font-bold ${aiActive ? "text-emerald-500" : "theme-text-muted"}`}
            >
              {t("navAiDoctor")}
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
