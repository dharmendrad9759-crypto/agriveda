"use client";

import { useEffect, useState } from "react";
import { isCapacitorNative } from "@/lib/capacitorNav";
import { BRAND } from "@/lib/brand";

const KEY = "agriveda-native-splash-v1";
const DURATION_MS = 4200;

function shouldShowNow(): boolean {
  if (typeof window === "undefined") return false;
  if (!isCapacitorNative()) return false;
  try {
    return sessionStorage.getItem(KEY) !== "1";
  } catch {
    return true;
  }
}

/**
 * Phone-only launch splash. SoftNav reloads skip via sessionStorage.
 * Does not rely on Capacitor SplashScreen drawable (often only shows icon on Android 12).
 */
export default function NativeLaunchSplash() {
  const [visible, setVisible] = useState(shouldShowNow);

  useEffect(() => {
    if (!isCapacitorNative()) return;

    if (!visible) {
      void import("@capacitor/splash-screen").then(({ SplashScreen }) =>
        SplashScreen.hide({ fadeOutDuration: 200 })
      );
      return;
    }

    (async () => {
      try {
        const { SplashScreen } = await import("@capacitor/splash-screen");
        // Keep plugin layer until our branded overlay finishes
        await SplashScreen.show({ autoHide: false, fadeInDuration: 0 });
      } catch {
        /* optional */
      }
    })();

    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
      setVisible(false);
      void import("@capacitor/splash-screen")
        .then(({ SplashScreen }) => SplashScreen.hide({ fadeOutDuration: 400 }))
        .catch(() => {});
    }, DURATION_MS);

    return () => window.clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      id="agriveda-native-launch-splash"
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, #0d4f3c 0%, #04140f 55%, #020a07 100%)",
      }}
      aria-busy
      aria-live="polite"
    >
      {/* Leaf-vein texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 8 C28 28 28 52 40 72 C52 52 52 28 40 8 Z' fill='none' stroke='%236ee7b7' stroke-width='1'/%3E%3Cpath d='M40 20 L40 60' stroke='%236ee7b7' stroke-width='0.8'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-[18%] h-40 w-40 -translate-x-1/2 rounded-full bg-emerald-400/25 blur-3xl"
      />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-[26px] bg-gradient-to-br from-emerald-400 to-teal-800 shadow-[0_20px_60px_-12px_rgba(16,185,129,0.65)] ring-1 ring-white/25">
          <svg viewBox="0 0 80 80" className="h-14 w-14" aria-hidden>
            <path d="M40 70 V30" stroke="#ecfdf5" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M40 44 C26 36 20 24 24 12 C36 18 40 30 40 44 Z" fill="#a7f3d0" />
            <path d="M40 48 C54 40 60 28 56 14 C46 20 40 34 40 48 Z" fill="#6ee7b7" />
          </svg>
        </div>
        <h1
          className="m-0 font-display text-[clamp(2.4rem,9vw,3.2rem)] font-bold leading-none tracking-tight text-white"
          style={{ textShadow: "0 12px 40px rgba(0,0,0,0.45)" }}
        >
          {BRAND}
        </h1>
        <p className="mt-3 text-[15px] font-medium text-emerald-50/90">खेत की बुद्धि</p>
        <div className="relative mt-9 h-[3px] w-36 overflow-hidden rounded-full bg-white/15">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-lime-300 via-emerald-400 to-teal-300"
            style={{
              animation: `agriveda-splash-bar ${DURATION_MS}ms linear forwards`,
            }}
          />
        </div>
      </div>
      <p className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] text-[10px] font-semibold tracking-[0.2em] text-emerald-100/40">
        MADE FOR INDIAN FARMERS
      </p>
      <style>{`@keyframes agriveda-splash-bar{from{width:0%}to{width:100%}}`}</style>
    </div>
  );
}
