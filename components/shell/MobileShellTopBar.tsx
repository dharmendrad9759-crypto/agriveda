"use client";

import AppLink from "@/components/ui/AppLink";
import { Bell, MapPin } from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { NavDrawerTrigger } from "@/components/shell/ShellNavDrawer";
import { useMemo } from "react";

export default function MobileShellTopBar() {
  const { profile } = useFarmerProfile();
  const location = useMemo(
    () => [profile.district || profile.village, profile.state].filter(Boolean).join(", ") || "Sehore, MP",
    [profile.district, profile.state, profile.village]
  );
  const initials = useMemo(() => {
    const parts = profile.name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "AV";
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [profile.name]);

  const iconBtn =
    "flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/15 bg-white/80 text-[var(--av-text-muted)] shadow-sm backdrop-blur-md transition hover:border-emerald-500/35 hover:text-[var(--av-accent)] dark:bg-[var(--av-surface)]/80";

  return (
    <header className="av-topbar sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-emerald-500/10 bg-[var(--av-surface)]/80 px-3 py-2.5 backdrop-blur-xl lg:hidden">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <NavDrawerTrigger
          variant="brand"
          className="shrink-0 rounded-2xl border border-emerald-500/15 bg-white/80 px-2.5 py-2 shadow-sm backdrop-blur-md dark:bg-[var(--av-surface)]/80"
        />
        <AppLink
          href="/profile"
          className="flex min-w-0 flex-1 items-center gap-1.5 rounded-2xl border border-emerald-500/10 bg-white/70 px-2.5 py-2 shadow-sm backdrop-blur-md dark:bg-[var(--av-surface)]/70"
        >
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--av-accent)]" />
          <span className="truncate text-[11px] font-bold text-[var(--av-text-secondary)]">{location}</span>
        </AppLink>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <AppLink href="/alerts" className={`relative ${iconBtn}`} aria-label="Alerts">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-white dark:ring-slate-900" />
        </AppLink>
        <AppLink
          href="/profile"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-600 to-lime-500 text-[11px] font-black text-white shadow-sm"
          aria-label="Profile"
        >
          {initials}
        </AppLink>
      </div>
    </header>
  );
}
