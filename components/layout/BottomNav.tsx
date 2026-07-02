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
  const isHome = pathname === "/";

  if (!isHome && !pathname.startsWith("/crop-details") && !pathname.startsWith("/community") && !pathname.startsWith("/ask-query")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 py-2">
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
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
                isActive ? "text-orange-500" : "text-gray-500"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-orange-500" : "text-gray-400"}`} />
              <span className="text-[10px] font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
