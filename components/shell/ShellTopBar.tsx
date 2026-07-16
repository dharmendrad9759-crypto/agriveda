"use client";

import AppLink from "@/components/ui/AppLink";
import WeatherPill from "@/components/weather/WeatherPill";
import { Bell, ChevronDown, MapPin, User } from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

export default function ShellTopBar() {
  const pathname = usePathname();
  const { profile } = useFarmerProfile();

  const location = useMemo(() => {
    const parts = [profile.district, profile.state].filter(Boolean);
    return parts.length ? parts.join(", ") : "Sehore, MP";
  }, [profile]);

  const pill =
    "flex items-center gap-1.5 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-1.5 text-xs font-medium text-[var(--av-text-primary)]";

  if (pathname === "/") return null;

  return (
    <header className="av-topbar sticky top-0 z-40 hidden items-center justify-end gap-3 px-4 py-2 lg:flex">
      <AppLink href="/profile" className={`${pill} hover:border-[var(--av-accent)]/40`}>
        <MapPin className="h-3.5 w-3.5 text-[var(--av-accent)]" />
        {location}
        <ChevronDown className="h-3 w-3 text-[var(--av-text-muted)]" />
      </AppLink>

      <WeatherPill />

      <AppLink
        href="/alerts"
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/15 bg-[var(--av-surface)]/80 text-[var(--av-text-muted)] backdrop-blur-md hover:text-[var(--av-accent)]"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
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
