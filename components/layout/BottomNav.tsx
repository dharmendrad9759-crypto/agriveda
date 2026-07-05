"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CloudSun, Sparkles, Radar, User } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { FarmerUiKey } from "@/lib/i18n/farmer-ui";

const navItems: { nameKey: FarmerUiKey; path: string; icon: typeof Home }[] = [
  { nameKey: "navHome", path: "/", icon: Home },
  { nameKey: "navWeather", path: "/weather", icon: CloudSun },
  { nameKey: "navAi", path: "/ai-doctor", icon: Sparkles },
  { nameKey: "navRadar", path: "/pest-outbreak-radar", icon: Radar },
  { nameKey: "navProfile", path: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-auto max-w-lg px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="agriveda-glass-strong flex items-center justify-around rounded-2xl border border-[var(--panel-border)] px-1 py-1.5 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/"
                ? pathname === "/"
                : pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "theme-text-muted hover:text-emerald-600"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-transform ${isActive ? "scale-110" : ""}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="truncate text-[9px] font-bold">{t(item.nameKey)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
