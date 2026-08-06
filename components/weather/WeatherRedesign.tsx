"use client";

import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { WeatherViewModel } from "@/lib/weatherApi";
import { buildFarmDashboardData } from "@/lib/weatherDashboardData";
import { tf, type AppLocale, type FarmerUiKey } from "@/lib/i18n/farmer-ui";
import {
  Droplets,
  Wind,
  Thermometer,
  Sun,
  MapPin,
  RefreshCw,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Cloud,
  CloudRain,
  CloudSun,
  CloudLightning,
  Eye,
} from "lucide-react";
import { useMemo } from "react";

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

function conditionSky(condition: string) {
  const c = condition.toLowerCase();
  if (/thunder|storm|lightning|तूफान/.test(c)) {
    return {
      base: "from-[#0b1220] via-[#1a2744] to-[#0f172a]",
      glow: "radial-gradient(ellipse at 70% 20%, rgba(96,165,250,0.35), transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(59,130,246,0.2), transparent 45%)",
      accent: "text-sky-200",
    };
  }
  if (/rain|drizzle|shower|बारिश/.test(c)) {
    return {
      base: "from-[#0c1929] via-[#163554] to-[#0e2438]",
      glow: "radial-gradient(ellipse at 60% 10%, rgba(56,189,248,0.28), transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(14,165,233,0.18), transparent 40%)",
      accent: "text-sky-300",
    };
  }
  if (/fog|mist|haze|धुंध|कोहरा/.test(c)) {
    return {
      base: "from-[#1c1917] via-[#292524] to-[#44403c]",
      glow: "radial-gradient(ellipse at 40% 30%, rgba(251,191,36,0.22), transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(168,162,158,0.2), transparent 45%)",
      accent: "text-amber-200",
    };
  }
  if (/cloud|overcast|बादल/.test(c)) {
    return {
      base: "from-[#111827] via-[#1e293b] to-[#0f172a]",
      glow: "radial-gradient(ellipse at 50% 0%, rgba(148,163,184,0.28), transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(100,116,139,0.2), transparent 40%)",
      accent: "text-slate-200",
    };
  }
  // clear / sunny / default — warm dusk sky like inspiration
  return {
    base: "from-[#1c0f0a] via-[#7c2d12] to-[#0c1a2e]",
    glow: "radial-gradient(ellipse at 75% 15%, rgba(251,146,60,0.45), transparent 45%), radial-gradient(ellipse at 20% 85%, rgba(15,23,42,0.5), transparent 50%)",
    accent: "text-amber-200",
  };
}

function ConditionIcon({ condition, className }: { condition: string; className?: string }) {
  const c = condition.toLowerCase();
  if (/thunder|storm/.test(c)) return <CloudLightning className={className} />;
  if (/rain|drizzle|shower/.test(c)) return <CloudRain className={className} />;
  if (/cloud|overcast|fog|mist/.test(c)) return <Cloud className={className} />;
  if (/partly|few/.test(c)) return <CloudSun className={className} />;
  return <Sun className={className} />;
}

function estimateUv(
  condition: string,
  hour: number,
  t: (key: FarmerUiKey) => string
): string {
  const c = condition.toLowerCase();
  if (/rain|thunder|storm|fog|mist/.test(c)) return t("weatherUvLow");
  if (/cloud|overcast/.test(c)) return hour >= 10 && hour <= 15 ? t("weatherUvMod") : t("weatherUvLow");
  if (hour >= 10 && hour <= 15) return t("weatherUvHigh");
  return t("weatherUvMod");
}

function hindiConditionLine(
  condition: string,
  t: (key: FarmerUiKey) => string,
  locale: AppLocale
): string {
  const c = condition.toLowerCase();
  if (/thunder|storm/.test(c)) return t("weatherCondStorm");
  if (/rain|drizzle|shower/.test(c)) return t("weatherCondRain");
  if (/fog|mist|haze/.test(c)) return t("weatherCondFog");
  if (/cloud|overcast/.test(c)) return t("weatherCondCloud");
  if (/clear|sunny/.test(c)) return t("weatherCondClear");
  return tf(locale, "weatherCondToday", { condition });
}

