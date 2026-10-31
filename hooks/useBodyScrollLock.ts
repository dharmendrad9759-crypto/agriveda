"use client";

import { useEffect } from "react";

let lockCount = 0;
let previousBodyOverflow = "";
let previousHtmlOverflow = "";
let previousBodyTouchAction = "";

/**
 * Robust scroll & touch locking hook for mobile WebViews and browsers.
 * Completely prevents background scrolling, rubber-banding, and gesture bleed
 * while one or more dialogs/modals/sheets are open.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked || typeof document === "undefined") return;

    if (lockCount === 0) {
      previousBodyOverflow = document.body.style.overflow;
      previousHtmlOverflow = document.documentElement.style.overflow;
      previousBodyTouchAction = document.body.style.touchAction;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    }
    lockCount += 1;

    // Prevent background dragging on mobile touch devices
    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Allow scrolling ONLY inside scrollable modal containers
      const scrollable = target.closest(
        "[data-scrollable='true'], .overflow-y-auto, .overflow-auto, textarea, input, select"
      );

      if (!scrollable) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = previousBodyOverflow;
        document.documentElement.style.overflow = previousHtmlOverflow;
        document.body.style.touchAction = previousBodyTouchAction;
      }
    };
  }, [locked]);
}
