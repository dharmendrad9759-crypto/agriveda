"use client";

import { useEffect } from "react";
import { hardNavigate, hrefToPath, isCapacitorNative } from "@/lib/capacitorNav";

/**
 * Capacitor WebView + Next.js dev server: client-side App Router navigation
 * often fails (RSC fetches / soft nav). Use full page loads on native Android/iOS.
 */
export default function CapacitorNavigationFix() {
  useEffect(() => {
    if (!isCapacitorNative()) return;

    let lastNavAt = 0;
    let lastNavPath = "";

    const navigateFromAnchor = (anchor: HTMLAnchorElement) => {
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const path = hrefToPath(anchor.getAttribute("href") ?? "");
      if (!path) return;

      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (path === current) return;

      const now = Date.now();
      if (path === lastNavPath && now - lastNavAt < 500) return;
      lastNavAt = now;
      lastNavPath = path;

      hardNavigate(path);
    };

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.dataset.noHardNav === "true") return;
      event.preventDefault();
      event.stopPropagation();
      navigateFromAnchor(anchor);
    };

    document.addEventListener("click", onClick, { capture: true });

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  return null;
}
