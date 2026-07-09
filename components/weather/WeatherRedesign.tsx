"use client";

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
  Navigation,
  AlertTriangle,
} from "lucide-react";
import { useMemo } from "react";

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

  return (
    <div className="space-y-4">
      {/* Current hero */}
      <DarkCard className="overflow-hidden bg-gradient-to-br from-sky-900/40 via-[#111827] to-[#0a0f1a] p-0" delay={0}>
        <div className="p-5 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs text-[var(--av-text-secondary)]">{weather.location}</p>
              <p className="mt-1 text-5xl font-bold text-[var(--av-text-primary)]">{weather.temp}</p>
              <p className="text-lg text-[var(--av-text-secondary)]">{weather.condition}</p>
              <p className="text-sm text-[var(--av-text-muted)]">Feels like {tempNum + 4}°C</p>
            </div>
            <div className="text-6xl">⛅</div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[
              { icon: Droplets, label: "Humidity", value: weather.humidity },
              { icon: Wind, label: "Wind", value: weather.windSpeed },
              { icon: CloudSun, label: "Rain", value: `${weather.hourlyForecast[0]?.rainChancePercent ?? 20}%` },
              { icon: Sun, label: "UV", value: "7 High" },
              { icon: Droplets, label: "Pressure", value: "1006 hPa" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-[var(--av-border)]/80 bg-[var(--av-surface-inset)]/60 px-3 py-2">
                <item.icon className="h-3.5 w-3.5 text-[var(--av-accent)]" />
                <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{item.label}</p>
                <p className="text-xs font-semibold text-[var(--av-text-primary)]">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[var(--av-text-secondary)]">
            <span>Max {dash.heroTempHigh}° / Min {dash.heroTempLow}°</span>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-400">AQI 78 Moderate</span>
          </div>
          <div className="mt-3 flex gap-2">
            {onRefresh && (
              <button type="button" onClick={onRefresh} className="flex items-center gap-1 rounded-lg border border-[var(--av-border)] px-3 py-1.5 text-xs text-[var(--av-accent)]">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            )}
            {onShare && (
              <button type="button" onClick={onShare} className="flex items-center gap-1 rounded-lg border border-[var(--av-border)] px-3 py-1.5 text-xs text-[var(--av-text-secondary)]">
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
            )}
          </div>
        </div>
      </DarkCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <DarkCard hover delay={1}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Today&apos;s Summary</h3>
          <p className="text-[10px] text-[var(--av-text-muted)]">Today · {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
          <ul className="mt-3 space-y-2 text-xs text-[var(--av-text-secondary)]">
            <li className="flex justify-between"><span>Max Temp</span><span className="text-[var(--av-text-primary)]">{dash.heroTempHigh}°C</span></li>
            <li className="flex justify-between"><span>Min Temp</span><span className="text-[var(--av-text-primary)]">{dash.heroTempLow}°C</span></li>
            <li className="flex justify-between"><span>Sunrise</span><span className="text-[var(--av-text-primary)]">05:48 AM</span></li>
            <li className="flex justify-between"><span>Sunset</span><span className="text-[var(--av-text-primary)]">06:58 PM</span></li>
            <li className="flex justify-between"><span>Rainfall</span><span className="text-[var(--av-text-primary)]">0 mm</span></li>
          </ul>
        </DarkCard>

        <DarkCard hover delay={2} className="lg:col-span-2">
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Hourly Forecast</h3>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {weather.hourlyForecast.slice(0, 12).map((h, i) => (
              <div key={i} className="flex w-16 shrink-0 flex-col items-center rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-2 py-3 text-center">
                <span className="text-[9px] text-[var(--av-text-muted)]">{i === 0 ? "Now" : h.time}</span>
                <span className="my-1 text-xl">{h.icon}</span>
                <span className="text-xs font-bold text-[var(--av-text-primary)]">{h.temp}</span>
                <span className="text-[9px] text-sky-400">{h.rainChancePercent}%</span>
              </div>
            ))}
          </div>
        </DarkCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">7 Day Forecast</h3>
            <span className="text-[10px] font-semibold text-[var(--av-accent)]">View 15 Days →</span>
          </div>
          <ul className="mt-3 space-y-2">
            {weekForecast.map((day) => (
              <li key={day.id} className="flex items-center justify-between rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{day.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-[var(--av-text-primary)]">{day.label}</p>
                    <p className="text-[10px] text-[var(--av-text-muted)]">{day.dateLabel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-[var(--av-text-primary)]">{day.high}° / {day.low}°</p>
                  <p className="text-[10px] text-sky-400">{day.rainChance}% rain</p>
                </div>
              </li>
            ))}
          </ul>
        </DarkCard>

        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Rainfall Forecast Map</h3>
          <div className="mt-3 flex h-40 items-center justify-center rounded-lg border border-[var(--av-border)] bg-gradient-to-br from-[#0a0f1a] via-sky-950/30 to-[#111827]">
            <div className="text-center">
              <Navigation className="mx-auto h-8 w-8 text-[var(--av-accent)]" />
              <p className="mt-2 text-xs text-[var(--av-text-secondary)]">Localized precipitation overlay</p>
              <AppLink href="/weather/spray-advisory" className="mt-2 inline-block text-[10px] font-bold text-[var(--av-accent)]">View Map →</AppLink>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1 text-[8px] text-[var(--av-text-muted)]">
            {["0-1", "1-5", "5-15", "15-30", "30-70", "70+"].map((l) => (
              <span key={l} className="rounded bg-[#1f2937] px-1.5 py-0.5">{l} mm</span>
            ))}
          </div>
        </DarkCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Agri Weather Advisory</h3>
          <ul className="mt-3 space-y-2">
            {AGRI_ADVISORY.map((tip) => (
              <li key={tip} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
                <span className="text-[var(--av-accent)]">•</span> {tip}
              </li>
            ))}
          </ul>
          {weather.recommendations.map((r) => (
            <div key={r.title} className="mt-2 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2">
              <p className="text-[10px] font-bold text-[var(--av-accent)]">{r.title}</p>
              <p className="text-[10px] text-[var(--av-text-muted)]">{r.advice}</p>
            </div>
          ))}
        </DarkCard>

        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Weather Alerts</h3>
          <ul className="mt-3 space-y-2">
            {WEATHER_ALERTS.map((a) => (
              <li key={a.title} className={`rounded-lg border px-3 py-2 ${a.priority === "high" ? "border-red-500/30 bg-red-500/10" : "border-amber-500/20 bg-amber-500/5"}`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${a.priority === "high" ? "text-red-400" : "text-amber-400"}`} />
                  <p className="text-xs font-semibold text-[var(--av-text-primary)]">{a.title}</p>
                </div>
                <p className="mt-1 text-[10px] text-[var(--av-text-secondary)]">{a.desc}</p>
              </li>
            ))}
          </ul>
        </DarkCard>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DarkCard hover delay={1}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Air Quality Index</h3>
          <GaugeChart value={78} max={150} label="78 Moderate" />
          <p className="mt-2 text-[10px] text-[var(--av-text-muted)]">Acceptable air quality for outdoor farm work.</p>
        </DarkCard>

        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Sunrise, Sunset & Moon</h3>
          <div className="mt-3 flex justify-around text-center">
            <div>
              <Sun className="mx-auto h-6 w-6 text-amber-400" />
              <p className="mt-1 text-xs font-bold text-[var(--av-text-primary)]">05:48 AM</p>
              <p className="text-[9px] text-[var(--av-text-muted)]">Sunrise</p>
            </div>
            <div>
              <Sun className="mx-auto h-6 w-6 text-orange-400 rotate-180" />
              <p className="mt-1 text-xs font-bold text-[var(--av-text-primary)]">06:58 PM</p>
              <p className="text-[9px] text-[var(--av-text-muted)]">Sunset</p>
            </div>
            <div>
              <Moon className="mx-auto h-6 w-6 text-slate-300" />
              <p className="mt-1 text-xs font-bold text-[var(--av-text-primary)]">Waxing Gibbous</p>
              <p className="text-[9px] text-[var(--av-text-muted)]">Moon</p>
            </div>
          </div>
        </DarkCard>

        <DarkCard hover delay={3} className="sm:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Additional Details</h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {WEATHER_DETAILS.map((d) => (
              <div key={d.label} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2">
                <p className="text-[9px] text-[var(--av-text-muted)]">{d.label}</p>
                <p className="text-xs font-semibold text-[var(--av-text-primary)]">{d.value}</p>
              </div>
            ))}
          </div>
        </DarkCard>
      </div>

      {lastUpdated && (
        <p className="text-center text-[10px] text-[var(--av-text-muted)]">
          Last updated: {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      )}

      <div className="rounded-xl border border-[#10b981]/30 bg-[var(--av-accent)]/10 p-4 lg:flex lg:items-center lg:justify-between">
        <p className="text-sm text-[var(--av-text-primary)]">Enable location access for precise weather updates</p>
        <button
          type="button"
          onClick={onEnableLocation}
          className="av-btn av-btn-sm av-btn-primary mt-3 lg:mt-0"
        >
          Enable Location
        </button>
      </div>
    </div>
  );
}
