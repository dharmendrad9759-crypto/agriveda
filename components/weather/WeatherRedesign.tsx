"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Calendar,
  ChevronRight,
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Eye,
  MapPin,
  RefreshCw,
  Share2,
  Sparkles,
  SprayCan,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
  type LucideIcon,
} from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import WeatherConditionIcon from "@/components/weather/WeatherConditionIcon";
import type { WeatherViewModel } from "@/lib/weatherApi";
import { buildFarmDashboardData } from "@/lib/weatherDashboardData";
import { tf } from "@/lib/i18n/farmer-ui";
import {
  ADVISORY_STYLES,
  buildFarmAdvisories,
  hindiConditionLine,
  parseTempNum,
  shortLocation,
} from "@/lib/weather/weatherUi";
import { cn } from "@/lib/cn";

interface Props {
  weather: WeatherViewModel;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
  onShare?: () => void;
  onEnableLocation?: () => void;
  onLocationClick?: () => void;
}

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

export default function WeatherRedesign({
  weather,
  lastUpdated,
  onRefresh,
  onShare,
  onLocationClick,
}: Props) {
  const { t, locale } = useLocale();
  const hi = locale === "hi";

  const dash = useMemo(() => buildFarmDashboardData(weather), [weather]);
  const temp = parseTempNum(weather.temp);
  const high = Math.round(dash.metrics.tempHigh);
  const low = Math.round(dash.metrics.tempLow);
  const rainChance = weather.hourlyForecast[0]?.rainChancePercent ?? dash.metrics.rainChance ?? 0;
  const humidityPct = Number.parseInt(weather.humidity, 10) || 0;
  const windKmh = Number.parseInt(weather.windSpeed, 10) || 0;
  const cond = hindiConditionLine(weather.condition, t, locale);
  const verdict = sprayVerdict({ hi, isSample: Boolean(weather.isDemo), rainChance, humidityPct, windKmh });

  const weekForecast = useMemo(() => {
    if (weather.dailyForecast.length > 0) return weather.dailyForecast;
    return dash.dayTabs.map((tab, i) => ({
      id: tab.id,
      label:
        i === 0
          ? hi
            ? "आज"
            : "Today"
          : i === 1
          ? hi
            ? "कल"
            : "Tomorrow"
          : tab.label,
      icon: dash.hourly[i * 3]?.icon ?? "🌤",
      high: Math.round(dash.metrics.tempHigh - i),
      low: Math.round(dash.metrics.tempLow - i * 0.5),
      rainChance: dash.hourly[i * 3]?.rainPercent ?? 20,
    }));
  }, [weather.dailyForecast, dash, hi]);

  const advisories = useMemo(() => buildFarmAdvisories(weather, hi), [weather, hi]);

  // Hourly list up to 8 slots
  const hourlySlots = weather.hourlyForecast.slice(0, 8);

  const mainStats = [
    { icon: Droplets, label: hi ? "नमी (Humidity)" : "Humidity", value: weather.humidity },
    { icon: Wind, label: hi ? "हवा (Wind)" : "Wind", value: weather.windSpeed },
    { icon: Umbrella, label: hi ? "बारिश (Rain)" : "Rain Chance", value: `${rainChance}%` },
    { icon: Thermometer, label: hi ? "महसूस (Feels)" : "Feels Like", value: weather.feelsLike ?? `${temp}°` },
  ];

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 overflow-x-hidden pb-6">
      {/* =========================================================================
          HERO WEATHER CARD — IDENTICAL SIGNATURE AESTHETIC AS THE HOME PAGE WIDGET
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-sky-700 via-sky-800 to-emerald-950 text-white shadow-[0_20px_50px_-15px_rgba(8,47,73,0.7)]">
        {/* Ambient Glowing Highlights */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-amber-300/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-emerald-400/25 blur-3xl"
        />

        <div className="relative z-10 px-5 pt-4 pb-4">
          {/* Top Bar: Location Selector & Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onLocationClick}
              className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-bold text-white shadow-xs backdrop-blur-md ring-1 ring-white/20 transition hover:bg-white/25 active:scale-95"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-300" />
              <span className="truncate">{shortLocation(weather.location)}</span>
              <span className="text-[10px] opacity-75 font-normal">▼</span>
            </button>

            <div className="flex items-center gap-1.5">
              {onRefresh ? (
                <button
                  type="button"
                  onClick={onRefresh}
                  aria-label={hi ? "ताज़ा करें" : "Refresh"}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12 text-white/90 ring-1 ring-white/15 transition hover:bg-white/25 active:scale-95"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              ) : null}
              {onShare ? (
                <button
                  type="button"
                  onClick={onShare}
                  aria-label={hi ? "शेयर करें" : "Share"}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12 text-white/90 ring-1 ring-white/15 transition hover:bg-white/25 active:scale-95"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          </div>

          {/* Timestamp or Demo Notice */}
          <div className="mt-2 flex items-center justify-between">
            {lastUpdated ? (
              <p className="text-[10px] font-medium text-white/70">
                {tf(locale, "weatherUpdated", {
                  time: lastUpdated.toLocaleTimeString(hi ? "hi-IN" : "en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                })}
              </p>
            ) : null}
            {weather.isDemo ? (
              <span className="rounded-full bg-amber-400/90 px-2 py-0.5 text-[9px] font-black text-amber-950">
                {hi ? "डेमो डेटा" : "Demo Data"}
              </span>
            ) : null}
          </div>

          {/* Temperature & Condition Centerpiece */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-display)] text-[4.25rem] font-black leading-none tracking-tight">
                {temp}°
              </p>
              <p className="mt-2 truncate text-base font-extrabold text-white/95">{cond}</p>
              <p className="mt-0.5 text-[12px] font-semibold text-white/75">
                {hi ? `अधिकतम ${high}° · न्यूनतम ${low}°` : `High ${high}° · Low ${low}°`}
              </p>
            </div>

            {/* Glowing Frosted Condition Icon Badge */}
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-white/20 backdrop-blur-md">
              <WeatherConditionIcon
                condition={weather.condition}
                className="h-14 w-14 text-amber-200 drop-shadow-md"
              />
            </div>
          </div>

          {/* 4 Farm Metrics Grid */}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {mainStats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl bg-white/10 p-2.5 shadow-xs ring-1 ring-white/12 backdrop-blur-md"
              >
                <p className="flex items-center gap-1.5 text-[10px] font-semibold text-white/75">
                  <Icon className="h-3.5 w-3.5 text-amber-200" />
                  <span>{label}</span>
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-[16px] font-bold text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Hourly Forecast Horizontal Strip */}
          {hourlySlots.length > 0 ? (
            <div className="mt-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-white/80">
                {hi ? "प्रति घंटा पूर्वानुमान" : "Hourly Forecast"}
              </p>
              <div className="flex gap-2 overflow-x-auto rounded-2xl bg-black/20 p-2 scrollbar-hide ring-1 ring-white/10">
                {hourlySlots.map((h, i) => {
                  const Icon = hourIcon(h.icon);
                  const isCurrent = i === 0;
                  return (
                    <div
                      key={`${h.time}-${i}`}
                      className={cn(
                        "flex min-w-[62px] shrink-0 flex-col items-center gap-1 rounded-xl py-2 px-1 text-center transition",
                        isCurrent ? "bg-white/15 ring-1 ring-white/25" : "bg-transparent"
                      )}
                    >
                      <span className={cn("text-[10px] font-semibold", isCurrent ? "text-amber-200" : "text-white/75")}>
                        {hourLabel(h.time, i, hi)}
                      </span>
                      <Icon className="h-5 w-5 text-white/95 my-0.5" />
                      <span className="text-[13px] font-bold text-white">
                        {parseTempNum(h.temp)}°
                      </span>
                      {h.rainChancePercent != null && h.rainChancePercent > 0 ? (
                        <span className="text-[9px] font-bold text-sky-300">
                          {h.rainChancePercent}%
                        </span>
                      ) : (
                        <span className="text-[9px] text-white/40">—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {/* Integrated Spray Advisory Banner at Bottom */}
        <AppLink
          href="/weather/spray-advisory"
          className="relative z-10 flex items-center gap-3 border-t border-white/15 bg-black/25 px-5 py-3.5 transition hover:bg-black/35 active:bg-black/40"
        >
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-xs",
              VERDICT_TONE[verdict.tone]
            )}
          >
            <SprayCan className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              {hi ? "कृषि छिड़काव सलाह (Spray Advisory)" : "Spray Advisory"}
            </p>
            <p className="truncate text-xs font-bold text-white">{verdict.label}</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-white/70" />
        </AppLink>
      </div>

      {/* =========================================================================
          7-DAY EXTENDED FORECAST (Clean, Modern Glass & Card Structure)
          ========================================================================= */}
      <section className="overflow-hidden rounded-[1.75rem] border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]">
        <div className="flex items-center justify-between border-b border-[var(--av-border)] bg-gradient-to-r from-sky-500/10 via-transparent to-transparent px-4 py-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <h2 className="font-[family-name:var(--font-display)] text-[14px] font-bold text-[var(--av-text-primary)]">
              {t("weather7Day")}
            </h2>
          </div>
          <span className="text-[10px] font-semibold text-[var(--av-text-muted)]">
            {hi ? "अगले 7 दिन" : "Next 7 Days"}
          </span>
        </div>

        <div className="divide-y divide-[var(--av-border-subtle)]">
          {weekForecast.slice(0, 7).map((day, i) => (
            <div
              key={day.id}
              className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-slate-500/5"
            >
              <div className="min-w-0 w-28">
                <p className="text-[13px] font-bold text-[var(--av-text-primary)]">{day.label}</p>
                <p className="text-[10px] font-medium text-[var(--av-text-muted)]">
                  {day.rainChance > 0 ? (
                    <span className="text-sky-600 dark:text-sky-400 font-semibold">
                      🌧 {day.rainChance}% {hi ? "बारिश" : "rain"}
                    </span>
                  ) : (
                    <span>{hi ? "सूखा" : "Dry"}</span>
                  )}
                </p>
              </div>

              <div className="flex items-center justify-center">
                <WeatherConditionIcon
                  condition={weather.condition}
                  className="h-6 w-6 shrink-0 text-sky-600 dark:text-sky-400"
                />
              </div>

              <div className="flex items-center gap-3 tabular-nums">
                <span className="text-[14px] font-bold text-[var(--av-text-primary)]">
                  {day.high}°
                </span>
                <span className="text-[12px] font-medium text-[var(--av-text-muted)]">
                  {day.low}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          FARM WEATHER ADVISORIES & ALERTS (कृषि मौसम सलाह)
          ========================================================================= */}
      {advisories.length > 0 ? (
        <section className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-[family-name:var(--font-display)] text-[14px] font-bold text-[var(--av-text-primary)]">
              {hi ? "खेत सलाह (Farm Advisory)" : "Farm Advisory"}
            </h2>
          </div>

          <div className="space-y-2">
            {advisories.map((item) => {
              const body = (
                <div
                  className={cn(
                    "rounded-2xl border px-4 py-3 shadow-xs transition hover:shadow-sm",
                    ADVISORY_STYLES[item.tone],
                    item.href && "active:scale-[0.99]"
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 opacity-80" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold">{item.title}</p>
                      <p className="mt-1 text-[11px] leading-relaxed opacity-90">{item.body}</p>
                    </div>
                    {item.href ? (
                      <ArrowRight className="h-4 w-4 shrink-0 opacity-60 mt-1" />
                    ) : null}
                  </div>
                </div>
              );

              return item.href ? (
                <AppLink key={item.id} href={item.href}>
                  {body}
                </AppLink>
              ) : (
                <div key={item.id}>{body}</div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Additional Metrics Card */}
      {weather.visibilityKm ? (
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-xs">
          <Eye className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          <div>
            <p className="text-[11px] font-bold text-[var(--av-text-muted)]">
              {hi ? "दृश्यता (Visibility)" : "Visibility"}
            </p>
            <p className="text-[14px] font-bold text-[var(--av-text-primary)]">
              {weather.visibilityKm}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