export default function WeatherRedesign({
  weather,
  lastUpdated,
  onRefresh,
  onShare,
}: Props) {
  const { t, locale } = useLocale();
  const dash = useMemo(() => buildFarmDashboardData(weather), [weather]);
  const tempNum = parseInt(weather.temp, 10) || 28;
  const rainNow = weather.hourlyForecast[0]?.rainChancePercent ?? dash.metrics.rainChance;
  const sky = conditionSky(weather.condition);
  const nowHour = new Date().getHours();
  const uvLabel = estimateUv(weather.condition, nowHour, t);

  const weekForecast =
    weather.dailyForecast.length > 0
      ? weather.dailyForecast
      : dash.dayTabs.map((tab, i) => ({
          id: tab.id,
          label: i === 0 ? (locale === "hi" ? "आज" : "Today") : i === 1 ? (locale === "hi" ? "कल" : "Tomorrow") : tab.label,
          icon: dash.hourly[i * 3]?.icon ?? "🌤",
          high: Math.round(dash.metrics.tempHigh - i),
          low: Math.round(dash.metrics.tempLow - i * 0.5),
          rainChance: dash.hourly[i * 3]?.rainPercent ?? 20,
        }));

  const todayHi = weekForecast[0]?.high ?? tempNum + 2;
  const todayLo = weekForecast[0]?.low ?? tempNum - 4;
  const spraySafe = rainNow < 30 && dash.metrics.windKmh < 15;
  const irrigationHold = (weekForecast[1]?.rainChance ?? 0) >= 50;
  const diseaseHigh = dash.metrics.humidity >= 70 || rainNow >= 40;

  const hourly = weather.hourlyForecast.slice(0, 8);
  const hourlyTemps = hourly.map((h) => parseInt(h.temp, 10) || tempNum);
  const tempMin = Math.min(...hourlyTemps, tempNum);
  const tempMax = Math.max(...hourlyTemps, tempNum);
  const tempSpan = Math.max(1, tempMax - tempMin);

  const chartPoints = hourlyTemps
    .map((temp, i) => {
      const x = hourlyTemps.length <= 1 ? 50 : (i / (hourlyTemps.length - 1)) * 100;
      const y = 88 - ((temp - tempMin) / tempSpan) * 70;
      return `${x},${y}`;
    })
    .join(" ");

  const detailRows = [
    {
      icon: Thermometer,
      label: t("weatherFeels"),
      value: weather.feelsLike ?? `${tempNum + 2}°`,
    },
    {
      icon: Wind,
      label: t("weatherWind"),
      value: weather.windSpeed,
    },
    {
      icon: Droplets,
      label: t("weatherHumidity"),
      value: weather.humidity,
    },
    {
      icon: Sun,
      label: t("weatherUv"),
      value: uvLabel,
    },
  ];

  const stamp =
    lastUpdated ??
    new Date();
  const stampLabel = stamp.toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 overflow-x-hidden pb-2">
      {weather.isDemo && (
        <div className="rounded-2xl border border-amber-400/35 bg-amber-400/10 px-3 py-2 text-[11px] leading-relaxed text-amber-200">
          {weather.demoNotice ?? t("weatherDemoNotice")}
        </div>
      )}

      {/* Atmospheric hero — inspired composition */}
      <section
        className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${sky.base} text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.65)]`}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: sky.glow }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />

        <div className="relative px-5 pb-5 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1.5 text-[13px] font-semibold text-white/90">
              <MapPin className={`h-4 w-4 shrink-0 ${sky.accent}`} />
              <span className="truncate">{shortLocation(weather.location)}</span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  aria-label="रिफ्रेश"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md transition active:scale-95"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              )}
              {onShare && (
                <button
                  type="button"
                  onClick={onShare}
                  aria-label="शेयर"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md transition active:scale-95"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-display)] text-[4.5rem] font-semibold leading-none tracking-tight">
                {tempNum}
                <span className="align-top text-3xl font-medium text-white/70">°</span>
              </p>
              <p className={`mt-2 flex items-center gap-2 text-base font-semibold ${sky.accent}`}>
                <ConditionIcon condition={weather.condition} className="h-5 w-5" />
                {hindiConditionLine(weather.condition, t, locale)}
              </p>
              <p className="mt-1 text-[11px] font-medium text-white/55">{stampLabel}</p>
            </div>

            <div className="mt-1 space-y-2.5 text-right">
              {detailRows.map((row) => (
                <div key={row.label} className="flex items-center justify-end gap-2">
                  <div className="text-right">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-white/45">
                      {row.label}
                    </p>
                    <p className="text-sm font-bold text-white">{row.value}</p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/10">
                    <row.icon className={`h-3.5 w-3.5 ${sky.accent}`} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Partly-sunny style summary strip */}
          <div className="mt-6 rounded-[1.35rem] border border-white/12 bg-black/25 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold capitalize text-white">{weather.condition}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-white/55">
                  H: {todayHi}° &nbsp;|&nbsp; L: {todayLo}°
                </p>
              </div>
              <AppLink
                href="/weather/spray-advisory"
                className="rounded-full bg-white px-3.5 py-2 text-[11px] font-bold text-stone-900 shadow-lg shadow-black/20"
              >
                {t("weatherSprayAdviceCta")}
              </AppLink>
            </div>

            {/* Hourly temperature curve */}
            {hourly.length > 1 && (
              <div className="mt-3">
                <svg
                  viewBox="0 0 100 100"
                  className="h-16 w-full overflow-visible"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id="wxCurveFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(96,165,250,0.35)" />
                      <stop offset="100%" stopColor="rgba(96,165,250,0)" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={`0,100 ${chartPoints} 100,100`}
                    fill="url(#wxCurveFill)"
                  />
                  <polyline
                    points={chartPoints}
                    fill="none"
                    stroke="rgba(147,197,253,0.95)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  {hourlyTemps.map((temp, i) => {
                    const x =
                      hourlyTemps.length <= 1
                        ? 50
                        : (i / (hourlyTemps.length - 1)) * 100;
                    const y = 88 - ((temp - tempMin) / tempSpan) * 70;
                    return (
                      <circle
                        key={`pt-${i}`}
                        cx={x}
                        cy={y}
                        r="1.6"
                        fill="#fff"
                        stroke="rgba(56,189,248,0.9)"
                        strokeWidth="0.6"
                      />
                    );
                  })}
                </svg>

                <div className="-mx-1 mt-1 flex justify-between gap-1 overflow-x-auto scrollbar-hide">
                  {hourly.map((h, i) => (
                    <div
                      key={`${h.time}-${i}`}
                      className="flex min-w-[2.6rem] flex-1 flex-col items-center gap-0.5 px-0.5 text-center"
                    >
                      <span className="text-[10px] font-bold text-white">
                        {parseInt(h.temp, 10) || tempNum}°
                      </span>
                      <ConditionIcon
                        condition={weather.condition}
                        className="h-3.5 w-3.5 text-white/70"
                      />
                      <span className="text-[9px] font-medium text-white/45">
                        {i === 0 ? t("weatherNow") : h.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* खेती सलाह — photo job cards */}
      <section>
        <h3 className="mb-2 px-1 text-sm font-bold text-[var(--av-text-primary)]">
          {t("weatherFarmAdvice")}
        </h3>
        <div className="grid gap-3">
          <AppLink
            href="/weather/spray-advisory"
            className="relative flex min-h-[108px] overflow-hidden rounded-2xl border border-white/10 shadow-[var(--av-shadow-md)] active:scale-[0.99]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/jobs/job-spray.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              className={`absolute inset-0 ${
                spraySafe
                  ? "bg-gradient-to-r from-emerald-950/88 to-emerald-900/50"
                  : "bg-gradient-to-r from-amber-950/88 to-amber-900/50"
              }`}
            />
            <div className="relative z-10 flex flex-1 items-center gap-3 p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white">
                {spraySafe ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <AlertTriangle className="h-6 w-6" />
                )}
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-bold uppercase tracking-wide text-white/80">
                  {t("weatherSprayLabel")}
                </p>
                <p className="text-[16px] font-extrabold leading-snug text-white">
                  {spraySafe ? t("weatherSpraySafe") : t("weatherSprayCaution")}
                </p>
                <p className="mt-0.5 text-[12px] font-semibold text-white/85">
                  करें या नहीं
                </p>
              </div>
            </div>
          </AppLink>

          <div className="relative flex min-h-[108px] overflow-hidden rounded-2xl border border-white/10 shadow-[var(--av-shadow-md)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/home/home-job-weather.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              className={`absolute inset-0 ${
                irrigationHold
                  ? "bg-gradient-to-r from-amber-950/88 to-sky-900/45"
                  : "bg-gradient-to-r from-sky-950/88 to-sky-900/45"
              }`}
            />
            <div className="relative z-10 flex flex-1 items-center gap-3 p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white">
                <Droplets className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-bold uppercase tracking-wide text-white/80">
                  {t("weatherIrrigationLabel")}
                </p>
                <p className="text-[16px] font-extrabold leading-snug text-white">
                  {irrigationHold ? t("weatherIrrigationHold") : t("weatherIrrigationOk")}
                </p>
              </div>
            </div>
          </div>

          <AppLink
            href="/pest-diseases"
            className="relative flex min-h-[108px] overflow-hidden rounded-2xl border border-white/10 shadow-[var(--av-shadow-md)] active:scale-[0.99]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/jobs/job-pest.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              className={`absolute inset-0 ${
                diseaseHigh
                  ? "bg-gradient-to-r from-rose-950/88 to-rose-900/50"
                  : "bg-gradient-to-r from-emerald-950/88 to-teal-900/45"
              }`}
            />
            <div className="relative z-10 flex flex-1 items-center gap-3 p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white">
                <ShieldAlert className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-bold uppercase tracking-wide text-white/80">
                  {t("weatherDiseaseLabel")}
                </p>
                <p className="text-[16px] font-extrabold leading-snug text-white">
                  {diseaseHigh ? t("weatherDiseaseHigh") : t("weatherDiseaseNormal")}
                </p>
              </div>
            </div>
          </AppLink>
        </div>
      </section>

      {/* 7-day */}
      <section className="rounded-[1.75rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{t("weather7Day")}</h3>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--av-text-muted)]">
            <Eye className="h-3 w-3" />
            {tf(locale, "weatherRainPct", { n: "" }).replace(/^\s*%\s*/, "")}
          </span>
        </div>
        <ul className="space-y-2.5">
          {weekForecast.map((day) => (
            <li
              key={day.id}
              className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-2 rounded-2xl bg-[var(--av-surface-inset)] px-2.5 py-2"
            >
              <span className="text-center text-lg leading-none" aria-hidden>
                {day.icon}
              </span>
              <div className="min-w-0">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-[var(--av-text-primary)]">{day.label}</p>
                  <p className="text-[10px] font-semibold text-sky-600 dark:text-sky-400">
                    {tf(locale, "weatherRainPct", { n: day.rainChance })}
                  </p>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-sky-100 dark:bg-sky-950/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-600"
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

      {weather.rainfallAlert && (
        <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 px-3 py-2.5">
          <p className="text-xs leading-relaxed text-sky-800 dark:text-sky-200">
            {weather.rainfallAlert}
          </p>
        </div>
      )}

      {lastUpdated && (
        <p className="text-center text-[10px] text-[var(--av-text-muted)]">
          {tf(locale, "weatherUpdated", {
            time: lastUpdated.toLocaleTimeString("hi-IN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          })}
        </p>
      )}
    </div>
  );
}
