"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Standard mobile pattern: pull down on Home to refresh live data.
 */
export default function PullToRefresh({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const enabled = pathname === "/";
  const startY = useRef(0);
  const pulling = useRef(false);
  const [offset, setOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || refreshing) return;
      if (window.scrollY > 4) return;
      startY.current = e.touches[0]?.clientY ?? 0;
      pulling.current = true;
    },
    [enabled, refreshing]
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!pulling.current || !enabled || refreshing) return;
      const y = e.touches[0]?.clientY ?? 0;
      const dy = Math.max(0, y - startY.current);
      if (dy > 8 && window.scrollY <= 0) {
        setOffset(Math.min(72, dy * 0.45));
      }
    },
    [enabled, refreshing]
  );

  const onTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;
    if (offset > 52 && enabled) {
      setRefreshing(true);
      setOffset(48);
      window.setTimeout(() => {
        window.location.reload();
      }, 350);
      return;
    }
    setOffset(0);
  }, [offset, enabled]);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [enabled, onTouchStart, onTouchMove, onTouchEnd]);

  return (
    <>
      {enabled && (offset > 0 || refreshing) && (
        <div
          className="pointer-events-none fixed left-0 right-0 z-[60] flex justify-center"
          style={{ top: `calc(env(safe-area-inset-top) + ${Math.max(8, offset - 20)}px)` }}
        >
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/30 bg-[var(--av-surface)] shadow-lg",
              refreshing && "animate-spin"
            )}
          >
            <RefreshCw className="h-4 w-4 text-emerald-600" />
          </span>
        </div>
      )}
      {children}
    </>
  );
}
