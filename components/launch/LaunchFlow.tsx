"use client";

import { useCallback, useEffect, useState } from "react";
import AgriVedaSplashScreen from "@/components/launch/AgriVedaSplashScreen";
import IntroCarousel from "@/components/launch/IntroCarousel";
import { isCapacitorNative } from "@/lib/capacitorNav";
import { introDone, markIntroDone } from "@/lib/launchFlags";

/** Once per cold process — SoftNav remounts keep this */
const SPLASH_SESSION_KEY = "agriveda-open-splash-v2";
const FARMER_PROFILE_KEY = "agriveda-farmer-profile";

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

function farmerSetupDone(): boolean {
  try {
    const raw = localStorage.getItem(FARMER_PROFILE_KEY);
    if (!raw) return false;
    const p = JSON.parse(raw) as {
      onboardingComplete?: boolean;
      farmSetupComplete?: boolean;
    };
    return Boolean(p.onboardingComplete && p.farmSetupComplete);
  } catch {
    return false;
  }
}

/** Returning users skip splash + intro — straight into the app. */
function hasCompletedFirstRun(): boolean {
  return introDone() || farmerSetupDone();
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
  if (hasCompletedFirstRun()) return "done";
  if (!splashAlreadyShown()) return "splash";
  return "intro";
}

/**
 * First open: splash → swipe intro (once) → app / Google gate.
 * Later opens: no splash, no carousel — app only.
 */
export default function LaunchFlow() {
  const [phase, setPhase] = useState<Phase>(() => resolvePhase());
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const next = resolvePhase();
    setPhase(next);
    void hideNativePluginSplash(0);
  }, []);

  const finishSplash = useCallback(() => {
    markSplashShown();
    void hideNativePluginSplash(0);
    setPhase(hasCompletedFirstRun() ? "done" : "intro");
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
