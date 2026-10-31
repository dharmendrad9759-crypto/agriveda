"use client";

import { useEffect } from "react";

let lockCount = 0;
let originalBodyOverflow = "";

/**
 * Robust scroll locking hook for mobile WebViews and desktop browsers.
 * Locks background scrolling without preventing touch taps, gesture propagation,
 * or breaking back navigation.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked || typeof document === "undefined") return;

    if (lockCount === 0) {
      originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = originalBodyOverflow;
        // Clean slate: ensure no touchAction or html overflow remains stuck
        document.body.style.touchAction = "";
        document.documentElement.style.touchAction = "";
        document.documentElement.style.overflow = "";
      }
    };
  }, [locked]);
}
