"use client";

import AppLink from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Home, Sprout, IndianRupee, User, Stethoscope } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";

const SIDE_ITEMS = [
  {
    label: "Home",
    path: "/",
    icon: Home,
    match: (pathname: string) => pathname === "/",
  },
  {
    label: "Crops",
    path: "/crops",
    icon: Sprout,
    match: (pathname: string) =>
      pathname.startsWith("/crops") ||
      pathname.startsWith("/crop-details") ||
      pathname.startsWith("/select-crops"),
  },
] as const;

const RIGHT_ITEMS = [
  {
    label: "Market",
    path: "/mandi",
    icon: IndianRupee,
    match: (pathname: string) => pathname.startsWith("/mandi"),
  },
  {
    label: "Profile",
    path: "/profile",
    icon: User,
    match: (pathname: string) => pathname.startsWith("/profile"),
  },
] as const;

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
            isActive ? "text-emerald-600 dark:text-emerald-400" : "theme-text-muted"
          }`}
          strokeWidth={isActive ? 2.5 : 2}
        />
        <span
          className={`truncate text-[9px] font-bold ${
            isActive ? "text-emerald-600 dark:text-emerald-400" : "theme-text-muted"
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
        <div className="agriveda-glass-strong relative flex items-end justify-around rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]/95 px-1 py-1.5 shadow-lg">
          {SIDE_ITEMS.map((item) => (
            <NavItem
              key={item.path}
              {...item}
              isActive={item.match(pathname)}
              reduced={reduced}
            />
          ))}

          <AppLink
            href="/ai-doctor"
            className="relative -mt-5 flex min-w-[64px] flex-col items-center gap-1"
            aria-label="AI Doctor"
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition ${
                aiActive
                  ? "bg-[var(--av-accent)] text-white ring-4 ring-[var(--av-accent)]/25"
                  : "bg-[var(--av-accent)] text-white hover:brightness-110"
              }`}
            >
              <Stethoscope className="h-6 w-6" strokeWidth={2.25} />
            </span>
            <span
              className={`text-[9px] font-bold ${aiActive ? "text-[var(--av-accent)]" : "theme-text-muted"}`}
            >
              AI Doctor
            </span>
          </AppLink>

          {RIGHT_ITEMS.map((item) => (
            <NavItem
              key={item.path}
              {...item}
              isActive={item.match(pathname)}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
