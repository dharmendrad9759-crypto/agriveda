"use client";

import { useEffect } from "react";

/**
 * Do not register a service worker.
 * The offline worker was intercepting screens and leaving them blank after the first good open.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    let cancelled = false;
    const drop = async () => {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        if (!regs.length || cancelled) return;
        await Promise.all(regs.map((reg) => reg.unregister()));
        if (!cancelled && navigator.serviceWorker.controller) {
          const url = new URL(window.location.href);
          if (url.searchParams.get("av") !== "off") {
            url.searchParams.set("av", "off");
            window.location.replace(url.href);
          }
        }
      } catch {
        /* ignore */
      }
    };

    void drop();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
