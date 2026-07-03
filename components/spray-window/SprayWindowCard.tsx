"use client";

import Link from "next/link";
import { Bell, BellOff, Loader2, MapPin, RefreshCw, Wind } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SprayWindowTimeline from "@/components/spray-window/SprayWindowTimeline";
import { useSprayWindow } from "@/hooks/useSprayWindow";
import {
  statusBorder,
  statusTextColor,
} from "@/lib/sprayWindow";
import { cn } from "@/lib/cn";

const STATUS_LABEL = {
  GOOD: { en: "Good to spray", hi: "Spray के लिए अच्छा", dot: "bg-emerald-500" },
  CAUTION: { en: "Spray with caution", hi: "सावधानी से spray", dot: "bg-amber-400" },
  AVOID: { en: "Avoid spraying", hi: "Spray न करें", dot: "bg-red-500" },
} as const;

export default function SprayWindowCard() {
  const {
    bundle,
    analysis,
    loading,
    error,
    alertsEnabled,
    hydrated,
    refresh,
    loadWithGps,
    toggleAlerts,
    nextGoodHi,
  } = useSprayWindow();

  if (!hydrated) return null;

  const status = analysis?.current.status;

  return (
    <GlassCard neon className="overflow-hidden p-0">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-emerald-500" />
            <div>
              <h3 className="text-sm font-extrabold theme-text-primary">Spray Window Advisor</h3>
              <p className="text-[10px] theme-text-muted">मौसम से spray का सही समय</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            aria-label="Refresh weather"
            className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-500/10 disabled:opacity-50"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {!bundle && !loading && (
          <div className="text-center">
            <MapPin className="mx-auto h-8 w-8 text-emerald-500/70" />
            <p className="mt-2 text-sm font-bold theme-text-primary">Set location for spray advice</p>
            <p className="mt-1 text-xs theme-text-muted">
              GPS या शहर से मौसम लोड करें
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={loadWithGps}
                className="rounded-xl bg-[#006432] px-4 py-2.5 text-xs font-black text-white"
              >
                Use my location
              </button>
              <Link
                href="/weather"
                className="rounded-xl border border-emerald-500/30 px-4 py-2.5 text-xs font-bold text-emerald-600"
              >
                Set city on Weather
              </Link>
            </div>
          </div>
        )}

        {loading && !analysis && (
          <div className="flex items-center justify-center gap-2 py-6 text-sm theme-text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
            Checking spray conditions…
          </div>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-center text-xs font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        {analysis && status && (
          <>
            <div
              className={cn(
                "rounded-2xl border p-4",
                statusBorder(status)
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-4 w-4 flex-shrink-0 rounded-full shadow-lg",
                    STATUS_LABEL[status].dot,
                    status === "GOOD" && "shadow-emerald-500/50",
                    status === "CAUTION" && "shadow-amber-400/50",
                    status === "AVOID" && "shadow-red-500/50"
                  )}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className={cn("text-base font-black", statusTextColor(status))}>
                    {STATUS_LABEL[status].en}
                  </p>
                  <p className={cn("text-xs font-bold opacity-90", statusTextColor(status))}>
                    {STATUS_LABEL[status].hi}
                  </p>
                </div>
              </div>

              <p className={cn("mt-3 text-sm leading-relaxed", statusTextColor(status))}>
                {analysis.current.reasonEn}
              </p>
              <p className={cn("mt-1 text-xs leading-relaxed opacity-90", statusTextColor(status))}>
                {analysis.current.reasonHi}
              </p>

              {bundle && (
                <p className="mt-2 text-[10px] theme-text-muted">📍 {bundle.location}</p>
              )}
            </div>

            {analysis.nextGoodWindow && status !== "GOOD" && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {analysis.nextGoodWindowLabel}
                </p>
                {nextGoodHi && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    {nextGoodHi}
                  </p>
                )}
              </div>
            )}

            {analysis.timeline.length > 0 && (
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider theme-text-muted">
                  Next 12 hours
                </p>
                <SprayWindowTimeline slots={analysis.timeline} />
              </div>
            )}

            <button
              type="button"
              onClick={toggleAlerts}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition",
                alertsEnabled
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-gray-200 theme-text-muted dark:border-white/10"
              )}
            >
              {alertsEnabled ? (
                <>
                  <Bell className="h-3.5 w-3.5" />
                  Alerts on — notify when AVOID → GOOD
                </>
              ) : (
                <>
                  <BellOff className="h-3.5 w-3.5" />
                  Enable spray window alerts
                </>
              )}
            </button>
          </>
        )}
      </div>
    </GlassCard>
  );
}
