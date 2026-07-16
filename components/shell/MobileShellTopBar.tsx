"use client";

import AppLink from "@/components/ui/AppLink";
import { Bell, Leaf, MapPin } from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useNavDrawer } from "@/components/shell/NavDrawerProvider";

export default function MobileShellTopBar() {
  const { profile } = useFarmerProfile();
  const { openDrawer } = useNavDrawer();
  const location = [profile.district, profile.state].filter(Boolean).join(", ") || "Sehore, MP";
  const initial = profile.name.trim().charAt(0).toUpperCase() || "K";

  return (
    <header className="av-topbar sticky top-0 z-40 flex min-h-[66px] items-center justify-between gap-3 border-b border-[#dfe9e2] bg-[var(--av-surface)]/92 px-4 py-2.5 shadow-[0_8px_30px_-24px_rgba(21,69,43,0.55)] backdrop-blur-xl lg:hidden">
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          type="button"
          onClick={openDrawer}
          className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br from-[#176e45] to-[#0b4e30] text-white shadow-[0_7px_18px_-8px_rgba(10,79,47,0.7)]"
          aria-label="Open AgriVeda menu"
        >
          <span className="absolute -bottom-3 -right-2 h-7 w-7 rounded-full bg-[#d3e97a]/25" />
          <Leaf className="relative h-5 w-5 -rotate-12" fill="currentColor" strokeWidth={1.6} />
        </button>
        <div className="min-w-0">
          <button
            type="button"
            onClick={openDrawer}
            className="block text-left text-[17px] font-extrabold leading-none tracking-[-0.035em] text-[var(--av-text-primary)]"
          >
            Agri<span className="text-[#2e8a53]">Veda</span>
          </button>
          <AppLink
            href="/profile"
            className="mt-1.5 flex min-w-0 items-center gap-1 text-[10px] font-semibold text-[var(--av-text-muted)]"
          >
            <MapPin className="h-3 w-3 shrink-0 text-[#d49137]" fill="currentColor" strokeWidth={1.6} />
            <span className="max-w-[128px] truncate">{location}</span>
          </AppLink>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <AppLink
          href="/alerts"
          className="relative flex h-10 w-10 items-center justify-center rounded-[14px] border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)] shadow-sm transition hover:border-emerald-500/35 hover:text-[var(--av-accent)]"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={2.15} />
          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full border-2 border-[var(--av-surface)] bg-[#ef6a55]" />
        </AppLink>
        <AppLink
          href="/profile"
          className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#e9f2dc] to-[#f4ebce] text-sm font-extrabold text-[#326543] ring-1 ring-[#d6e3cf] shadow-sm"
          aria-label="Profile"
        >
          {initial}
        </AppLink>
      </div>
    </header>
  );
}
