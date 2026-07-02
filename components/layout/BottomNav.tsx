"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, MessageCircleQuestion } from "lucide-react";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "SmartFarm", path: "/crop-details/paddy", icon: Map },
  { name: "Expert", path: "/community", icon: MessageCircleQuestion },
];

export default function BottomNav() {
  const pathname = usePathname();

  const showNav =
    pathname === "/" ||
    pathname.startsWith("/crop-details") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/ask-query");

  if (!showNav) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-auto max-w-lg px-4 pb-3">
        <div className="agriveda-glass-strong flex items-center justify-around rounded-2xl px-2 py-2 shadow-xl shadow-emerald-900/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/"
                ? pathname === "/"
                : pathname.startsWith(item.path.split("/").slice(0, 2).join("/"));

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 transition-all ${
                  isActive
                    ? "bg-gradient-to-b from-orange-50 to-amber-50 text-orange-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${isActive ? "text-orange-500" : "text-slate-400"}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[10px] font-bold">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
