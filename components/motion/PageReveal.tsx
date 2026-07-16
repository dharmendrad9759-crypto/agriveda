"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Tool / page enter animation.
 * Uses CSS (not Framer) so it still runs on Capacitor even when UI motion is reduced for performance.
 */
export default function PageReveal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [reduced, setReduced] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  // Remount animation whenever route changes
  useEffect(() => {
    setTick((n) => n + 1);
  }, [pathname]);

  if (reduced) return <>{children}</>;

  return (
    <div key={`${pathname}-${tick}`} className="av-page-enter min-w-0">
      {children}
    </div>
  );
}
