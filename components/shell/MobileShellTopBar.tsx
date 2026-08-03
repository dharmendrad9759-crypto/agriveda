"use client";

import AppLink from "@/components/ui/AppLink";
import AgriVedaBrandMark from "@/components/brand/AgriVedaBrandMark";
import { Bell, MapPin, User } from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { NavDrawerTrigger } from "@/components/shell/ShellNavDrawer";
import { BRAND } from "@/lib/brand";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function MobileShellTopBar() {
  const { profile } = useFarmerProfile();
  const { t } = useLocale();
  const hasLocation = Boolean(profile.village || profile.district || profile.state);
  const location = hasLocation
    ? [profile.village || profile.district, profile.state].filter(Boolean).join(", ")
    : null;
  const shortPlace = location ? location.split(",")[0] || location : "स्थान सेट करें";
  const initials = (profile.name.trim() || "क")
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <header className="av-topbar sticky top-0 z-40 border-b border-emerald-500/10 bg-[var(--av-surface)]/78 px-3 py-2.5 backdrop-blur-xl lg:hidden">
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
          <AppLink
            href="/alerts"
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/15 bg-[var(--av-surface)] text-[var(--av-text-secondary)] shadow-sm transition hover:border-emerald-500/35 hover:text-[var(--av-accent)]"
            aria-label={t("shellNotifications")}
          >
            <Bell className="h-4 w-4" />
          </AppLink>
          <AppLink
            href="/profile"
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-100 to-teal-50 text-[12px] font-extrabold text-emerald-800 shadow-sm dark:from-emerald-900/50 dark:to-teal-950/40 dark:text-emerald-200"
            aria-label={t("navProfile")}
          >
            {initials ? (
              <span>{initials}</span>
            ) : (
              <User className="h-4 w-4" />
            )}
          </AppLink>
        </div>
      </div>
    </header>
  );
}
