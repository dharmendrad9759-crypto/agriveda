"use client";

import AppLink from "@/components/ui/AppLink";
import WeatherPill from "@/components/weather/WeatherPill";
import { Bell, MapPin, User } from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { NavDrawerTrigger } from "@/components/shell/ShellNavDrawer";

export default function MobileShellTopBar() {
  const { profile } = useFarmerProfile();
  const location = [profile.district, profile.state].filter(Boolean).join(", ") || "Sehore, MP";

  const iconBtn =
    "flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/15 bg-[var(--av-surface)]/80 text-[var(--av-text-muted)] shadow-sm backdrop-blur-md transition hover:border-emerald-500/35 hover:text-[var(--av-accent)]";

  return (
    <header className="av-topbar sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-emerald-500/10 bg-[var(--av-surface)]/70 px-3 py-2.5 backdrop-blur-xl lg:hidden">
      <div className="flex min-w-0 items-center gap-2">
        <NavDrawerTrigger variant="menu" />
        <NavDrawerTrigger variant="brand" />
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <AppLink
          href="/profile"
          className="hidden items-center gap-1 rounded-xl border border-emerald-500/15 bg-[var(--av-surface)]/80 px-2 py-1 text-[9px] text-[var(--av-text-secondary)] backdrop-blur-md xs:flex"
        >
          <MapPin className="h-3 w-3 text-[var(--av-accent)]" />
          {location.split(",")[0]}
        </AppLink>
        <WeatherPill compact />
        <AppLink href="/alerts" className={`relative ${iconBtn}`} aria-label="Alerts">
          <Bell className="h-3.5 w-3.5" />
        </AppLink>
        <AppLink href="/settings" className={`rounded-full text-[var(--av-accent)] ${iconBtn}`}>
          <User className="h-3.5 w-3.5" />
        </AppLink>
      </div>
    </header>
  );
}
