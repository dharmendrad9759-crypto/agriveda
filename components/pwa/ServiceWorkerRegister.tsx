"use client";

import { useEffect } from "react";
import { syncMandiHistoryToServiceWorker } from "@/lib/offline/offlinePack";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        await syncMandiHistoryToServiceWorker(reg);
      } catch {
        /* dev / unsupported */
      }
    };

    if (process.env.NODE_ENV === "production") {
      void register();
    } else if (process.env.NEXT_PUBLIC_ENABLE_SW === "1") {
      void register();
    }

    const onOnline = () => {
      navigator.serviceWorker.ready.then((reg) => syncMandiHistoryToServiceWorker(reg)).catch(() => {});
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);

  return null;
}
