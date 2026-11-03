"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Resets scroll when the route changes.
 * No enter animation: a stuck first frame hid every screen on the phone.
 */
export default function PageReveal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return <div className="min-w-0">{children}</div>;
}
