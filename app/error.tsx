"use client";

import { useEffect, useMemo } from "react";
import { AV } from "@/lib/design/tokens";
import { WifiOff, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isNetwork = useMemo(() => {
    if (typeof navigator !== "undefined" && !navigator.onLine) return true;
    const msg = String(error?.message || "").toLowerCase();
    return (
      msg.includes("chunk") ||
      msg.includes("failed to fetch") ||
      msg.includes("network") ||
      msg.includes("timeout") ||
      msg.includes("offline")
    );
  }, [error]);

  useEffect(() => {
    console.error("[app/error]", error?.digest || error?.message);

    // Auto-retry at most once per session for transient chunk load failures (online only)
    if (typeof window !== "undefined") {
      const msg = String(error?.message || "").toLowerCase();
      if (msg.includes("chunk") || msg.includes("failed to fetch")) {
        // Do not automatically reload while offline; keep recovery actions visible
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          return;
        }
        const key = "agriveda-chunk-retry-attempted";
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, "1");
          window.location.reload();
        }
      }
    }
  }, [error]);

  const handleReload = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("agriveda-chunk-retry-attempted");
      window.location.reload();
    } else {
      reset();
    }
  };

  return (
    <div className="mx-auto flex min-h-[65vh] max-w-md flex-col items-center justify-center px-4 py-8 text-center animate-fade-in">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
        {isNetwork ? <WifiOff className="h-7 w-7" /> : <span className="text-2xl">🌱</span>}
      </div>

      <p className="mt-3 text-[11px] font-black uppercase tracking-widest text-[var(--av-accent)]">
        AgriVeda
      </p>

      <h1 className="mt-1 text-xl font-extrabold text-[var(--av-text-primary)]">
        {isNetwork ? "इंटरनेट धीमा या बंद है" : "कुछ गलत हो गया"}
      </h1>

      <p className="mt-2 text-xs leading-relaxed text-[var(--av-text-secondary)]">
        {isNetwork
          ? "कमज़ोर इंटरनेट कनेक्शन के कारण पेज लोड नहीं हो सका। आपका खेत, फसल व खाद का डेटा पूरी तरह सुरक्षित है।"
          : "स्क्रीन लोड नहीं हो पाई। दोबारा कोशिश करें — डेटा सुरक्षित है।"}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={handleReload}
          className={`${AV.btnPrimarySm} flex items-center gap-1.5`}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>पेज फिर से लोड करें</span>
        </button>

        <button
          type="button"
          onClick={reset}
          className={`${AV.btnSecondarySm} flex items-center gap-1.5`}
        >
          <span>दोबारा कोशिश</span>
        </button>

        <a href="/" className={`${AV.btnGhost} flex items-center gap-1.5 text-xs`}>
          <Home className="h-3.5 w-3.5" />
          <span>होम</span>
        </a>
      </div>
    </div>
  );
}
