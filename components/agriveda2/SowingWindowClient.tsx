"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Calendar,
  CheckCircle2,
  CloudRain,
  Droplets,
  MapPin,
  Navigation,
  Settings,
  Thermometer,
  AlertTriangle,
} from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import { cropCatalog } from "@/data/crop-catalog";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { evaluateSowingWindow } from "@/lib/agriveda2/sowingWindowEngine";
import { rankCropsForFarmer } from "@/lib/agriveda2/smartCropEngine";
import { evaluateCropSuitability } from "@/lib/agriveda2/cropSuitability";
import { defaultSoilForState } from "@/data/agriveda2/region-crop-suitability";
import {
  locationFlowErrorMessage,
  resolveFarmerLocationFromGps,
} from "@/lib/farmerLocation";
import {
  openAppLocationPermissionSettings,
  openDeviceLocationSettings,
} from "@/lib/openLocationSettings";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";

const STATUS_STYLE = {
  green: "border-emerald-400 bg-emerald-500/10 text-emerald-800",
  yellow: "border-amber-400 bg-amber-500/10 text-amber-900",
  red: "border-red-400 bg-red-500/10 text-red-900",
};

const VERDICT_STYLE = {
  good: "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
  ok: "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200",
  poor: "border-red-500/40 bg-red-500/10 text-red-900 dark:text-red-200",
};

