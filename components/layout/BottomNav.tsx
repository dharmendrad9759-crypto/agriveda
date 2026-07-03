"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, MessageCircleQuestion } from "lucide-react";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "AI Doctor", path: "/ai-doctor", icon: Sparkles },
  { name: "Expert", path: "/community", icon: MessageCircleQuestion },
];

export default function BottomNav() {
  const pathname = usePathname();
  const showNav =
    pathname === "/" ||
    pathname.startsWith("/crop-details") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/ask-query") ||
    pathname.startsWith("/select-crops") ||
    pathname.startsWith("/pest-diseases") ||
    pathname.startsWith("/ai-doctor") ||
    pathname.startsWith("/profile");

  if (!showNav) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-auto max-w-lg px-4 pb-4">
        <div className="agriveda-glass-strong flex items-center justify-around rounded-2xl border border-gray-200/80 px-2 py-2 shadow-lg dark:border-emerald-500/15">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/"
                ? pathname === "/"
                : pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 transition-all ${
                  isActive
                    ? "text-orange-500"
                    : "theme-text-muted hover:text-emerald-600"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
