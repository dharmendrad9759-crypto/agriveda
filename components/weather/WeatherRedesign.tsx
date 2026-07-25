"use client";

import AppLink from "@/components/ui/AppLink";
import type { WeatherViewModel } from "@/lib/weatherApi";
import { buildFarmDashboardData } from "@/lib/weatherDashboardData";
import {
  CloudSun,
  Droplets,
  Wind,
  Eye,
  CloudRain,
  MapPin,
  RefreshCw,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { useMemo, type ReactNode } from "react";

interface Props {
  weather: WeatherViewModel;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
  onShare?: () => void;
  onEnableLocation?: () => void;
}

function shortLocation(location: string) {
  return location.split(",")[0]?.trim() || location;
}

export default function WeatherRedesign({
  weather,
  lastUpdated,
  onRefresh,
  onShare,
}: Props) {
  const dash = useMemo(() => buildFarmDashboardData(weather), [weather]);
  const tempNum = parseInt(weather.temp, 10) || 28;
  const rainNow = weather.hourlyForecast[0]?.rainChancePercent ?? dash.metrics.rainChance;

  const weekForecast =
    weather.dailyForecast.length > 0
      ? weather.dailyForecast
      : dash.dayTabs.map((tab, i) => ({
          id: tab.id,
          label: i === 0 ? "आज" : i === 1 ? "कल" : tab.label,
          icon: dash.hourly[i * 3]?.icon ?? "🌤",
          high: Math.round(dash.metrics.tempHigh - i),
          low: Math.round(dash.metrics.tempLow - i * 0.5),
          rainChance: dash.hourly[i * 3]?.rainPercent ?? 20,
        }));

  const spraySafe = rainNow < 30 && dash.metrics.windKmh < 15;
  const irrigationHold = (weekForecast[1]?.rainChance ?? 0) >= 50;
  const diseaseHigh = dash.metrics.humidity >= 70 || rainNow >= 40;

  const metrics = [
    { icon: Droplets, label: "नमी", value: weather.humidity },
    { icon: Wind, label: "हवा", value: weather.windSpeed },
    { icon: CloudRain, label: "बारिश", value: `${rainNow}%` },
    { icon: Eye, label: "दृश्यता", value: weather.visibilityKm ?? "8 km" },
  ];

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 overflow-x-hidden pb-2">
      {weather.isDemo && (
        <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">
          {weather.demoNotice ??
            "Demo मौसम — live के लिए OPENWEATHER_API_KEY सेट करें।"}
        </div>
      )}

      {/* Hero — blue weather card */}
      <section className="relative overflow-hidden rounded-b-[1.75rem] rounded-t-2xl bg-gradient-to-br from-[#1d6fd8] via-[#2b7de0] to-[#1a5fbf] text-white shadow-[0_16px_40px_-12px_rgba(29,111,216,0.55)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 20% 0%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 90% 80%, rgba(56,189,248,0.35), transparent 40%)",
          }}
        />
        <div className="relative p-4 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CloudSun className="h-5 w-5 text-amber-200" />
              <h2 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
                मौसम
              </h2>
            </div>
            <span className="inline-flex max-w-[55%] items-center gap-1 truncate rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{shortLocation(weather.location)}</span>
            </span>
          </div>

          <div className="mt-5 flex flex-col items-center text-center">
            <div className="text-6xl leading-none drop-shadow-sm" aria-hidden>
              {dash.heroIcon}
            </div>
            <p className="mt-2 text-5xl font-black tracking-tight">{weather.temp}</p>
            <p className="mt-1 text-sm font-medium text-white/90 capitalize">
              {weather.condition}
              <span className="text-white/70"> • अनुभव: {weather.feelsLike ?? `${tempNum + 2}°C`}</span>
            </p>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-1.5 rounded-2xl border border-white/25 bg-white/15 p-2.5 backdrop-blur-md">
            {metrics.map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-0.5 px-0.5 py-1 text-center">
                <m.icon className="h-4 w-4 text-sky-100" />
                <p className="text-[11px] font-bold leading-tight">{m.value}</p>
                <p className="text-[9px] text-white/75">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-sm"
              >
                <RefreshCw className="h-3.5 w-3.5" /> रिफ्रेश
              </button>
            )}
            {onShare && (
              <button
                type="button"
                onClick={onShare}
                className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-sm"
              >
                <Share2 className="h-3.5 w-3.5" /> शेयर
              </button>
            )}
            <AppLink
              href="/weather/spray-advisory"
              className="ml-auto inline-flex items-center rounded-lg bg-white/90 px-3 py-1.5 text-[11px] font-bold text-[#1a5fbf]"
            >
              स्प्रे सलाह →
            </AppLink>
          </div>
        </div>
      </section>

      {/* खेती सलाह */}
      <section>
        <h3 className="mb-2 px-0.5 text-sm font-bold text-[var(--av-text-primary)]">खेती सलाह</h3>
        <div className="space-y-2">
          <AdviceRow
            tone="good"
            icon={<CheckCircle2 className="h-4 w-4" />}
            title="स्प्रे"
            detail={spraySafe ? "आज सुरक्षित" : "आज सावधानी रखें"}
          />
          <AdviceRow
            tone={irrigationHold ? "warn" : "good"}
            icon={<AlertTriangle className="h-4 w-4" />}
            title="सिंचाई"
            detail={
              irrigationHold
                ? "कल बारिश संभव, रोकें"
                : "सिंचाई सामान्य रूप से करें"
            }
          />
          <AdviceRow
            tone={diseaseHigh ? "bad" : "good"}
            icon={<ShieldAlert className="h-4 w-4" />}
            title="रोग खतरा"
            detail={diseaseHigh ? "अगले 3 दिन — अधिक" : "अगले 3 दिन — सामान्य"}
          />
        </div>
      </section>

      {/* 7 दिन का पूर्वानुमान — rain % bars */}
      <section className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">7 दिन का पूर्वानुमान</h3>
        <ul className="mt-3 space-y-3">
          {weekForecast.map((day) => (
            <li key={day.id} className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-lg leading-none" aria-hidden>
                  {day.icon}
                </span>
              </div>
              <div className="min-w-0">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-[var(--av-text-primary)]">{day.label}</p>
                  <p className="text-[10px] font-semibold text-sky-600 dark:text-sky-400">
                    {day.rainChance}% बारिश
                  </p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-sky-100 dark:bg-sky-950/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(4, day.rainChance))}%` }}
                  />
                </div>
              </div>
              <p className="shrink-0 text-right text-xs">
                <span className="font-bold text-orange-500">{day.high}°</span>{" "}
                <span className="text-[var(--av-text-muted)]">{day.low}°</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Hourly strip */}
      <section className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">घंटेवार</h3>
        <div className="-mx-1 mt-3 max-w-full overflow-x-auto pb-1 scrollbar-hide">
          <div className="flex w-max min-w-full gap-2 px-1">
            {weather.hourlyForecast.slice(0, 12).map((h, i) => (
              <div
                key={`${h.time}-${i}`}
                className="flex w-[3.75rem] shrink-0 flex-col items-center rounded-xl bg-[var(--av-surface-inset)] px-2 py-3 text-center"
              >
                <span className="text-[9px] text-[var(--av-text-muted)]">
                  {i === 0 ? "अब" : h.time}
                </span>
                <span className="my-1 text-xl">{h.icon}</span>
                <span className="text-xs font-bold text-[var(--av-text-primary)]">{h.temp}</span>
                <span className="text-[9px] font-semibold text-sky-500">{h.rainChancePercent}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {weather.rainfallAlert && (
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2.5">
          <p className="text-xs leading-relaxed text-sky-800 dark:text-sky-200">
            {weather.rainfallAlert}
          </p>
        </div>
      )}

      {lastUpdated && (
        <p className="text-center text-[10px] text-[var(--av-text-muted)]">
          अपडेट:{" "}
          {lastUpdated.toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      )}
    </div>
  );
}

function AdviceRow({
  tone,
  icon,
  title,
  detail,
}: {
  tone: "good" | "warn" | "bad";
  icon: ReactNode;
  title: string;
  detail: string;
}) {
  const styles =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
        : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200";

  const iconBox =
    tone === "good"
      ? "bg-emerald-500 text-white"
      : tone === "warn"
        ? "bg-amber-400 text-white"
        : "bg-rose-500 text-white";

  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-3 py-3 ${styles}`}>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBox}`}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide opacity-70">{title}</p>
        <p className="text-sm font-bold leading-snug">{detail}</p>
      </div>
    </div>
  );
}
