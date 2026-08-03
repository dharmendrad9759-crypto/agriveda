"use client";

import { useEffect, useState } from "react";
import AgriVedaBrandMark from "@/components/brand/AgriVedaBrandMark";
import { BRAND } from "@/lib/brand";

const SPLASH_MS = 2800;
const EXIT_MS = 480;

type Props = {
  onComplete: () => void;
  reducedMotion?: boolean;
};

/**
 * Cream Agriveda launch splash (prompt palette).
 * Topbar Leaf mark + Hindi pill + soft gold accent — no launcher-icon art.
 */
export default function AgriVedaSplashScreen({ onComplete, reducedMotion = false }: Props) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Hide Capacitor overlay as soon as branded paint exists
    if (
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-capacitor-native") === "true"
    ) {
      void import("@capacitor/splash-screen")
        .then(({ SplashScreen }) => SplashScreen.hide({ fadeOutDuration: 0 }))
        .catch(() => {});
    }

    const total = reducedMotion ? 800 : SPLASH_MS;
    const exitAt = Math.max(0, total - (reducedMotion ? 120 : EXIT_MS));
    const tExit = window.setTimeout(() => setExiting(true), exitAt);
    const tDone = window.setTimeout(onComplete, total);
    return () => {
      window.clearTimeout(tExit);
      window.clearTimeout(tDone);
    };
  }, [onComplete, reducedMotion]);

  return (
    <div
      id="agriveda-splash-screen"
      role="status"
      aria-live="polite"
      aria-busy={!exiting}
      className={`agriveda-splash fixed inset-0 z-[100000] flex flex-col items-center justify-center overflow-hidden ${
        exiting ? "agriveda-splash--exit" : ""
      }`}
      style={{
        background:
          "radial-gradient(ellipse at 50% 22%, #FFFFFF 0%, #F8F9FA 38%, #F4F6F0 72%, #E8EFE4 100%)",
      }}
    >
      {/* Soft mint bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[18%] h-[280px] w-[280px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,168,107,0.16) 0%, rgba(0,168,107,0.04) 45%, transparent 70%)",
        }}
      />
      {/* Gold stalk accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[18%] left-1/2 h-32 w-48 -translate-x-1/2 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(ellipse, rgba(212,175,55,0.35) 0%, transparent 70%)",
        }}
      />
      {/* Fine leaf-dot texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='72' height='72' viewBox='0 0 72 72' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 10c-7 12-7 26 0 38 7-12 7-26 0-38z' fill='%231E4D40'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="agriveda-splash__brand relative z-10 flex flex-col items-center px-6 text-center">
        {/* Ring + brand mark (same Leaf as topbar — not launcher icon) */}
        <div className="agriveda-splash__logo relative mb-6">
          <div
            aria-hidden
            className="absolute -inset-3 rounded-[34px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(212,175,55,0.55), rgba(0,168,107,0.25), transparent 70%)",
              opacity: 0.9,
            }}
          />
          <AgriVedaBrandMark
            sizeClassName="relative h-[108px] w-[108px] rounded-[28px] shadow-[0_20px_48px_rgba(30,77,64,0.28)] ring-2 ring-white/80"
            iconClassName="h-[52px] w-[52px]"
          />
        </div>

        <h1 className="m-0 font-display text-[clamp(2rem,8vw,2.55rem)] font-extrabold leading-none tracking-tight text-[#1E4D40]">
          {BRAND}
        </h1>
        <p className="mt-2 text-[12px] font-bold tracking-[0.2em] text-[#1E4D40]/50 uppercase">
          Digital Farmers
        </p>

        {/* Gold hairline */}
        <div
          aria-hidden
          className="mt-4 h-px w-16"
          style={{
            background:
              "linear-gradient(90deg, transparent, #D4AF37, transparent)",
          }}
        />

        <div className="mt-5 inline-flex max-w-[min(92vw,340px)] items-center justify-center rounded-full bg-[#1E4D40] px-6 py-2.5 shadow-[0_12px_32px_-10px_rgba(30,77,64,0.55)]">
          <span className="text-[13px] font-semibold leading-none text-white sm:text-[14px]">
            स्मार्ट खेती, बेहतर फसल
          </span>
        </div>
      </div>

      <div className="absolute bottom-[max(2.35rem,env(safe-area-inset-bottom))] z-10 flex flex-col items-center gap-3.5">
        <div className="agriveda-splash__spinner" aria-hidden />
        <span className="text-[10px] font-semibold tracking-[0.22em] text-[#1E4D40]/32">
          MADE FOR INDIAN FARMERS
        </span>
      </div>

      <style>{`
        .agriveda-splash {
          opacity: 1;
          transition: opacity ${EXIT_MS}ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .agriveda-splash--exit {
          opacity: 0;
          pointer-events: none;
        }
        .agriveda-splash__logo {
          animation: agriveda-splash-pop 0.95s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .agriveda-splash__brand h1,
        .agriveda-splash__brand p,
        .agriveda-splash__brand div {
          animation: agriveda-splash-rise 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .agriveda-splash__brand h1 { animation-delay: 0.16s; }
        .agriveda-splash__brand p { animation-delay: 0.26s; }
        .agriveda-splash__brand div { animation-delay: 0.34s; }
        .agriveda-splash__spinner {
          width: 26px;
          height: 26px;
          border-radius: 9999px;
          border: 2.5px solid rgba(30, 77, 64, 0.12);
          border-top-color: #00A86B;
          border-right-color: #D4AF37;
          animation: agriveda-splash-spin 0.8s linear infinite;
        }
        @keyframes agriveda-splash-pop {
          from { opacity: 0; transform: scale(0.68); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes agriveda-splash-rise {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes agriveda-splash-spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .agriveda-splash__logo,
          .agriveda-splash__brand h1,
          .agriveda-splash__brand p,
          .agriveda-splash__brand div {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .agriveda-splash__spinner {
            animation: agriveda-splash-pulse 1.2s ease-in-out infinite;
            border: none;
            background: #00A86B;
          }
          @keyframes agriveda-splash-pulse {
            0%, 100% { opacity: 0.35; transform: scale(0.85); }
            50% { opacity: 1; transform: scale(1); }
          }
        }
      `}</style>
    </div>
  );
}
