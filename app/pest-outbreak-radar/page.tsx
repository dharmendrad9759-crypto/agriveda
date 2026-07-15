"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import {
  Bell,
  BellOff,
  Loader2,
  Map as MapIcon,
  Navigation,
  Plus,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import OutbreakListView from "@/components/outbreak-radar/OutbreakListView";
import { useOutbreakRadar } from "@/hooks/useOutbreakRadar";
import { cn } from "@/lib/cn";
import { AV } from "@/lib/design/tokens";

const OutbreakMap = dynamic(() => import("@/components/outbreak-radar/OutbreakMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed border-[var(--av-border)] text-[var(--av-text-muted)]">
      <Loader2 className="h-6 w-6 animate-spin text-[var(--av-accent)]" />
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
    <AppShell
      title="प्रकोप रडार"
      subtitle="नज़दीकी कीट/रोग चेतावनी — map ya list"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Outbreak Radar" }]}
    >
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => refresh()}
          disabled={loading}
          className="rounded-lg p-1.5 text-[var(--av-accent)]"
          aria-label="Refresh"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </button>
      </div>

      <AppLink href="/pest-outbreak-radar/report" className={`flex w-full justify-center gap-2 ${AV.btnPrimary}`}>
        <Plus className="h-5 w-5" />
        Report an Issue
      </AppLink>

      {clusters.length > 0 && (
        <div className="mt-4 space-y-2">
          {clusters.map((c) => (
            <AppLink
              key={`${c.cropId}-${c.pestOrDiseaseId}`}
              href={c.advisoryUrl}
              className="block rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3"
            >
              <p className="text-sm font-bold text-red-600 dark:text-red-300">
                ⚠️ {c.threatName} outbreak nearby
              </p>
              <p className="text-xs text-red-600/90 dark:text-red-400">
                {c.reportCount} reports within {c.radiusKm} km — check your {c.cropName} fields
              </p>
            </AppLink>
          ))}
        </div>
      )}

      {!isSupabaseConfigured() && (
        <p className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-center text-[11px] font-semibold text-amber-900 dark:text-amber-200">
          Nearby outbreak map empty jab tak live reports connected nahi. Aap apna field report still save/sync kar sakte hain jab backend ready ho.
        </p>
      )}

      {error && (
        <DarkCard className="mt-4 border-amber-500/30">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-300">{error}</p>
          <button
            type="button"
            onClick={requestGps}
            className="mt-2 flex items-center gap-1 text-xs font-bold text-[var(--av-accent)]"
          >
            <Navigation className="h-3.5 w-3.5" />
            Use GPS location
          </button>
        </DarkCard>
      )}

      {fromCache && (
        <p className="mt-3 flex items-center justify-center gap-1 text-[10px] font-bold text-amber-600">
          <WifiOff className="h-3 w-3" />
          Showing cached reports (offline)
        </p>
      )}

      <DarkCard className="mt-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView("map")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold",
              view === "map"
                ? "bg-[var(--av-accent)] text-[#0a0f1a]"
                : "border border-[var(--av-border)] text-[var(--av-text-muted)]"
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
              view === "list"
                ? "bg-[var(--av-accent)] text-[#0a0f1a]"
                : "border border-[var(--av-border)] text-[var(--av-text-muted)]"
            )}
          >
            List
          </button>
        </div>
      </DarkCard>

      {loading && lat == null && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--av-accent)]" />
        </div>
      )}

      {lat != null && lon != null && view === "map" && (
        <DarkCard className="mt-4" delay={1}>
          <p className="mb-2 text-xs font-bold text-[var(--av-text-muted)]">
            Reports within 10 km (last 14 days) — {reports.length} pin{reports.length !== 1 ? "s" : ""}
          </p>
          <OutbreakMap lat={lat} lon={lon} reports={reports} />
        </DarkCard>
      )}

      {view === "list" && (
        <div className="mt-4">
          <OutbreakListView summaries={summaries} />
        </div>
      )}

      <button
        type="button"
        onClick={toggleAlerts}
        className={cn(
          "mt-4 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold",
          alertsEnabled
            ? "border-[var(--av-accent)]/40 bg-[var(--av-accent-soft)] text-[var(--av-accent)]"
            : "border-[var(--av-border)] text-[var(--av-text-muted)]"
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
    </AppShell>
  );
}
