"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Tool / page enter animation.
 * Smoothly resets scroll to top without double-mounting the DOM tree.
 */
export default function PageReveal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  // Reset scroll to top on route change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  if (reduced) return <>{children}</>;

  return (
    <div key={pathname} className="av-page-enter min-w-0">
      {children}
    </div>
  );
}
