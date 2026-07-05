"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  BellOff,
  List,
  Loader2,
  Map as MapIcon,
  Navigation,
  Plus,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import PageBackground from "@/components/ui/PageBackground";
import GlassCard from "@/components/ui/GlassCard";
import { isSupabaseConfigured } from "@/lib/supabase";
import OutbreakListView from "@/components/outbreak-radar/OutbreakListView";
import { useOutbreakRadar } from "@/hooks/useOutbreakRadar";
import { cn } from "@/lib/cn";

const OutbreakMap = dynamic(() => import("@/components/outbreak-radar/OutbreakMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed theme-text-muted">
      <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
    </div>
  ),
});

export default function PestOutbreakRadarPage() {
  const [view, setView] = useState<"map" | "list">("map");
  const {
    lat,
    lon,
    reports,
    clusters,
    summaries,
    loading,
    error,
    fromCache,
    alertsEnabled,
    hydrated,
    requestGps,
    toggleAlerts,
    refresh,
  } = useOutbreakRadar();

  if (!hydrated) return null;

  return (
    <div className="agriveda-page relative min-h-screen">
      <PageBackground />

      <header className="sticky top-0 z-40 border-b border-emerald-500/10 bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 text-emerald-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-base font-extrabold theme-text-primary">प्रकोप रडार</h1>
              <p className="text-[10px] theme-text-muted">नज़दीकी कीट/रोग चेतावनी</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            className="rounded-lg p-1.5 text-emerald-600"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>
      </header>

      <div className="relative mx-auto max-w-lg space-y-4 px-4 py-5">
        <Link
          href="/pest-outbreak-radar/report"
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#006432] py-4 text-sm font-black text-white shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Report an Issue
        </Link>

        {clusters.length > 0 && (
          <div className="space-y-2">
            {clusters.map((c) => (
              <Link
                key={`${c.cropId}-${c.pestOrDiseaseId}`}
                href={c.advisoryUrl}
                className="block rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3"
              >
                <p className="text-sm font-extrabold text-red-700 dark:text-red-300">
                  ⚠️ {c.threatName} outbreak nearby
                </p>
                <p className="text-xs text-red-600/90 dark:text-red-400">
                  {c.reportCount} reports within {c.radiusKm} km — check your {c.cropName} fields
                </p>
              </Link>
            ))}
          </div>
        )}

        {!isSupabaseConfigured() && (
          <p className="rounded-xl border border-sky-500/25 bg-sky-500/10 px-3 py-2 text-center text-[11px] font-semibold text-sky-800 dark:text-sky-200">
            डेमो मोड — आस-पास की sample चेतावनी दिख रही है। Live data ke liye Supabase setup karein.
          </p>
        )}

        {error && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-50 px-4 py-3 dark:bg-amber-500/10">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-300">{error}</p>
            <button
              type="button"
              onClick={requestGps}
              className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-600"
            >
              <Navigation className="h-3.5 w-3.5" />
              Use GPS location
            </button>
          </div>
        )}

        {fromCache && (
          <p className="flex items-center justify-center gap-1 text-[10px] font-bold text-amber-600">
            <WifiOff className="h-3 w-3" />
            Showing cached reports (offline)
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView("map")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold",
              view === "map" ? "bg-emerald-600 text-white" : "border theme-text-muted"
            )}
          >
            <MapIcon className="h-3.5 w-3.5" />
            Map
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold",
              view === "list" ? "bg-emerald-600 text-white" : "border theme-text-muted"
            )}
          >
            <List className="h-3.5 w-3.5" />
            List
          </button>
        </div>

        {loading && lat == null && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        )}

        {lat != null && lon != null && view === "map" && (
          <GlassCard className="p-3">
            <p className="mb-2 text-xs font-bold theme-text-muted">
              Reports within 10 km (last 14 days) — {reports.length} pin{reports.length !== 1 ? "s" : ""}
            </p>
            <OutbreakMap lat={lat} lon={lon} reports={reports} />
          </GlassCard>
        )}

        {view === "list" && <OutbreakListView summaries={summaries} />}

        <button
          type="button"
          onClick={toggleAlerts}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold",
            alertsEnabled
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
              : "theme-text-muted"
          )}
        >
          {alertsEnabled ? (
            <>
              <Bell className="h-3.5 w-3.5" />
              Outbreak alerts on
            </>
          ) : (
            <>
              <BellOff className="h-3.5 w-3.5" />
              Enable outbreak push alerts
            </>
          )}
        </button>
      </div>
    </div>
  );
}
