"use client";

import { useEffect, useState } from "react";
import AgriVedaBrandMark from "@/components/brand/AgriVedaBrandMark";
import { BRAND } from "@/lib/brand";

const SPLASH_MS = 3000;
const EXIT_MS = 520;

type Props = {
  onComplete: () => void;
  reducedMotion?: boolean;
};

/**
 * Single launch moment: cream Agriveda splash (prompt palette + polish).
 * Not the Android launcher icon — that layer is cream-blank in the APK.
 */
export default function AgriVedaSplashScreen({ onComplete, reducedMotion = false }: Props) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-capacitor-native") === "true"
    ) {
      void import("@capacitor/splash-screen")
        .then(({ SplashScreen }) => SplashScreen.hide({ fadeOutDuration: 0 }))
        .catch(() => {});
    }

    const total = reducedMotion ? 900 : SPLASH_MS;
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
          "radial-gradient(ellipse at 50% 20%, #FFFFFF 0%, #F8F9FA 42%, #F4F6F0 78%, #E7EFE3 100%)",
      }}
    >
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 32%, rgba(0,168,107,0.14) 0%, transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-10 h-56 w-56 rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.22) 0%, transparent 68%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-24 h-64 w-64 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(30,77,64,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 12c-8 14-8 30 0 44 8-14 8-30 0-44z' fill='%231E4D40'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="agriveda-splash__brand relative z-10 flex flex-col items-center px-6 text-center">
        <div className="agriveda-splash__logo relative mb-7">
          <div
            aria-hidden
            className="agriveda-splash__ring absolute left-1/2 top-1/2 h-[148px] w-[148px] -translate-x-1/2 -translate-y-1/2 rounded-[36px]"
            style={{
              background:
                "conic-gradient(from 210deg, #D4AF37, #00A86B, #1E4D40, #D4AF37)",
              opacity: 0.55,
              filter: "blur(0.2px)",
            }}
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[136px] w-[136px] -translate-x-1/2 -translate-y-1/2 rounded-[32px] bg-[#F8F9FA]"
          />
          <AgriVedaBrandMark
            sizeClassName="relative h-[112px] w-[112px] rounded-[28px] shadow-[0_22px_50px_rgba(30,77,64,0.28)]"
            iconClassName="h-14 w-14"
          />
        </div>

        <h1 className="m-0 font-display text-[clamp(2.05rem,8.5vw,2.7rem)] font-extrabold leading-none tracking-tight text-[#1E4D40]">
          {BRAND}
        </h1>
        <p className="mt-2.5 text-[12px] font-bold tracking-[0.22em] text-[#1E4D40]/48 uppercase">
          Digital Farmers
        </p>

        <div
          aria-hidden
          className="mt-5 flex items-center gap-2.5"
        >
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>

        <div className="mt-5 inline-flex max-w-[min(92vw,340px)] items-center justify-center rounded-full bg-[#1E4D40] px-6 py-3 shadow-[0_14px_36px_-12px_rgba(30,77,64,0.6)]">
          <span className="text-[13px] font-semibold leading-none text-white sm:text-[14px]">
            स्मार्ट खेती, बेहतर फसल
          </span>
        </div>
      </div>

      <div className="absolute bottom-[max(2.4rem,env(safe-area-inset-bottom))] z-10 flex flex-col items-center gap-3.5">
        <div className="agriveda-splash__spinner" aria-hidden />
        <span className="text-[10px] font-semibold tracking-[0.22em] text-[#1E4D40]/30">
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
          animation: agriveda-splash-pop 1s cubic-bezier(0.34, 1.45, 0.64, 1) both;
        }
        .agriveda-splash__ring {
          animation: agriveda-splash-ring 1.4s ease-out both;
        }
        .agriveda-splash__brand h1,
        .agriveda-splash__brand p,
        .agriveda-splash__brand div {
          animation: agriveda-splash-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .agriveda-splash__brand h1 { animation-delay: 0.18s; }
        .agriveda-splash__brand p { animation-delay: 0.28s; }
        .agriveda-splash__brand div { animation-delay: 0.36s; }
        .agriveda-splash__spinner {
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          border: 2.5px solid rgba(30, 77, 64, 0.12);
          border-top-color: #00A86B;
          border-right-color: #D4AF37;
          animation: agriveda-splash-spin 0.85s linear infinite;
        }
        @keyframes agriveda-splash-pop {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes agriveda-splash-ring {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.75); }
          to { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes agriveda-splash-rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes agriveda-splash-spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .agriveda-splash__logo,
          .agriveda-splash__ring,
          .agriveda-splash__brand h1,
          .agriveda-splash__brand p,
          .agriveda-splash__brand div {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .agriveda-splash__ring {
            transform: translate(-50%, -50%) !important;
            opacity: 0.55 !important;
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
