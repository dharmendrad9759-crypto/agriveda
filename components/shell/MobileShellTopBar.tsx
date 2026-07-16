"use client";

import AppLink from "@/components/ui/AppLink";
import WeatherPill from "@/components/weather/WeatherPill";
import { Bell, Leaf, MapPin, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { NavDrawerTrigger } from "@/components/shell/ShellNavDrawer";
import { useNavDrawer } from "@/components/shell/NavDrawerProvider";

export default function MobileShellTopBar() {
  const { profile } = useFarmerProfile();
  const pathname = usePathname();
  const { openDrawer } = useNavDrawer();
  const location = [profile.district, profile.state].filter(Boolean).join(", ") || "Sehore, MP";
  const initial = profile.name.trim().charAt(0).toUpperCase() || "K";

  const iconBtn =
    "flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/15 bg-[var(--av-surface)]/80 text-[var(--av-text-muted)] shadow-sm backdrop-blur-md transition hover:border-emerald-500/35 hover:text-[var(--av-accent)]";

  if (pathname === "/") {
    return (
      <header className="sticky top-0 z-40 border-b border-[#e5eee7] bg-[#f9fbf7]/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <button
            type="button"
            onClick={openDrawer}
            className="flex min-w-0 items-center gap-2.5 text-left"
            aria-label="Open AgriVeda menu"
          >
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#1f8251] to-[#115c38] text-white shadow-[0_7px_18px_-7px_rgba(14,90,53,0.65)]">
              <Leaf className="h-5 w-5" fill="currentColor" strokeWidth={1.5} />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#f9fbf7] bg-[#dcec62]" />
            </span>
            <span className="min-w-0">
              <span className="block text-[17px] font-extrabold leading-tight tracking-[-0.035em] text-[#153b29]">
                Agri<span className="text-[#278653]">Veda</span>
              </span>
              <span className="mt-0.5 flex min-w-0 items-center gap-1 text-[10px] font-semibold text-[#6f8276]">
                <MapPin className="h-3 w-3 shrink-0 text-[#2b8c5a]" fill="currentColor" />
                <span className="truncate">{location}</span>
              </span>
            </span>
          </button>

          <div className="flex shrink-0 items-center gap-2">
            <AppLink
              href="/alerts"
              className="relative flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#e0eae3] bg-white text-[#426352] shadow-[0_5px_16px_-10px_rgba(15,63,38,0.55)]"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#ef6b51]" />
            </AppLink>
            <AppLink
              href="/profile"
              className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#dfeeda] text-sm font-extrabold text-[#1f6842] ring-1 ring-[#cfe2d1]"
              aria-label="Profile"
            >
              {initial}
            </AppLink>
          </div>
        </div>
      </header>
    );
  }

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
