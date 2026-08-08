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
  MapPin,
  RefreshCw,
  Share2,
  ArrowRight,
  Cloud,
  CloudRain,
  CloudSun,
  CloudLightning,
  Sun,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import WeatherSkyFX, {
  detectWeatherFxMode,
  weatherSkyInk,
  weatherSkyPhoto,
} from "@/components/weather/WeatherSkyFX";
import { cn } from "@/lib/cn";

interface Props {
  weather: WeatherViewModel;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
  onShare?: () => void;
  onEnableLocation?: () => void;
  onLocationClick?: () => void;
}

function shortLocation(location: string) {
  return location.split(",")[0]?.trim() || location;
}

function ConditionIcon({ condition, className }: { condition: string; className?: string }) {
  const c = condition.toLowerCase();
  if (/thunder|storm/.test(c)) return <CloudLightning className={className} />;
  if (/rain|drizzle|shower/.test(c)) return <CloudRain className={className} />;
  if (/cloud|overcast|fog|mist/.test(c)) return <Cloud className={className} />;
  if (/partly|few/.test(c)) return <CloudSun className={className} />;
  return <Sun className={className} />;
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

/**
 * Google / Pixel Weather language — real sky photo + FX,
 * Material cards for hours / days / metrics. One farm tip as "report".
 */
export default function WeatherRedesign({
  weather,
  lastUpdated,
  onRefresh,
  onShare,
  onEnableLocation,
  onLocationClick,
}: Props) {
  const { t, locale } = useLocale();
  const hi = locale === "hi";
  const dash = useMemo(() => buildFarmDashboardData(weather), [weather]);
  const tempNum = parseInt(weather.temp, 10) || 28;
  const rainNow = weather.hourlyForecast[0]?.rainChancePercent ?? dash.metrics.rainChance;
  const high = Math.round(dash.metrics.tempHigh);
  const low = Math.round(dash.metrics.tempLow);
  const pageWxMode = detectWeatherFxMode(weather.condition, rainNow);
  const stage = weatherSkyInk(pageWxMode);
  const skyPhoto = weatherSkyPhoto(pageWxMode);
  const condHi = hindiConditionLine(weather.condition, t, locale);

  const weekForecast =
    weather.dailyForecast.length > 0
      ? weather.dailyForecast
      : dash.dayTabs.map((tab, i) => ({
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

  const spraySafe = rainNow < 30 && dash.metrics.windKmh < 15;
  const irrigationHold = (weekForecast[1]?.rainChance ?? 0) >= 50;
  const diseaseHigh = dash.metrics.humidity >= 70 || rainNow >= 40;

  const farmReport = spraySafe
    ? hi
      ? "सुबह स्प्रे ठीक रहेगा। हवा हल्की है — खेत का काम चला सकते हो।"
      : "Morning spray looks fine. Light wind — good for field work."
    : rainNow >= 45
      ? hi
        ? `बारिश का मौका ${rainNow}% — आज स्प्रे मत करो।`
        : `${rainNow}% rain chance — don't spray today.`
      : hi
        ? `हवा तेज़/नमी ज्यादा — स्प्रे बाद में करो।`
        : `Wind/humidity high — spray later.`;

  const hourly = weather.hourlyForecast.slice(0, 12);
  const reduceMotion = useReducedMotion();
  const rise = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: MOTION.normal, ease: EASE_OUT, delay },
        };

  const surfaceCard =
    "rounded-[28px] border border-[var(--av-border)] bg-[var(--av-surface)]";

  return (
    <div className="mx-auto w-full max-w-lg space-y-0 overflow-x-hidden pb-4">
      {/* Immersive sky photo + live FX */}
      <motion.section
        {...rise(0)}
        className="relative isolate min-h-[26rem] overflow-hidden rounded-[36px] px-5 pb-6 pt-5 sm:min-h-[28rem] sm:px-6"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={skyPhoto}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            !reduceMotion && "animate-wx-sky-ken"
          )}
        />
        <span className={cn("absolute inset-0", stage.veil)} />
        <WeatherSkyFX mode={pageWxMode} density="page" />

        <div className={cn("relative z-10 flex min-h-[24rem] flex-col sm:min-h-[26rem]", stage.ink)}>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onLocationClick?.()}
              className={cn(
                "flex min-w-0 max-w-[70%] items-center gap-1.5 rounded-full text-left text-[15px] font-medium active:opacity-80",
                stage.mute
              )}
              aria-label="स्थान जाँचें"
            >
              <MapPin className="h-4 w-4 shrink-0 opacity-80" />
              <span className="truncate underline decoration-white/40 underline-offset-2">
                {shortLocation(weather.location)}
              </span>
            </button>
            <div className="flex shrink-0 gap-1.5">
              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  aria-label="रिफ्रेश — स्थान जाँचें"
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border active:scale-95",
                    stage.chip
                  )}
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              )}
              {onShare && (
                <button
                  type="button"
                  onClick={onShare}
                  aria-label="शेयर"
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border active:scale-95",
                    stage.chip
                  )}
                >
                  <Share2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sky breathing room — FX reads here */}
          <div className="flex flex-1 flex-col justify-end pt-10">
            <p className={cn("text-center text-[18px] font-medium tracking-tight", stage.mute)}>
              {condHi}
            </p>

            <div className="mt-1 flex items-end justify-center gap-1">
              <p className="font-[family-name:var(--font-display)] text-[7.25rem] font-semibold leading-[0.9] tracking-tight sm:text-[8rem]">
                {tempNum}
              </p>
              {pageWxMode !== "clear" && (
                <ConditionIcon
                  condition={weather.condition}
                  className="mb-5 h-14 w-14 opacity-90 sm:mb-6 sm:h-16 sm:w-16"
                />
              )}
            </div>

            <p className={cn("mt-3 text-center text-[15px] font-medium", stage.mute)}>
              {t("weatherFeels")} {weather.feelsLike ?? `${tempNum + 2}°`}
              <span className="mx-2 opacity-35">·</span>
              H {high}°
              <span className="mx-1 opacity-35">/</span>
              L {low}°
            </p>
          </div>

          <div
            className={cn(
              "mt-6 rounded-[28px] border px-5 py-4 text-[16px] font-semibold leading-relaxed backdrop-blur-[2px]",
              stage.card
            )}
          >
            <p className="text-[12px] font-bold tracking-wide opacity-65">
              {hi ? "खेत सलाह" : "Farm tip"}
            </p>
            <p className="mt-2">{farmReport}</p>
            <AppLink
              href="/weather/spray-advisory"
              className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold opacity-90"
            >
              {t("weatherSprayAdviceCta")}
              <ArrowRight className="h-4 w-4" />
            </AppLink>
          </div>
        </div>
      </motion.section>

      <div className="mt-5 space-y-4">
        {weather.isDemo && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
            {weather.demoNotice ?? t("weatherDemoNotice")}
          </div>
        )}

        {/* Hourly — Google card */}
        {hourly.length > 0 && (
          <motion.section {...rise(0.05)} className={cn(surfaceCard, "px-4 py-4")}>
            <p className="mb-4 text-[13px] font-semibold text-[var(--av-text-muted)]">
              {hi ? "घंटे का मौसम" : "Hourly"}
            </p>
            <div className="-mx-1 flex gap-0.5 overflow-x-auto px-0.5 pb-0.5 scrollbar-hide">
              {hourly.map((h, i) => {
                const tempH = parseInt(h.temp, 10) || tempNum;
                return (
                  <div
                    key={`${h.time}-${i}`}
                    className="flex w-[4rem] shrink-0 flex-col items-center gap-1.5 py-1"
                  >
                    <p className="text-[12px] font-medium text-[var(--av-text-muted)]">
                      {i === 0 ? t("weatherNow") : h.time.replace(":00", "")}
                    </p>
                    <ConditionIcon
                      condition={weather.condition}
                      className="h-6 w-6 text-sky-600"
                    />
                    {(h.rainChancePercent ?? 0) > 0 ? (
                      <p className="text-[11px] font-semibold text-sky-600">
                        {h.rainChancePercent}%
                      </p>
                    ) : (
                      <span className="h-[17px]" />
                    )}
                    <p className="text-[16px] font-semibold tabular-nums text-[var(--av-text-primary)]">
                      {tempH}°
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Daily — Google list card */}
        <motion.section {...rise(0.08)} className={cn(surfaceCard, "overflow-hidden py-1")}>
          <p className="px-5 pb-2 pt-4 text-[13px] font-semibold text-[var(--av-text-muted)]">
            {t("weather7Day")}
          </p>
          {weekForecast.slice(0, 7).map((day, i) => (
            <div
              key={day.id}
              className={cn(
                "flex items-center gap-3 px-5 py-3.5",
                i > 0 && "border-t border-[var(--av-border-subtle)]"
              )}
            >
              <p className="w-14 shrink-0 text-[15px] font-semibold text-[var(--av-text-primary)]">
                {day.label}
              </p>
              <ConditionIcon
                condition={weather.condition}
                className="h-6 w-6 shrink-0 text-sky-600"
              />
              <p className="w-12 text-[13px] font-semibold text-sky-600">
                {day.rainChance > 0 ? `${day.rainChance}%` : ""}
              </p>
              <div className="ml-auto flex items-center gap-3 tabular-nums">
                <span className="text-[16px] font-semibold text-[var(--av-text-primary)]">
                  {day.high}°
                </span>
                <span className="text-[16px] font-medium text-[var(--av-text-muted)]">
                  {day.low}°
                </span>
              </div>
            </div>
          ))}
        </motion.section>

        {/* 2×2 metrics — larger, cleaner */}
        <motion.section {...rise(0.1)} className="grid grid-cols-2 gap-3">
          {[
            {
              label: hi ? "बारिश" : "Rain",
              value: `${rainNow}%`,
              Icon: CloudRain,
            },
            {
              label: t("weatherWind"),
              value: weather.windSpeed,
              Icon: Wind,
            },
            {
              label: hi ? "नमी" : "Humidity",
              value: weather.humidity,
              Icon: Droplets,
            },
            {
              label: t("weatherFeels"),
              value: weather.feelsLike ?? `${tempNum + 2}°`,
              Icon: Thermometer,
            },
          ].map(({ label, value, Icon }) => (
            <div key={label} className={cn(surfaceCard, "min-h-[7.5rem] p-5")}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold text-[var(--av-text-muted)]">{label}</p>
                <Icon className="h-5 w-5 text-sky-600" />
              </div>
              <p className="mt-4 font-[family-name:var(--font-display)] text-[2.35rem] font-semibold leading-none text-[var(--av-text-primary)]">
                {value}
              </p>
            </div>
          ))}
        </motion.section>

        {/* One clean farm actions strip */}
        <motion.section {...rise(0.12)} className={cn(surfaceCard, "divide-y divide-[var(--av-border-subtle)]")}>
          <AppLink
            href="/weather/spray-advisory"
            className="flex items-center gap-3.5 px-5 py-4 active:bg-[var(--av-surface-inset)]"
          >
            {spraySafe ? (
              <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600" />
            )}
            <span className="min-w-0 flex-1 text-[15px] font-semibold text-[var(--av-text-primary)]">
              {spraySafe ? t("weatherSpraySafe") : t("weatherSprayCaution")}
            </span>
            <ArrowRight className="h-4 w-4 text-[var(--av-text-muted)]" />
          </AppLink>
          <div className="flex items-center gap-3.5 px-5 py-4">
            <Droplets className="h-6 w-6 shrink-0 text-sky-600" />
            <span className="min-w-0 flex-1 text-[15px] font-semibold text-[var(--av-text-primary)]">
              {irrigationHold ? t("weatherIrrigationHold") : t("weatherIrrigationOk")}
            </span>
          </div>
          <AppLink
            href="/pest-diseases"
            className="flex items-center gap-3.5 px-5 py-4 active:bg-[var(--av-surface-inset)]"
          >
            <AlertTriangle
              className={cn(
                "h-6 w-6 shrink-0",
                diseaseHigh ? "text-rose-600" : "text-emerald-600"
              )}
            />
            <span className="min-w-0 flex-1 text-[15px] font-semibold text-[var(--av-text-primary)]">
              {diseaseHigh ? t("weatherDiseaseHigh") : t("weatherDiseaseNormal")}
            </span>
            <ArrowRight className="h-4 w-4 text-[var(--av-text-muted)]" />
          </AppLink>
        </motion.section>

        {weather.rainfallAlert && (
          <div className="rounded-[24px] border border-sky-200 bg-sky-50 px-4 py-3 dark:border-sky-500/30 dark:bg-sky-500/10">
            <p className="text-[13px] font-semibold leading-snug text-sky-950 dark:text-sky-100">
              {weather.rainfallAlert}
            </p>
          </div>
        )}

        {lastUpdated && (
          <p className="text-center text-[10px] text-[var(--av-text-muted)]">
            {tf(locale, "weatherUpdated", {
              time: lastUpdated.toLocaleTimeString(hi ? "hi-IN" : "en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            })}
          </p>
        )}
      </div>
    </div>
  );
}
