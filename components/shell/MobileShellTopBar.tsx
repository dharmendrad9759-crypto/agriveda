"use client";

import AppLink from "@/components/ui/AppLink";
import { Bell, Leaf, MapPin, User } from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { NavDrawerTrigger } from "@/components/shell/ShellNavDrawer";
import { BRAND } from "@/lib/brand";

export default function MobileShellTopBar() {
  const { profile } = useFarmerProfile();
  const location =
    [profile.village || profile.district, profile.state].filter(Boolean).join(", ") ||
    "Sehore, MP";
  const shortPlace = location.split(",")[0] || location;
  const initials = (profile.name.trim() || "K")
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <header className="av-topbar sticky top-0 z-40 border-b border-emerald-500/10 bg-[var(--av-surface)]/78 px-3 py-2.5 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <NavDrawerTrigger variant="menu" />
          <AppLink href="/" className="flex min-w-0 items-center gap-1.5" aria-label={BRAND}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-[0_6px_16px_rgba(5,150,105,0.35)]">
              <Leaf className="h-4 w-4" strokeWidth={2.4} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-[15px] font-extrabold tracking-tight text-[var(--av-text-primary)]">
                AgriVeda
              </span>
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[var(--av-text-muted)]">
                <MapPin className="h-2.5 w-2.5 shrink-0 text-emerald-600" />
                <span className="truncate">{shortPlace}</span>
              </span>
            </span>
          </AppLink>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <AppLink
            href="/alerts"
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/15 bg-[var(--av-surface)] text-[var(--av-text-secondary)] shadow-sm transition hover:border-emerald-500/35 hover:text-[var(--av-accent)]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-md bg-amber-500" />
          </AppLink>
          <AppLink
            href="/profile"
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-100 to-teal-50 text-[12px] font-extrabold text-emerald-800 shadow-sm dark:from-emerald-900/50 dark:to-teal-950/40 dark:text-emerald-200"
            aria-label="Profile"
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
