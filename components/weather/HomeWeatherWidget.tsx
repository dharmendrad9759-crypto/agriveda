"use client";

import {
  ChevronRight,
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  SprayCan,
  Sun,
  Umbrella,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import WeatherConditionIcon from "@/components/weather/WeatherConditionIcon";
import AppLink from "@/components/ui/AppLink";
import type { WeatherViewModel } from "@/lib/weatherApi";
import { buildFarmDashboardData } from "@/lib/weatherDashboardData";
import { hindiConditionLine, parseTempNum, shortLocation } from "@/lib/weather/weatherUi";
import { cn } from "@/lib/cn";

interface Props {
  weather: WeatherViewModel | null;
  loading?: boolean;
  isSample?: boolean;
  className?: string;
}

const HOUR_PICKS = [0, 3, 6, 9];

function hourIcon(emoji: string): LucideIcon {
  if (emoji.includes("⛈")) return CloudLightning;
  if (emoji.includes("🌦")) return CloudRain;
  if (emoji.includes("☁")) return Cloud;
  if (emoji.includes("☀")) return Sun;
  return CloudSun;
}

function hourLabel(time: string, index: number, hi: boolean): string {
  if (index === 0) return hi ? "अभी" : "Now";
  const m = /^(\d{1,2})(?::\d{2})?\s*([ap]m)?/i.exec(time.trim());
  if (!m) return time;
  const h = Number.parseInt(m[1], 10);
  const suffix = (m[2] || "").toUpperCase();
  return suffix ? `${h} ${suffix}` : String(h);
}

type SprayVerdict = { label: string; tone: "good" | "warn" | "stop" | "neutral" };

function sprayVerdict(opts: {
  hi: boolean;
  isSample: boolean;
  rainChance: number;
  humidityPct: number;
  windKmh: number;
}): SprayVerdict {
  const { hi, isSample, rainChance, humidityPct, windKmh } = opts;
  if (isSample) return { label: hi ? "छिड़काव सलाह देखें" : "See spray advice", tone: "neutral" };
  if (rainChance >= 40)
    return {
      label: hi ? `बारिश ${rainChance}% — आज छिड़काव टालें` : `${rainChance}% rain — hold spray`,
      tone: "stop",
    };
  if (windKmh >= 15)
    return { label: hi ? "हवा तेज़ — छिड़काव टालें" : "Strong wind — hold spray", tone: "stop" };
  if (humidityPct >= 85)
    return { label: hi ? "नमी ज़्यादा — ध्यान से छिड़कें" : "High humidity — spray carefully", tone: "warn" };
  return {
    label: hi ? "छिड़काव ठीक — सुबह या शाम करें" : "OK to spray — morning or evening",
    tone: "good",
  };
}

const VERDICT_TONE: Record<SprayVerdict["tone"], string> = {
  good: "bg-emerald-400 text-emerald-950",
  warn: "bg-amber-300 text-amber-950",
  stop: "bg-rose-400 text-rose-950",
  neutral: "bg-white/80 text-sky-950",
};

export default function HomeWeatherWidget({ weather, loading, isSample, className }: Props) {
  const { t, locale } = useLocale();
  const hi = locale === "hi";

  if (loading || !weather) {
    return (
      <div
        className={cn(
          "h-[17.5rem] animate-pulse rounded-[1.5rem] bg-gradient-to-br from-sky-800/40 to-emerald-800/40",
          className
        )}
      />
    );
  }

  const dash = buildFarmDashboardData(weather);
  const temp = parseTempNum(weather.temp);
  const high = Math.round(dash.metrics.tempHigh);
  const low = Math.round(dash.metrics.tempLow);
  const rainChance = weather.hourlyForecast[0]?.rainChancePercent ?? dash.metrics.rainChance ?? 0;
  const humidityPct = Number.parseInt(weather.humidity, 10) || 0;
  const windKmh = Number.parseInt(weather.windSpeed, 10) || 0;
  const cond = hindiConditionLine(weather.condition, t, locale);
  const verdict = sprayVerdict({ hi, isSample: Boolean(isSample), rainChance, humidityPct, windKmh });
  const hours = HOUR_PICKS.map((i) => weather.hourlyForecast[i]).filter(Boolean);

  const stats: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Droplets, label: hi ? "नमी" : "Humidity", value: weather.humidity },
    { icon: Wind, label: hi ? "हवा" : "Wind", value: weather.windSpeed },
    { icon: Umbrella, label: hi ? "बारिश" : "Rain", value: `${rainChance}%` },
  ];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-sky-700 via-sky-800 to-emerald-900 text-white shadow-[0_18px_40px_-20px_rgba(8,47,73,0.65)]",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-amber-300/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl" />

      <AppLink href="/weather" className="relative z-10 block px-4 pb-3 pt-4 active:opacity-90">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex min-w-0 items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-[12px] font-semibold text-white/95 ring-1 ring-white/15">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{shortLocation(weather.location)}</span>
          </span>
          {isSample ? (
            <span className="shrink-0 rounded-full bg-amber-300/90 px-2 py-0.5 text-[10px] font-bold text-amber-950">
              {hi ? "नमूना" : "Sample"}
            </span>
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-white/70" />
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-display)] text-[3.5rem] font-bold leading-none tracking-tight">
              {temp}°
            </p>
            <p className="mt-1.5 truncate text-[14px] font-semibold text-white/95">{cond}</p>
            <p className="mt-0.5 text-[12px] font-medium text-white/70">
              {hi ? `अधिकतम ${high}° · न्यूनतम ${low}°` : `High ${high}° · Low ${low}°`}
            </p>
          </div>
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
            <WeatherConditionIcon condition={weather.condition} className="h-11 w-11 text-amber-200" />
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl bg-white/10 px-2.5 py-2 ring-1 ring-white/10">
              <p className="flex items-center gap-1 text-[11px] font-medium text-white/70">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </p>
              <p className="mt-0.5 text-[15px] font-bold leading-tight">{value}</p>
            </div>
          ))}
        </div>

        {hours.length > 1 ? (
          <div className="mt-3 grid grid-cols-4 gap-1 rounded-2xl bg-black/15 px-1 py-2">
            {hours.map((h, i) => {
              const Icon = hourIcon(h.icon);
              return (
                <div key={`${h.time}-${i}`} className="flex flex-col items-center gap-1">
                  <span className={cn("text-[11px] font-semibold", i === 0 ? "text-white" : "text-white/70")}>
                    {hourLabel(h.time, i, hi)}
                  </span>
                  <Icon className="h-4.5 w-4.5 text-white/90" />
                  <span className="text-[13px] font-bold">{parseTempNum(h.temp)}°</span>
                </div>
              );
            })}
          </div>
        ) : null}
      </AppLink>

      <AppLink
        href="/weather/spray-advisory"
        className="relative z-10 flex items-center gap-2.5 border-t border-white/10 bg-black/20 px-4 py-3 active:bg-black/30"
      >
        <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", VERDICT_TONE[verdict.tone])}>
          <SprayCan className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[14px] font-bold">{verdict.label}</span>
        <ChevronRight className="h-4 w-4 shrink-0 text-white/70" />
      </AppLink>
    </div>
  );
}
