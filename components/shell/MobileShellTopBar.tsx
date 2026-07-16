"use client";

import AppLink from "@/components/ui/AppLink";
import { Bell, ChevronDown, Leaf, MapPin } from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useNavDrawer } from "@/components/shell/NavDrawerProvider";
import { BRAND } from "@/lib/brand";

export default function MobileShellTopBar() {
  const { profile } = useFarmerProfile();
  const { openDrawer } = useNavDrawer();
  const place =
    [profile.village || profile.district, profile.state].filter(Boolean).join(", ") ||
    "Sehore, MP";
  const shortPlace = place.split(",")[0];
  const initials = (profile.name.trim() || "AV")
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <header className="av-topbar sticky top-0 z-40 border-b border-emerald-500/10 bg-[var(--av-surface)]/78 px-3 py-2.5 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={openDrawer}
          className="flex min-w-0 items-center gap-2 text-left"
          aria-label="Open AgriVeda menu"
        >
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-[0_6px_16px_rgba(5,150,105,0.35)]">
            <Leaf className="h-[18px] w-[18px]" strokeWidth={2.4} />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-[17px] font-extrabold leading-none tracking-tight text-[var(--av-text-primary)]">
              {BRAND === "Agriveda" ? "AgriVeda" : BRAND}
            </span>
            <span className="mt-0.5 block truncate text-[10px] font-semibold text-[var(--av-text-muted)]">
              Smart Farm Assistant
            </span>
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-1.5">
          <AppLink
            href="/profile"
            className="inline-flex max-w-[7.5rem] items-center gap-1 rounded-full border border-emerald-500/15 bg-[var(--av-surface-muted)] px-2 py-1.5 text-[10px] font-semibold text-[var(--av-text-secondary)]"
            aria-label={`Location ${shortPlace}`}
          >
            <MapPin className="h-3 w-3 shrink-0 text-[var(--av-accent)]" />
            <span className="truncate">{shortPlace}</span>
            <ChevronDown className="h-3 w-3 shrink-0 opacity-60" />
          </AppLink>

          <AppLink
            href="/alerts"
            className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-emerald-500/15 bg-[var(--av-surface)] text-[var(--av-text-secondary)] shadow-sm transition hover:text-[var(--av-accent)]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-500 ring-2 ring-[var(--av-surface)]" />
          </AppLink>

          <AppLink
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-[11px] font-bold text-white shadow-sm ring-2 ring-emerald-500/20"
            aria-label="Profile"
          >
            {initials || "AV"}
          </AppLink>
        </div>
      </div>
    </header>
  );
}
