"use client";

import { useCallback, useEffect, useState } from "react";
import AgriVedaSplashScreen from "@/components/launch/AgriVedaSplashScreen";
import IntroCarousel from "@/components/launch/IntroCarousel";
import { isCapacitorNative } from "@/lib/capacitorNav";
import { readStorage, writeStorage } from "@/lib/storage";

/** Once per WebView process — SoftNav hardNavigate remounts React but keeps sessionStorage */
const SPLASH_SESSION_KEY = "agriveda-open-splash-v2";
const INTRO_KEY = "agriveda-intro-carousel-v2";

type Phase = "checking" | "splash" | "intro" | "done";

function splashAlreadyShown(): boolean {
  try {
    return sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markSplashShown() {
  try {
    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

function introDone(): boolean {
  return readStorage<boolean>(INTRO_KEY, false) === true;
}

function markIntroDone() {
  writeStorage(INTRO_KEY, true);
}

async function hideNativePluginSplash(fadeMs = 0) {
  if (!isCapacitorNative()) return;
  try {
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide({ fadeOutDuration: fadeMs });
  } catch {
    /* optional */
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function resolvePhase(): Phase {
  if (typeof window === "undefined") return "checking";
  if (!splashAlreadyShown()) return "splash";
  if (!introDone()) return "intro";
  return "done";
}

/**
 * Cold open only: cream splash → onboarding (once) → app.
 * SoftNav full reloads do NOT re-show splash (sessionStorage).
 * No appStateChange resume splash — that felt like “every button opens splash”.
 */
export default function LaunchFlow() {
  const [phase, setPhase] = useState<Phase>(() => resolvePhase());
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const next = resolvePhase();
    setPhase(next);
    if (next === "splash" || next === "intro") {
      void hideNativePluginSplash(0);
    } else {
      void hideNativePluginSplash(0);
    }
  }, []);

  const finishSplash = useCallback(() => {
    markSplashShown();
    void hideNativePluginSplash(0);
    setPhase(introDone() ? "done" : "intro");
  }, []);

  const finishIntro = useCallback(() => {
    markIntroDone();
    markSplashShown();
    setPhase("done");
  }, []);

  if (phase === "checking" || phase === "done") return null;

  if (phase === "splash") {
    return <AgriVedaSplashScreen onComplete={finishSplash} reducedMotion={reduced} />;
  }

  return <IntroCarousel onComplete={finishIntro} />;
}
