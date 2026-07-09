"use client";

import AppLink from "@/components/ui/AppLink";
import { Bell, ChevronDown, CloudSun, MapPin, User } from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMemo } from "react";

export default function ShellTopBar() {
  const { profile } = useFarmerProfile();

  const location = useMemo(() => {
    const parts = [profile.district, profile.state].filter(Boolean);
    return parts.length ? parts.join(", ") : "Sehore, MP";
  }, [profile]);

  const pill =
    "flex items-center gap-1.5 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-1.5 text-xs font-medium text-[var(--av-text-primary)]";

  return (
    <header className="av-topbar sticky top-0 z-40 hidden items-center justify-end gap-3 px-4 py-2 lg:flex">
      <AppLink href="/profile" className={`${pill} hover:border-[var(--av-accent)]/40`}>
        <MapPin className="h-3.5 w-3.5 text-[var(--av-accent)]" />
        {location}
        <ChevronDown className="h-3 w-3 text-[var(--av-text-muted)]" />
      </AppLink>

      <AppLink href="/weather" className={pill}>
        <CloudSun className="h-3.5 w-3.5 text-amber-500" />
        32°C Partly Cloudy
      </AppLink>

      <AppLink
        href="/alerts"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-muted)] hover:text-[var(--av-accent)]"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
          3
        </span>
      </AppLink>

      <AppLink
        href="/profile"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-accent)]"
        aria-label="Profile"
      >
        <User className="h-4 w-4" />
      </AppLink>
    </header>
  );
}
