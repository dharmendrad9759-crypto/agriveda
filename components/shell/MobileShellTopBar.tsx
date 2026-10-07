"use client";

import AppLink from "@/components/ui/AppLink";
import AgriVedaBrandMark from "@/components/brand/AgriVedaBrandMark";
import { Bell, MapPin, Languages } from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { farmerPlaceLine } from "@/lib/farmerPlaceName";
import { NavDrawerTrigger } from "@/components/shell/ShellNavDrawer";
import { BRAND } from "@/lib/brand";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { countInAppIrrigationAlerts, onIrrigationAlertsChanged } from "@/lib/irrigationReminders";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function MobileShellTopBar() {
  const pathname = usePathname();
  const { profile } = useFarmerProfile();
  const { t, locale, setLocale } = useLocale();
  const [irrCount, setIrrCount] = useState(0);

  useEffect(() => {
    const refresh = () => setIrrCount(countInAppIrrigationAlerts());
    refresh();
    return onIrrigationAlertsChanged(refresh);
  }, []);

  // Only show the global brand header on the root home page.
  // Subpages have their own unified, sticky back-navigation app bar inside AppShell.
  if (pathname !== "/") {
    return null;
  }

  const place = farmerPlaceLine(profile);
  const hasLocation = place.ok;
  const shortPlace = place.short || "स्थान डालें";

  const toggleLanguage = () => {
    setLocale(locale === "hi" ? "en" : "hi");
  };

  return (
    <header className="av-topbar sticky top-0 z-40 border-b border-emerald-500/10 bg-[var(--av-surface)]/85 px-3 py-2.5 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <NavDrawerTrigger variant="menu" />
          <div className="flex min-w-0 items-center gap-1.5">
            <AppLink href="/" className="flex shrink-0 items-center gap-1.5" aria-label={BRAND}>
              <AgriVedaBrandMark />
              <span className="truncate font-display text-[15px] font-extrabold tracking-tight text-[var(--av-text-primary)]">
                AgriVeda
              </span>
            </AppLink>
            {hasLocation ? (
              <span className="flex min-w-0 items-center gap-0.5 text-[10px] font-semibold text-[var(--av-text-muted)]">
                <MapPin className="h-2.5 w-2.5 shrink-0 text-emerald-600" />
                <span className="truncate">{shortPlace}</span>
              </span>
            ) : (
              <AppLink
                href="/profile/edit"
                className="flex min-w-0 items-center gap-0.5 text-[10px] font-semibold text-sky-700 dark:text-sky-300"
              >
                <MapPin className="h-2.5 w-2.5 shrink-0" />
                <span className="truncate">{shortPlace}</span>
              </AppLink>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {/* One-tap Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex h-9 items-center gap-1 rounded-xl border border-emerald-500/20 bg-[var(--av-surface)] px-2.5 text-[11px] font-extrabold text-[var(--av-text-primary)] shadow-sm active:scale-95 hover:border-emerald-500/40"
            aria-label={locale === "hi" ? "Switch to English" : "हिंदी में बदलें"}
            title={locale === "hi" ? "Switch to English" : "हिंदी में बदलें"}
          >
            <Languages className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{locale === "hi" ? "EN" : "हिन्दी"}</span>
          </button>

          {/* Notifications / Alerts */}
          <AppLink
            href="/alerts"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/15 bg-[var(--av-surface)] text-[var(--av-text-secondary)] shadow-sm transition hover:border-emerald-500/35 hover:text-[var(--av-accent)] active:scale-95"
            aria-label={t("shellNotifications")}
          >
            <Bell className="h-4 w-4" />
            {irrCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">
                {irrCount > 9 ? "9+" : irrCount}
              </span>
            ) : null}
          </AppLink>
        </div>
      </div>
    </header>
  );
}