export default function SowingWindowClient({ initialCrop }: { initialCrop?: string }) {
  const { crops } = useMyCrops();
  const { profile, saveProfile } = useFarmerProfile();
  const myDefault = crops[0]?.slug ?? cropCatalog[0]?.slug ?? "paddy";

  const [cropSlug, setCropSlug] = useState(initialCrop ?? myDefault);
  const [gpsBusy, setGpsBusy] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [weather, setWeather] = useState<{ tempC?: number; rain?: number; loading?: boolean }>({
    loading: true,
  });

  const soilType = profile.state ? defaultSoilForState(profile.state) : "Loamy (Domat)";

  const recommended = useMemo(
    () =>
      rankCropsForFarmer({
        state: profile.state,
        district: profile.district,
        soilType,
        limit: 6,
      }),
    [profile.state, profile.district, soilType]
  );

  useEffect(() => {
    if (initialCrop) {
      setCropSlug(initialCrop);
      return;
    }
    if (recommended[0]?.slug) setCropSlug(recommended[0].slug);
  }, [initialCrop, recommended]);

  useEffect(() => {
    let cancelled = false;
    setWeather((w) => ({ ...w, loading: true }));

    import("@/lib/sprayWeatherApi")
      .then(({ fetchSprayWeatherForProfile }) =>
        fetchSprayWeatherForProfile(profile.district, profile.state)
      )
      .then((b) => {
        if (cancelled) return;
        if (!b) {
          setWeather({ loading: false });
          return;
        }
        setWeather({
          tempC: Math.round(b.current.temperatureC),
          rain: Math.round(b.current.rainProbabilityNext3h * 100),
          loading: false,
        });
      })
      .catch(() => {
        if (!cancelled) setWeather({ loading: false });
      });

    return () => {
      cancelled = true;
    };
  }, [profile.district, profile.state]);

  const result = useMemo(
    () =>
      evaluateSowingWindow(cropSlug, {
        state: profile.state,
        tempC: weather.tempC,
        rainChance3d: weather.rain,
      }),
    [cropSlug, weather, profile.state]
  );

  const suitability = useMemo(
    () =>
      evaluateCropSuitability(cropSlug, {
        state: profile.state,
        district: profile.district,
        soilType,
        tempC: weather.tempC,
        rainChance3d: weather.rain,
      }),
    [cropSlug, profile.state, profile.district, soilType, weather.tempC, weather.rain]
  );

  const refreshGps = async () => {
    setGpsBusy(true);
    setGpsError(null);
    try {
      const loc = await resolveFarmerLocationFromGps();
      const patch: { state?: string; district?: string } = {};
      if (loc.state) patch.state = loc.state;
      if (loc.district) patch.district = loc.district;
      if (Object.keys(patch).length) saveProfile(patch);
    } catch (err) {
      setGpsError(locationFlowErrorMessage(err));
    } finally {
      setGpsBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <DarkCard className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/8 to-transparent p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Aapki jagah
            </p>
            <p className="mt-1 flex items-center gap-1 text-sm font-black text-[var(--av-text-primary)]">
              <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
              {profile.district && profile.state
                ? `${profile.district}, ${profile.state}`
                : profile.state || "Location ON karein"}
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
              Mitti (default): {soilType}
            </p>
          </div>
          <button
            type="button"
            disabled={gpsBusy}
            onClick={() => void refreshGps()}
            className={`${AV.btnSecondarySm} inline-flex items-center gap-1`}
          >
            <Navigation className="h-3.5 w-3.5" />
            {gpsBusy ? "…" : "GPS"}
          </button>
        </div>
        {gpsError && (
          <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5">
            <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">{gpsError}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void openDeviceLocationSettings()}
                className={`${AV.btnSecondarySm} inline-flex items-center gap-1`}
              >
                <Settings className="h-3.5 w-3.5" />
                Location ON
              </button>
              <button
                type="button"
                onClick={() => void openAppLocationPermissionSettings()}
                className={`${AV.btnSecondarySm} inline-flex items-center gap-1`}
              >
                App permission
              </button>
            </div>
          </div>
        )}
      </DarkCard>

      {recommended.length > 0 && (
        <div>
          <p className="mb-1.5 px-0.5 text-xs font-bold text-[var(--av-text-primary)]">
            Is time aapke ilake ke liye recommended
          </p>
          <p className="mb-2 px-0.5 text-[10px] text-[var(--av-text-muted)]">
            Location + mitti + mausam — kisi aur fasal pe tap karke suitability check karein
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {recommended.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCropSlug(c.slug)}
                className={cn(
                  "min-w-[7.5rem] shrink-0 rounded-2xl border px-3 py-2.5 text-left transition",
                  cropSlug === c.slug
                    ? "border-emerald-500/50 bg-emerald-500/15 shadow-sm"
                    : "border-[var(--av-border)] bg-[var(--av-surface)]"
                )}
              >
                <p className="text-lg leading-none">{c.emoji}</p>
                <p className="mt-1 line-clamp-1 text-[11px] font-bold text-[var(--av-text-primary)]">
                  {c.name}
                </p>
                <p className="text-[9px] text-[var(--av-text-muted)]">
                  #{c.rank} · mitti {c.soilMatch}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="mb-1 block px-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
          Koi bhi fasal choose karein
        </label>
        <select
          value={cropSlug}
          onChange={(e) => setCropSlug(e.target.value)}
          className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm font-bold"
        >
          {cropCatalog.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.emoji} {c.name}
            </option>
          ))}
        </select>
      </div>

      <DarkCard className={cn("border-2 p-4", VERDICT_STYLE[suitability.verdict])}>
        <div className="flex items-start gap-2">
          {suitability.verdict === "good" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          )}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
              {suitability.emoji} {suitability.cropName} — suitability
            </p>
            <p className="mt-1 text-sm font-black leading-snug">{suitability.verdictHi}</p>
            <ul className="mt-2 space-y-1 text-[11px] leading-relaxed opacity-90">
              <li>
                · Jagah score: {suitability.locationScore}/100 — {suitability.locationReason}
              </li>
              <li>· {suitability.soilNote}</li>
              <li>
                · Buwai status:{" "}
                {suitability.timeStatus === "green"
                  ? "Abhi accha window"
                  : suitability.timeStatus === "yellow"
                    ? "Soch-samajh ke"
                    : "Abhi avoid / late"}
              </li>
            </ul>
          </div>
        </div>
      </DarkCard>

      <DarkCard className={`border-2 p-5 ${STATUS_STYLE[result.status]}`}>
        <p className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          बुआई का सही समय
        </p>
        <h2 className="mt-2 text-xl font-black">{result.title}</h2>
        <p className="mt-2 flex items-center gap-1 text-xs font-bold">
          <MapPin className="h-3.5 w-3.5" />
          {profile.district && profile.state
            ? `${profile.district}, ${profile.state}`
            : result.regionKey}
          {result.season ? ` · ${result.season}` : ""}
        </p>
        <p className="mt-2 text-sm leading-relaxed">{result.messageHi}</p>
        {result.windowStart && (
          <p className="mt-3 flex items-center gap-2 text-xs font-bold">
            <Calendar className="h-4 w-4" />
            Primary window: {result.windowStart} – {result.windowEnd}
          </p>
        )}
        {result.alternateVariety && (
          <p className="mt-2 rounded-lg bg-white/60 p-2 text-xs font-semibold dark:bg-black/20">
            Picheti variety: {result.alternateVariety}
          </p>
        )}
        <p className="mt-3 rounded-lg bg-white/50 p-2 text-xs font-medium dark:bg-black/20">
          ⚠️ {result.criticalNote}
        </p>
      </DarkCard>

      {result.windows.length > 0 && (
        <DarkCard className="p-4">
          <p className="text-xs font-bold theme-text-primary">State-wise buwai windows</p>
          <ul className="mt-2 space-y-2">
            {result.windows.map((w) => (
              <li
                key={w.label}
                className={`rounded-lg border px-3 py-2 text-xs ${
                  w.active
                    ? "border-emerald-400 bg-emerald-500/10 font-bold"
                    : "border-gray-200 dark:border-white/10"
                }`}
              >
                {w.active ? "✅ " : ""}
                {w.label}: {w.range}
              </li>
            ))}
          </ul>
        </DarkCard>
      )}

      <div className="grid grid-cols-3 gap-2">
        <Metric icon={<Droplets className="h-4 w-4" />} label="Soil moisture" value={`${result.soilMoisturePercent ?? "—"}%`} />
        <Metric
          icon={<Thermometer className="h-4 w-4" />}
          label="Temp"
          value={weather.loading ? "…" : weather.tempC != null ? `${weather.tempC}°C` : "—"}
        />
        <Metric
          icon={<CloudRain className="h-4 w-4" />}
          label="Rain 3h"
          value={weather.loading ? "…" : weather.rain != null ? `${weather.rain}%` : "—"}
        />
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <DarkCard className="p-3 text-center">
      <div className="flex justify-center text-emerald-600">{icon}</div>
      <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
        {label}
      </p>
      <p className="text-sm font-black text-[var(--av-text-primary)]">{value}</p>
    </DarkCard>
  );
}
