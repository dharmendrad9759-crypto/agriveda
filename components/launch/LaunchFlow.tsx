"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AgriVedaSplashScreen from "@/components/launch/AgriVedaSplashScreen";
import IntroCarousel from "@/components/launch/IntroCarousel";
import { isCapacitorNative } from "@/lib/capacitorNav";
import { readStorage, writeStorage } from "@/lib/storage";

const INTRO_KEY = "agriveda-intro-carousel-v1";
/** Resume after this long in background → show splash again (app icon re-open). */
const RESUME_SPLASH_AFTER_MS = 5_000;

type Phase = "splash" | "intro" | "done";

function readIntroDone(): boolean {
  return readStorage<boolean>(INTRO_KEY, false) === true;
}

function markIntroDone() {
  writeStorage(INTRO_KEY, true);
}

async function hideNativePluginSplash(fadeMs = 280) {
  if (!isCapacitorNative()) return;
  try {
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide({ fadeOutDuration: fadeMs });
  } catch {
    /* optional plugin */
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function phaseAfterSplash(): Phase {
  return readIntroDone() ? "done" : "intro";
}

/**
 * Cream brand splash on cold start / resume.
 * On Capacitor we HIDE the native SplashScreen plugin as soon as React splash mounts —
 * SplashScreen.show() sat ON TOP of the WebView, so phone users never saw the cream UI
 * (browser had no plugin — that's why only browser worked).
 */
export default function LaunchFlow() {
  const [phase, setPhase] = useState<Phase>("splash");
  const [locale, setLocale] = useState<"hi" | "en">("hi");
  const [reduced, setReduced] = useState(false);
  const [splashKey, setSplashKey] = useState(0);
  const backgroundedAt = useRef<number | null>(null);

  const startSplash = useCallback(() => {
    setSplashKey((k) => k + 1);
    setPhase("splash");
    void hideNativePluginSplash(180);
  }, []);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    try {
      const stored = localStorage.getItem("agriveda-app-locale");
      if (stored) {
        const parsed = JSON.parse(stored) as string;
        setLocale(parsed === "en" ? "en" : "hi");
      }
    } catch {
      /* default hi */
    }

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
        /* web or plugin missing */
      }
    })();

    return () => {
      cancelled = true;
      remove?.();
    };
  }, [startSplash]);

  const finishSplash = useCallback(() => {
    void hideNativePluginSplash(200);
    setPhase(phaseAfterSplash());
  }, []);

  const finishIntro = useCallback(() => {
    markIntroDone();
    setPhase("done");
  }, []);

  if (phase === "done") return null;

  if (phase === "splash") {
    return (
      <AgriVedaSplashScreen
        key={splashKey}
        onComplete={finishSplash}
        reducedMotion={reduced}
      />
    );
  }

  return <IntroCarousel onComplete={finishIntro} locale={locale} />;
}
