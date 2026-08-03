"use client";

import { useCallback, useEffect, useState } from "react";
import AgriVedaSplashScreen from "@/components/launch/AgriVedaSplashScreen";
import IntroCarousel from "@/components/launch/IntroCarousel";
import { isCapacitorNative } from "@/lib/capacitorNav";
import { readStorage, writeStorage } from "@/lib/storage";

const SPLASH_SESSION_KEY = "agriveda-launch-splash-v1";
const INTRO_KEY = "agriveda-intro-carousel-v1";

type Phase = "boot" | "splash" | "intro" | "done";

function readSplashDone(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markSplashDone() {
  try {
    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

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

async function holdNativePluginSplash() {
  if (!isCapacitorNative()) return;
  try {
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.show({ autoHide: false, fadeInDuration: 0 });
  } catch {
    /* optional */
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function resolveInitialPhase(): Phase {
  if (typeof window === "undefined") return "boot";
  const splashDone = readSplashDone();
  const introDone = readIntroDone();
  if (splashDone && introDone) return "done";
  if (!splashDone) return "splash";
  return introDone ? "done" : "intro";
}

/**
 * Splash (2.5s) → Intro carousel (once) → existing login/onboarding gate.
 * Covers web + Capacitor; replaces legacy BootSplash / NativeLaunchSplash visuals.
 */
export default function LaunchFlow() {
  const [phase, setPhase] = useState<Phase>(resolveInitialPhase);
  const [locale, setLocale] = useState<"hi" | "en">("hi");
  const [reduced, setReduced] = useState(false);

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

    // Reconcile after paint (sessionStorage / locale), keep Capacitor plugin in sync
    const next = resolveInitialPhase();
    setPhase(next);
    if (next === "splash") void holdNativePluginSplash();
    else void hideNativePluginSplash(200);
  }, []);

  const finishSplash = useCallback(() => {
    markSplashDone();
    void hideNativePluginSplash(360);
    if (readIntroDone()) {
      setPhase("done");
      return;
    }
    setPhase("intro");
  }, []);

  const finishIntro = useCallback(() => {
    markIntroDone();
    setPhase("done");
  }, []);

  if (phase === "boot" || phase === "done") return null;

  if (phase === "splash") {
    return <AgriVedaSplashScreen onComplete={finishSplash} reducedMotion={reduced} />;
  }

  return <IntroCarousel onComplete={finishIntro} locale={locale} />;
}
