"use client";

import AppLink from "@/components/ui/AppLink";
import { Bell, MapPin } from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { NavDrawerTrigger } from "@/components/shell/ShellNavDrawer";

export default function MobileShellTopBar() {
  const { profile } = useFarmerProfile();
  const location = [profile.district, profile.state].filter(Boolean).join(", ") || "Sehore, MP";
  const initials = profile.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "K";

  return (
    <header className="av-topbar sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-emerald-950/[0.07] bg-[var(--av-surface)]/88 px-4 py-3 shadow-[0_8px_30px_-24px_rgba(5,80,50,0.5)] backdrop-blur-xl lg:hidden">
      <div className="min-w-0">
        <NavDrawerTrigger
          variant="brand"
          className="[&_svg]:h-5 [&_svg]:w-5 [&_svg]:rounded-lg [&_svg]:bg-emerald-100 [&_svg]:p-1 [&_span]:font-display [&_span]:text-[15px] [&_span]:tracking-tight dark:[&_svg]:bg-emerald-400/10"
        />
        <AppLink
          href="/profile"
          className="mt-0.5 flex max-w-44 items-center gap-1 text-[10px] font-medium text-[var(--av-text-muted)]"
          aria-label={`Current location: ${location}`}
        >
          <MapPin className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-300" />
          <span className="truncate">{location}</span>
        </AppLink>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <AppLink
          href="/alerts"
          className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-950/[0.08] bg-[var(--av-surface-muted)] text-[var(--av-text-secondary)] transition hover:border-emerald-500/30 hover:text-emerald-700 dark:border-white/10 dark:hover:text-emerald-300"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-amber-500 ring-2 ring-[var(--av-surface-muted)]" />
        </AppLink>
        <AppLink
          href="/profile"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-[11px] font-extrabold text-white shadow-[0_8px_20px_-10px_rgba(5,100,65,0.8)] ring-2 ring-white dark:ring-emerald-300/20"
          aria-label="Profile"
        >
          {initials}
        </AppLink>
      </div>
    </header>
  );
}
