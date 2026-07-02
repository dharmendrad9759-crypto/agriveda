"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isFuturisticPage =
    pathname === "/" ||
    pathname.startsWith("/crop-details") ||
    pathname.startsWith("/ask-query") ||
    pathname.startsWith("/community");

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "CROPS", path: "/crops" },
    { name: "WEATHER", path: "/weather" },
    { name: "DEFICIENCIES", path: "/deficiencies" },
    { name: "AI DOCTOR", path: "/ai-doctor" },
    { name: "MANDI", path: "/mandi" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full backdrop-blur-xl ${
        isFuturisticPage
          ? "border-b border-emerald-500/10 bg-[#030712]/80"
          : "border-b border-white/5 bg-slate-950/60"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-black tracking-widest agriveda-gradient-text">
              AGRIVEDA
            </span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-black text-emerald-400">
              NEXUS
            </span>
          </Link>

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
                      : "text-slate-500 hover:text-emerald-400"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
