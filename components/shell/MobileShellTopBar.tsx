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
    "flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-muted)]";

  return (
    <header className="av-topbar sticky top-0 z-40 flex items-center justify-between gap-2 px-3 py-2.5 lg:hidden">
      <div className="flex min-w-0 items-center gap-2">
        <NavDrawerTrigger variant="menu" />
        <NavDrawerTrigger variant="brand" />
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <AppLink href="/profile" className="hidden items-center gap-1 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] px-2 py-1 text-[9px] text-[var(--av-text-secondary)] xs:flex">
          <MapPin className="h-3 w-3 text-[var(--av-accent)]" />
          {location.split(",")[0]}
        </AppLink>
        <WeatherPill compact />
        <AppLink href="/alerts" className={`relative ${iconBtn}`}>
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
            3
          </span>
        </AppLink>
        <AppLink href="/settings" className={`rounded-full text-[var(--av-accent)] ${iconBtn}`}>
          <User className="h-3.5 w-3.5" />
        </AppLink>
      </div>
    </header>
  );
}
