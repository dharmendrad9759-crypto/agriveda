"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

function shouldHardNavigate(anchor: HTMLAnchorElement): string | null {
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return null;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("javascript:")) return null;

  if (href.startsWith("/")) return href;

  try {
    const url = new URL(href, window.location.origin);
    if (url.origin === window.location.origin) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Capacitor WebView + Next.js dev server: client-side App Router navigation
 * often fails (RSC fetches / soft nav). Use full page loads on native Android/iOS.
 */
export default function CapacitorNavigationFix() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let activeAnchor: HTMLAnchorElement | null = null;
    let startX = 0;
    let startY = 0;
    let lastNavAt = 0;
    let lastNavPath = "";

    const navigate = (anchor: HTMLAnchorElement) => {
      const path = shouldHardNavigate(anchor);
      if (!path) return;

      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (path === current) return;

      const now = Date.now();
      if (path === lastNavPath && now - lastNavAt < 400) return;
      lastNavAt = now;
      lastNavPath = path;

      window.location.assign(path);
    };

    const onTouchStart = (event: TouchEvent) => {
      activeAnchor = (event.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!activeAnchor || !shouldHardNavigate(activeAnchor)) {
        activeAnchor = null;
        return;
      }
      startX = event.touches[0]?.clientX ?? 0;
      startY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!activeAnchor) return;
      const touch = event.touches[0];
      if (!touch) return;
      if (Math.abs(touch.clientX - startX) > 12 || Math.abs(touch.clientY - startY) > 12) {
        activeAnchor = null;
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!activeAnchor) return;
      const anchor = activeAnchor;
      activeAnchor = null;
      event.preventDefault();
      navigate(anchor);
    };

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || !shouldHardNavigate(anchor)) return;
      event.preventDefault();
      event.stopPropagation();
      navigate(anchor);
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true, capture: true });
    document.addEventListener("touchend", onTouchEnd, { capture: true });
    document.addEventListener("click", onClick, { capture: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart, { capture: true });
      document.removeEventListener("touchmove", onTouchMove, { capture: true });
      document.removeEventListener("touchend", onTouchEnd, { capture: true });
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  return null;
}
