"use client";

import dynamic from "next/dynamic";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import { GaugeChart } from "@/components/shell/charts";
import type { WeatherViewModel } from "@/lib/weatherApi";
import { buildFarmDashboardData } from "@/lib/weatherDashboardData";
import { AGRI_ADVISORY, WEATHER_ALERTS, WEATHER_DETAILS } from "@/data/mock/weather-extras";
import {
  CloudSun,
  Droplets,
  Wind,
  Sun,
  Moon,
  RefreshCw,
  Share2,
  AlertTriangle,
} from "lucide-react";
import { useMemo } from "react";

const RainfallMap = dynamic(() => import("@/components/weather/RainfallMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[220px] items-center justify-center rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]">
      <span className="text-xs text-[var(--av-text-muted)]">मैप लोड हो रहा है…</span>
    </div>
  ),
});

interface Props {
  weather: WeatherViewModel;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
  onShare?: () => void;
  onEnableLocation?: () => void;
}

export default function WeatherRedesign({ weather, lastUpdated, onRefresh, onShare, onEnableLocation }: Props) {
  const dash = useMemo(() => buildFarmDashboardData(weather), [weather]);
  const tempNum = parseInt(weather.temp, 10) || 32;

  const weekForecast = dash.dayTabs.map((tab, i) => ({
    id: tab.id,
    label: tab.label,
    dateLabel: tab.sublabel,
    icon: dash.hourly[i * 3]?.icon ?? "🌤",
    high: Math.round(dash.metrics.tempHigh - i),
    low: Math.round(dash.metrics.tempLow - i * 0.5),
    rainChance: dash.hourly[i * 3]?.rainPercent ?? 20,
  }));

  const statItems = [
    { icon: Droplets, label: "Humidity", value: weather.humidity },
    { icon: Wind, label: "Wind", value: weather.windSpeed },
    { icon: CloudSun, label: "Rain", value: `${weather.hourlyForecast[0]?.rainChancePercent ?? 20}%` },
    { icon: Sun, label: "UV", value: "7 High" },
  ];

  return (
    <div className="mx-auto w-full max-w-lg space-y-3 overflow-x-hidden pb-2">
      {/* Current hero — mobile first */}
      <DarkCard className="overflow-hidden bg-gradient-to-br from-sky-900/40 via-[#111827] to-[#0a0f1a] p-0" delay={0}>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-[var(--av-text-secondary)]">{weather.location}</p>
              <p className="mt-1 text-4xl font-bold text-[var(--av-text-primary)]">{weather.temp}</p>
              <p className="truncate text-base capitalize text-[var(--av-text-secondary)]">{weather.condition}</p>
              <p className="text-xs text-[var(--av-text-muted)]">Feels like {tempNum + 4}°C</p>
            </div>
            <div className="shrink-0 text-5xl" aria-hidden>
              {dash.heroIcon}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {statItems.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-[var(--av-border)]/80 bg-[var(--av-surface-inset)]/60 px-3 py-2"
              >
                <item.icon className="h-3.5 w-3.5 text-[var(--av-accent)]" />
                <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{item.label}</p>
                <p className="truncate text-xs font-semibold text-[var(--av-text-primary)]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--av-text-secondary)]">
            <span>
              Max {dash.heroTempHigh}° / Min {dash.heroTempLow}°
            </span>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-400">AQI 78</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="flex items-center gap-1 rounded-lg border border-[var(--av-border)] px-3 py-1.5 text-xs text-[var(--av-accent)]"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            )}
            {onShare && (
              <button
                type="button"
                onClick={onShare}
                className="flex items-center gap-1 rounded-lg border border-[var(--av-border)] px-3 py-1.5 text-xs text-[var(--av-text-secondary)]"
              >
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
            )}
          </div>
        </div>
      </DarkCard>

      {/* Rainfall alert strip */}
      {weather.rainfallAlert && (
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2.5">
          <p className="text-xs leading-relaxed text-sky-200">{weather.rainfallAlert}</p>
        </div>
      )}

      {/* Rainfall map — full width on phone */}
      <DarkCard hover delay={1} className="overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Rainfall Radar Map</h3>
            <p className="text-[10px] text-[var(--av-text-muted)]">Live precipitation · RainViewer</p>
          </div>
          <AppLink href="/weather/spray-advisory" className="shrink-0 text-[10px] font-bold text-[var(--av-accent)]">
            Spray →
          </AppLink>
        </div>
        <div className="mt-3 w-full">
          <RainfallMap
            lat={weather.lat}
            lon={weather.lon}
            rainChance={dash.metrics.rainChance}
            rainMm={dash.metrics.rainMm}
            height="220px"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-1 text-[8px] text-[var(--av-text-muted)]">
          {["0-1", "1-5", "5-15", "15-30", "30-70", "70+"].map((l) => (
            <span key={l} className="rounded bg-[#1f2937] px-1.5 py-0.5">
              {l} mm
            </span>
          ))}
        </div>
      </DarkCard>

      {/* Hourly — horizontal scroll contained */}
      <DarkCard hover delay={2} className="overflow-hidden">
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Hourly Forecast</h3>
        <div className="-mx-1 mt-3 max-w-full overflow-x-auto pb-1 scrollbar-hide">
          <div className="flex w-max min-w-full gap-2 px-1">
            {weather.hourlyForecast.slice(0, 12).map((h, i) => (
              <div
                key={i}
                className="flex w-[3.75rem] shrink-0 flex-col items-center rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-2 py-3 text-center"
              >
                <span className="text-[9px] text-[var(--av-text-muted)]">{i === 0 ? "Now" : h.time}</span>
                <span className="my-1 text-xl">{h.icon}</span>
                <span className="text-xs font-bold text-[var(--av-text-primary)]">{h.temp}</span>
                <span className="text-[9px] text-sky-400">{h.rainChancePercent}%</span>
              </div>
            ))}
          </div>
        </div>
      </DarkCard>

      {/* Today summary */}
      <DarkCard hover delay={1}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Today&apos;s Summary</h3>
        <p className="text-[10px] text-[var(--av-text-muted)]">
          {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </p>
        <ul className="mt-3 space-y-2 text-xs text-[var(--av-text-secondary)]">
          <li className="flex justify-between gap-2">
            <span>Max Temp</span>
            <span className="font-semibold text-[var(--av-text-primary)]">{dash.heroTempHigh}°C</span>
          </li>
          <li className="flex justify-between gap-2">
            <span>Min Temp</span>
            <span className="font-semibold text-[var(--av-text-primary)]">{dash.heroTempLow}°C</span>
          </li>
          <li className="flex justify-between gap-2">
            <span>Rain chance</span>
            <span className="font-semibold text-sky-400">{dash.metrics.rainChance}%</span>
          </li>
          <li className="flex justify-between gap-2">
            <span>Expected rain</span>
            <span className="font-semibold text-[var(--av-text-primary)]">{dash.metrics.rainMm.toFixed(1)} mm</span>
          </li>
        </ul>
      </DarkCard>

      {/* 7 day forecast */}
      <DarkCard hover delay={2}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">7 Day Forecast</h3>
        <ul className="mt-3 space-y-2">
          {weekForecast.map((day) => (
            <li
              key={day.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 text-lg">{day.icon}</span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[var(--av-text-primary)]">{day.label}</p>
                  <p className="text-[10px] text-[var(--av-text-muted)]">{day.dateLabel}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-bold text-[var(--av-text-primary)]">
                  {day.high}° / {day.low}°
                </p>
                <p className="text-[10px] text-sky-400">{day.rainChance}% rain</p>
              </div>
            </li>
          ))}
        </ul>
      </DarkCard>

      {/* Agri advisory */}
      <DarkCard hover delay={1}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Agri Weather Advisory</h3>
        <ul className="mt-3 space-y-2">
          {AGRI_ADVISORY.slice(0, 3).map((tip) => (
            <li key={tip} className="flex gap-2 text-xs leading-relaxed text-[var(--av-text-secondary)]">
              <span className="shrink-0 text-[var(--av-accent)]">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        {weather.recommendations.map((r) => (
          <div key={r.title} className="mt-2 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2">
            <p className="text-[10px] font-bold text-[var(--av-accent)]">{r.title}</p>
            <p className="text-[10px] leading-relaxed text-[var(--av-text-muted)]">{r.advice}</p>
          </div>
        ))}
      </DarkCard>

      {/* Alerts */}
      <DarkCard hover delay={2}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Weather Alerts</h3>
        <ul className="mt-3 space-y-2">
          {WEATHER_ALERTS.map((a) => (
            <li
              key={a.title}
              className={`rounded-lg border px-3 py-2 ${
                a.priority === "high" ? "border-red-500/30 bg-red-500/10" : "border-amber-500/20 bg-amber-500/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 shrink-0 ${a.priority === "high" ? "text-red-400" : "text-amber-400"}`} />
                <p className="text-xs font-semibold text-[var(--av-text-primary)]">{a.title}</p>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-[var(--av-text-secondary)]">{a.desc}</p>
            </li>
          ))}
        </ul>
      </DarkCard>

      {/* AQI + sun/moon — 2 col on phone */}
      <div className="grid grid-cols-2 gap-3">
        <DarkCard hover delay={1} className="col-span-2 sm:col-span-1">
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Air Quality</h3>
          <GaugeChart value={78} max={150} label="78 Moderate" />
        </DarkCard>

        <DarkCard hover delay={2} className="col-span-2 sm:col-span-1">
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Sun & Moon</h3>
          <div className="mt-3 flex justify-around text-center">
            <div>
              <Sun className="mx-auto h-5 w-5 text-amber-400" />
              <p className="mt-1 text-[10px] font-bold text-[var(--av-text-primary)]">05:48</p>
              <p className="text-[8px] text-[var(--av-text-muted)]">Sunrise</p>
            </div>
            <div>
              <Sun className="mx-auto h-5 w-5 rotate-180 text-orange-400" />
              <p className="mt-1 text-[10px] font-bold text-[var(--av-text-primary)]">06:58</p>
              <p className="text-[8px] text-[var(--av-text-muted)]">Sunset</p>
            </div>
            <div>
              <Moon className="mx-auto h-5 w-5 text-slate-300" />
              <p className="mt-1 text-[10px] font-bold text-[var(--av-text-primary)]">Gibbous</p>
              <p className="text-[8px] text-[var(--av-text-muted)]">Moon</p>
            </div>
          </div>
        </DarkCard>
      </div>

      {/* Extra details */}
      <DarkCard hover delay={3}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Additional Details</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {WEATHER_DETAILS.map((d) => (
            <div key={d.label} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2">
              <p className="text-[9px] text-[var(--av-text-muted)]">{d.label}</p>
              <p className="truncate text-xs font-semibold text-[var(--av-text-primary)]">{d.value}</p>
            </div>
          ))}
        </div>
      </DarkCard>

      {lastUpdated && (
        <p className="text-center text-[10px] text-[var(--av-text-muted)]">
          Last updated: {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      )}

      <div className="rounded-xl border border-[#10b981]/30 bg-[var(--av-accent)]/10 p-4">
        <p className="text-sm text-[var(--av-text-primary)]">GPS से सटीक मौसम और रडार मैप पाएं</p>
        <button type="button" onClick={onEnableLocation} className="av-btn av-btn-sm av-btn-primary mt-3 w-full sm:w-auto">
          Enable Location
        </button>
      </div>
    </div>
  );
}
