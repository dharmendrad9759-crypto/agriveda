"use client";

import AppLink from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { BRAND } from "@/lib/brand";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "CROPS", path: "/crops" },
    { name: "WEATHER", path: "/weather" },
    { name: "AI DOCTOR", path: "/ai-doctor" },
    { name: "MANDI", path: "/mandi" },
  ];

  return (
    <nav className="agriveda-topbar sticky top-0 z-50 w-full border-b border-emerald-500/10 bg-[var(--background)]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between gap-3 sm:h-14">
          <AppLink href="/" className="flex items-center">
            <span className="text-base font-black tracking-wide agriveda-gradient-text sm:text-lg">
              {BRAND}
            </span>
          </AppLink>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <AppLink
                    key={item.path}
                    href={item.path}
                    className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold tracking-wider transition-all ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/30"
                        : "theme-text-muted hover:text-emerald-500"
                    }`}
                  >
                    {item.name}
                  </AppLink>
                );
              })}
            </div>
            <AppLink
              href="/profile"
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                pathname === "/profile"
                  ? "bg-emerald-500/15 text-emerald-500"
                  : "theme-text-muted hover:bg-emerald-500/10 hover:text-emerald-500"
              }`}
              aria-label="Profile"
            >
              <User className="h-5 w-5" />
            </AppLink>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
