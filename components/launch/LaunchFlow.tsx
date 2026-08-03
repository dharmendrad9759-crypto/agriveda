"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AgriVedaSplashScreen from "@/components/launch/AgriVedaSplashScreen";
import { isCapacitorNative } from "@/lib/capacitorNav";

/** Resume after this long in background → show splash again (app icon re-open). */
const RESUME_SPLASH_AFTER_MS = 5_000;

type Phase = "splash" | "done";

async function hideNativePluginSplash(fadeMs = 0) {
  if (!isCapacitorNative()) return;
  try {
    const { SplashScreen } = await import("@capacitor/splash-screen");
    // Instant hide — native plugin / Android 12 icon overlay must not sit on top
    await SplashScreen.hide({ fadeOutDuration: fadeMs });
  } catch {
    /* optional plugin */
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * App open → ONE cream brand splash → app.
 * No intro carousel. Capacitor SplashScreen is hidden immediately so the icon flash
 * is as short as possible (full remove needs new APK with cream system splash).
 */
export default function LaunchFlow() {
  const [phase, setPhase] = useState<Phase>("splash");
  const [reduced, setReduced] = useState(false);
  const [splashKey, setSplashKey] = useState(0);
  const backgroundedAt = useRef<number | null>(null);

  const startSplash = useCallback(() => {
    setSplashKey((k) => k + 1);
    setPhase("splash");
    void hideNativePluginSplash(0);
    // Second tick — some WebViews keep the plugin layer until next frame
    window.setTimeout(() => {
      void hideNativePluginSplash(0);
    }, 50);
  }, []);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    startSplash();

    let remove: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      if (!isCapacitorNative()) return;
      try {
        const { App } = await import("@capacitor/app");
        const handle = await App.addListener("appStateChange", ({ isActive }) => {
          if (cancelled) return;
          if (!isActive) {
            backgroundedAt.current = Date.now();
            return;
          }
          const bg = backgroundedAt.current;
          backgroundedAt.current = null;
          if (bg == null) return;
          if (Date.now() - bg < RESUME_SPLASH_AFTER_MS) return;
          startSplash();
        });
        remove = () => {
          void handle.remove();
        };
      } catch {
        /* web */
      }
    })();

    return () => {
      cancelled = true;
      remove?.();
    };
  }, [startSplash]);

  const finishSplash = useCallback(() => {
    void hideNativePluginSplash(0);
    setPhase("done");
  }, []);

  if (phase === "done") return null;

  return (
    <AgriVedaSplashScreen
      key={splashKey}
      onComplete={finishSplash}
      reducedMotion={reduced}
    />
  );
}
