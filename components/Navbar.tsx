// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "CROPS", path: "/crops" },
    { name: "WEATHER", path: "/weather" },
    { name: "AI DOCTOR", path: "/ai-doctor" },
    { name: "MANDI PRICES", path: "/mandi" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/60 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* लोगो / ब्रांड नाम */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
                AGRIVEDA
              </span>
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                PRO
              </span>
            </Link>
          </div>

          {/* नेविगेशन लिंक्स */}
          <div className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`rounded-full px-3 py-1.5 text-xs md:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white/10 text-white font-bold border border-white/10 shadow-inner"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
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