"use client";

import { useEffect } from "react";
import { syncMandiHistoryToServiceWorker, warmMyCropPages } from "@/lib/offline/offlinePack";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    let warmTimer: number | undefined;
    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        await reg.update().catch(() => {});
        await syncMandiHistoryToServiceWorker(reg);
        warmTimer = window.setTimeout(() => {
          navigator.serviceWorker.ready.then((r) => warmMyCropPages(r)).catch(() => {});
        }, 15000);
      } catch {
        /* dev / unsupported */
      }
    };

    const onController = () => {
      if (sessionStorage.getItem("agriveda-sw-reload") === "1") return;
      sessionStorage.setItem("agriveda-sw-reload", "1");
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onController);

    if (process.env.NODE_ENV === "production") {
      void register();
    } else if (process.env.NEXT_PUBLIC_ENABLE_SW === "1") {
      void register();
    }

    const onOnline = () => {
      navigator.serviceWorker.ready.then((reg) => syncMandiHistoryToServiceWorker(reg)).catch(() => {});
    };
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("online", onOnline);
      navigator.serviceWorker.removeEventListener("controllerchange", onController);
      if (warmTimer) window.clearTimeout(warmTimer);
    };
  }, []);

  return null;
}
