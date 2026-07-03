"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";

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
    <nav className="sticky top-0 z-50 w-full border-b border-emerald-500/10 bg-[var(--background)]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-black tracking-widest agriveda-gradient-text">
              AGRIVEDA
            </span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-black text-emerald-400">
              PRO
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold tracking-wider transition-all ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                        : "theme-text-muted hover:text-emerald-400"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <Link
              href="/profile"
              className={`rounded-lg p-2 transition ${
                pathname === "/profile"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "theme-text-muted hover:text-emerald-400"
              }`}
              aria-label="Profile"
            >
              <User className="h-5 w-5" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
