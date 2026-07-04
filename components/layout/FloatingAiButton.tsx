"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingAiButton() {
  const pathname = usePathname();
  if (pathname?.startsWith("/ai-doctor")) return null;

  return (
    <Link
      href="/ai-doctor"
      className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-[#006432] px-4 py-3 text-sm font-black text-white shadow-[0_0_24px_rgba(0,255,136,0.25)] backdrop-blur-md transition-all hover:scale-105 md:bottom-10"
      style={{ color: "#ffffff" }}
    >
      <div className="grid grid-cols-2 gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-1.5 w-1.5 rounded-full bg-white" />
        ))}
      </div>
      <span style={{ color: "#ffffff" }}>AgriChat AI</span>
    </Link>
  );
}
