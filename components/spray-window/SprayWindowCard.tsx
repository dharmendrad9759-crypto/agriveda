"use client";

import AppLink from "@/components/ui/AppLink";
import { Bell, BellOff, ChevronRight, Loader2, MapPin, RefreshCw, Wind } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SprayWindowTimeline from "@/components/spray-window/SprayWindowTimeline";
import { useSprayWindow } from "@/hooks/useSprayWindow";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  statusBorder,
  statusTextColor,
} from "@/lib/sprayWindow";
import { cn } from "@/lib/cn";

type SprayStatus = "GOOD" | "CAUTION" | "AVOID";

const STATUS_KEYS: Record<SprayStatus, "sprayStatusGood" | "sprayStatusCaution" | "sprayStatusAvoid"> = {
  GOOD: "sprayStatusGood",
  CAUTION: "sprayStatusCaution",
  AVOID: "sprayStatusAvoid",
};

const STATUS_DOT: Record<SprayStatus, string> = {
  GOOD: "bg-emerald-500",
  CAUTION: "bg-amber-400",
  AVOID: "bg-red-500",
};

export default function SprayWindowCard({ compact = false }: { compact?: boolean }) {
  const { t, locale } = useLocale();
  const isEn = locale === "en";
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

  if (compact) {
    return (
      <GlassCard className="overflow-hidden p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Wind className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <div className="min-w-0">
              <h3 className="truncate text-xs font-extrabold theme-text-primary">{t("sprayAdvisorTitle")}</h3>
              <p className="truncate text-[9px] theme-text-muted">{t("sprayAdvisorSubtitle")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            aria-label={t("refreshLabel")}
            className="shrink-0 rounded-lg p-1 text-emerald-600 hover:bg-emerald-500/10 disabled:opacity-50"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </button>
        </div>

        <div className="mt-2.5">
          {!bundle && !loading && (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-2.5 py-2">
              <p className="text-[10px] font-semibold theme-text-muted">{t("sprayNoLocation")}</p>
              <button
                type="button"
                onClick={loadWithGps}
                className="shrink-0 rounded-lg bg-[#006432] px-2.5 py-1 text-[9px] font-bold text-white"
              >
                {t("sprayUseLocation")}
              </button>
            </div>
          )}

          {loading && !analysis && (
            <div className="flex items-center gap-2 py-2 text-[10px] theme-text-muted">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />
              {t("sprayLoading")}
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-2 py-1.5 text-[10px] font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          {analysis && status && (
            <div className={cn("rounded-xl border px-2.5 py-2", statusBorder(status))}>
              <div className="flex items-center gap-2">
                <div className={cn("h-2.5 w-2.5 shrink-0 rounded-full", STATUS_DOT[status])} aria-hidden />
                <p className={cn("text-xs font-black", statusTextColor(status))}>
                  {t(STATUS_KEYS[status])}
                </p>
              </div>
              <p className={cn("mt-1 line-clamp-2 text-[10px] leading-snug", statusTextColor(status))}>
                {isEn ? analysis.current.reasonEn : analysis.current.reasonHi}
              </p>
              {bundle && (
                <p className="mt-1 truncate text-[9px] theme-text-muted">📍 {bundle.location}</p>
              )}
            </div>
          )}
        </div>

        <AppLink
          href="/weather/spray-advisory"
          className="mt-2 flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-600"
        >
          {t("sprayFullDetails")}
          <ChevronRight className="h-3 w-3" />
        </AppLink>
      </GlassCard>
    );
  }

  return (
    <GlassCard neon className="overflow-hidden p-0">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-emerald-500" />
            <div>
              <h3 className="text-sm font-extrabold theme-text-primary">{t("sprayAdvisorTitle")}</h3>
              <p className="text-[10px] theme-text-muted">{t("sprayAdvisorSubtitle")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            aria-label={t("refreshLabel")}
            className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-500/10 disabled:opacity-50"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="space-y-4 p-4">
        {!bundle && !loading && (
          <div className="text-center">
            <MapPin className="mx-auto h-8 w-8 text-emerald-500/70" />
            <p className="mt-2 text-sm font-bold theme-text-primary">{t("sprayNoLocation")}</p>
            <p className="mt-1 text-xs theme-text-muted">{t("sprayNoLocationHint")}</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={loadWithGps}
                className="rounded-xl bg-[#006432] px-4 py-2.5 text-xs font-black text-white"
              >
                {t("sprayUseLocation")}
              </button>
              <AppLink
                href="/weather"
                className="rounded-xl border border-emerald-500/30 px-4 py-2.5 text-xs font-bold text-emerald-600"
              >
                {t("spraySetOnWeather")}
              </AppLink>
            </div>
          </div>
        )}

        {loading && !analysis && (
          <div className="flex items-center justify-center gap-2 py-6 text-sm theme-text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
            {t("sprayLoading")}
          </div>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-center text-xs font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        {analysis && status && (
          <>
            <div className={cn("rounded-2xl border p-4", statusBorder(status))}>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-4 w-4 flex-shrink-0 rounded-full shadow-lg",
                    STATUS_DOT[status],
                    status === "GOOD" && "shadow-emerald-500/50",
                    status === "CAUTION" && "shadow-amber-400/50",
                    status === "AVOID" && "shadow-red-500/50"
                  )}
                  aria-hidden
                />
                <p className={cn("text-base font-black", statusTextColor(status))}>
                  {t(STATUS_KEYS[status])}
                </p>
              </div>

              <p className={cn("mt-3 text-sm leading-relaxed", statusTextColor(status))}>
                {isEn ? analysis.current.reasonEn : analysis.current.reasonHi}
              </p>

              {bundle && (
                <p className="mt-2 text-[10px] theme-text-muted">📍 {bundle.location}</p>
              )}
            </div>

            {analysis.nextGoodWindow && status !== "GOOD" && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {isEn ? analysis.nextGoodWindowLabel : nextGoodHi ?? analysis.nextGoodWindowLabel}
                </p>
              </div>
            )}

            {analysis.timeline.length > 0 && (
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider theme-text-muted">
                  {t("sprayNext12Hours")}
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
                  {t("sprayAlertsOn")}
                </>
              ) : (
                <>
                  <BellOff className="h-3.5 w-3.5" />
                  {t("sprayAlertsOff")}
                </>
              )}
            </button>
          </>
        )}
      </div>
    </GlassCard>
  );
}
