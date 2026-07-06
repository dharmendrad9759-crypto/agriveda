"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Calendar, CloudRain, Droplets, MapPin, Thermometer } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { cropCatalog } from "@/data/crop-catalog";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { evaluateSowingWindow } from "@/lib/agriveda2/sowingWindowEngine";
import { fetchSprayWeatherFromSaved } from "@/lib/sprayWeatherApi";
import { BUWAI_SLUGS } from "@/data/agriveda2/crop-slug-map";

const STATUS_STYLE = {
  green: "border-emerald-400 bg-emerald-500/10 text-emerald-800",
  yellow: "border-amber-400 bg-amber-500/10 text-amber-900",
  red: "border-red-400 bg-red-500/10 text-red-900",
};

export default function SowingWindowClient({ initialCrop }: { initialCrop?: string }) {
  const { crops } = useMyCrops();
  const { profile } = useFarmerProfile();
  const verifiedDefault =
    crops.find((c) => (BUWAI_SLUGS as readonly string[]).includes(c.slug))?.slug ??
    BUWAI_SLUGS[0];

  const [cropSlug, setCropSlug] = useState(initialCrop ?? verifiedDefault);
  const [weather, setWeather] = useState<{ tempC?: number; rain?: number }>({});

  useEffect(() => {
    fetchSprayWeatherFromSaved().then((b) => {
      if (!b) return;
      setWeather({
        tempC: Math.round(b.current.temperatureC),
        rain: Math.round(b.current.rainProbabilityNext3h * 100),
      });
    });
  }, []);

  const result = useMemo(
    () =>
      evaluateSowingWindow(cropSlug, {
        state: profile.state,
        tempC: weather.tempC,
        rainChance3d: weather.rain,
      }),
    [cropSlug, weather, profile.state]
  );

  const catalogFiltered = cropCatalog.filter((c) =>
    (BUWAI_SLUGS as readonly string[]).includes(c.slug)
  );

  return (
    <div className="space-y-5">
      <select
        value={cropSlug}
        onChange={(e) => setCropSlug(e.target.value)}
        className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm font-bold"
      >
        {catalogFiltered.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.emoji} {c.name}
          </option>
        ))}
      </select>

      <GlassCard className={`border-2 p-5 ${STATUS_STYLE[result.status]}`}>
        <p className="text-xs font-black uppercase tracking-wider">Buwai Ka Samay — v2.1</p>
        <h2 className="mt-2 text-xl font-black">{result.title}</h2>
        <p className="mt-2 flex items-center gap-1 text-xs font-bold">
          <MapPin className="h-3.5 w-3.5" />
          Region: {result.regionKey}
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
      </GlassCard>

      {result.windows.length > 0 && (
        <GlassCard className="p-4">
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
        </GlassCard>
      )}

      {result.seasons && (
        <GlassCard className="p-4">
          <p className="text-xs font-bold theme-text-primary">Season-wise detail</p>
          <ul className="mt-2 space-y-3 text-xs theme-text-muted">
            {Object.entries(result.seasons).map(([season, data]) => (
              <li key={season} className="rounded-lg border border-gray-200 p-2 dark:border-white/10">
                <p className="font-bold theme-text-primary">{season}</p>
                {Object.entries(data).map(([k, v]) =>
                  k !== "region" && k !== "note" ? (
                    <p key={k}>
                      {k}: {v}
                    </p>
                  ) : null
                )}
                {data.note && <p className="mt-1 text-amber-800">{data.note}</p>}
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {Object.keys(result.stateData).length > 0 && (
        <GlassCard className="p-4 text-xs theme-text-muted">
          <p className="font-bold theme-text-primary">{result.regionKey} — verified calendar</p>
          <ul className="mt-2 space-y-1">
            {Object.entries(result.stateData).map(([k, v]) => (
              <li key={k}>
                <span className="font-semibold theme-text-primary">{k.replace(/_/g, " ")}:</span> {v}
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      <div className="grid grid-cols-3 gap-2">
        <Metric icon={<Droplets className="h-4 w-4" />} label="Soil moisture" value={`${result.soilMoisturePercent ?? "—"}%`} />
        <Metric icon={<Thermometer className="h-4 w-4" />} label="Temp" value={weather.tempC != null ? `${weather.tempC}°C` : "—"} />
        <Metric icon={<CloudRain className="h-4 w-4" />} label="Rain 3h" value={weather.rain != null ? `${weather.rain}%` : "—"} />
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
    <div className="rounded-xl border border-gray-200 bg-white p-3 text-center dark:border-white/10 dark:bg-black/20">
      <div className="flex justify-center text-emerald-600">{icon}</div>
      <p className="mt-1 text-[9px] font-bold uppercase theme-text-muted">{label}</p>
      <p className="text-sm font-black theme-text-primary">{value}</p>
    </div>
  );
}
