"use client";

import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import WeatherConditionIcon from "@/components/weather/WeatherConditionIcon";
import WeatherSummaryCard from "@/components/weather/WeatherSummaryCard";
import type { WeatherViewModel } from "@/lib/weatherApi";
import { buildFarmDashboardData } from "@/lib/weatherDashboardData";
import { tf } from "@/lib/i18n/farmer-ui";
import {
  ADVISORY_STYLES,
  buildFarmAdvisories,
  shortLocation,
} from "@/lib/weather/weatherUi";
import { cn } from "@/lib/cn";
import {
  AlertTriangle,
  ArrowRight,
  Droplets,
  Eye,
  MapPin,
  RefreshCw,
  Share2,
  Thermometer,
  Wind,
} from "lucide-react";
import { useMemo } from "react";

interface Props {
  weather: WeatherViewModel;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
  onShare?: () => void;
  onEnableLocation?: () => void;
  onLocationClick?: () => void;
}

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

  const advisories = buildFarmAdvisories(weather, hi);
  const surfaceCard =
    "rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]";

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 overflow-x-hidden pb-4">
      {/* Page toolbar */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <button
          type="button"
          onClick={() => onLocationClick?.()}
          className="flex min-w-0 items-center gap-1.5 rounded-full border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2 text-[12px] font-bold text-[var(--av-text-primary)]"
        >
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--av-accent)]" />
          <span className="truncate">{shortLocation(weather.location)}</span>
        </button>
        <div className="flex shrink-0 gap-1.5">
          {onRefresh ? (
            <button
              type="button"
              onClick={onRefresh}
              aria-label={hi ? "रिफ्रेश" : "Refresh"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          ) : null}
          {onShare ? (
            <button
              type="button"
              onClick={onShare}
              aria-label={hi ? "शेयर" : "Share"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
            >
              <Share2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {lastUpdated ? (
        <p className="px-0.5 text-[11px] font-medium text-[var(--av-text-muted)]">
          {tf(locale, "weatherUpdated", {
            time: lastUpdated.toLocaleTimeString(hi ? "hi-IN" : "en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          })}
        </p>
      ) : null}

      {weather.isDemo ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
          {weather.demoNotice ?? t("weatherDemoNotice")}
        </div>
      ) : null}

      {/* Hero */}
      <WeatherSummaryCard
        weather={weather}
        linked={false}
        onLocationClick={onLocationClick}
      />

      {/* Current conditions — 3 cards */}
      <section>
        <h2 className="mb-2.5 px-0.5 text-[13px] font-bold text-[var(--av-text-primary)]">
          {hi ? "अभी का मौसम" : "Current conditions"}
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              label: hi ? "महसूस" : t("weatherFeels"),
              value: weather.feelsLike ?? weather.temp,
              Icon: Thermometer,
            },
            {
              label: hi ? "नमी" : "Humidity",
              value: weather.humidity,
              Icon: Droplets,
            },
            {
              label: t("weatherWind"),
              value: weather.windSpeed,
              Icon: Wind,
            },
          ].map(({ label, value, Icon }) => (
            <div key={label} className={cn(surfaceCard, "p-3")}>
              <Icon className="h-4 w-4 text-sky-600" />
              <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[var(--av-text-muted)]">
                {label}
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-[1.35rem] font-bold leading-none text-[var(--av-text-primary)]">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7-day forecast */}
      <section className={cn(surfaceCard, "overflow-hidden")}>
        <h2 className="border-b border-[var(--av-border-subtle)] px-4 py-3 text-[13px] font-bold text-[var(--av-text-primary)]">
          {t("weather7Day")}
        </h2>
        {weekForecast.slice(0, 7).map((day, i) => (
          <div
            key={day.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              i > 0 && "border-t border-[var(--av-border-subtle)]"
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-[var(--av-text-primary)]">{day.label}</p>
              {day.rainChance > 0 ? (
                <p className="text-[11px] text-[var(--av-text-muted)]">
                  {hi ? `बारिश ${day.rainChance}%` : `${day.rainChance}% rain`}
                </p>
              ) : null}
            </div>
            <WeatherConditionIcon
              condition={weather.condition}
              className="h-6 w-6 shrink-0 text-sky-600"
            />
            <p className="w-10 shrink-0 text-right text-[12px] font-bold text-sky-600">
              {day.rainChance > 0 ? `${day.rainChance}%` : "—"}
            </p>
            <div className="flex w-16 shrink-0 items-center justify-end gap-2 tabular-nums">
              <span className="text-[15px] font-bold text-[var(--av-text-primary)]">
                {day.high}°
              </span>
              <span className="text-[14px] font-medium text-[var(--av-text-muted)]">
                {day.low}°
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Farmer advisory */}
      <section>
        <h2 className="mb-2.5 px-0.5 text-[13px] font-bold text-[var(--av-text-primary)]">
          {hi ? "खेत सलाह" : "Farm advisory"}
        </h2>
        <div className="space-y-2">
          {advisories.map((item) => {
            const body = (
              <div
                className={cn(
                  "rounded-2xl border px-4 py-3",
                  ADVISORY_STYLES[item.tone],
                  item.href && "active:scale-[0.99]"
                )}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 opacity-80" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold">{item.title}</p>
                    <p className="mt-1 text-[12px] leading-relaxed opacity-90">{item.body}</p>
                  </div>
                  {item.href ? (
                    <ArrowRight className="h-4 w-4 shrink-0 opacity-60" />
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

      {/* API recommendations (existing data only) */}
      {weather.recommendations.length > 0 ? (
        <section className="space-y-2">
          {weather.recommendations.map((rec, i) => (
            <div
              key={`${rec.title}-${i}`}
              className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 dark:border-sky-500/30 dark:bg-sky-500/10"
            >
              <p className="text-[13px] font-bold text-sky-950 dark:text-sky-100">{rec.title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-sky-900 dark:text-sky-200">
                {rec.advice}
              </p>
            </div>
          ))}
        </section>
      ) : null}

      {/* Rainfall alert */}
      {weather.rainfallAlert ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-500/30 dark:bg-amber-500/10">
          <p className="text-[13px] font-semibold leading-snug text-amber-950 dark:text-amber-100">
            {weather.rainfallAlert}
          </p>
        </div>
      ) : null}

      {/* Extra metrics */}
      {weather.visibilityKm ? (
        <div className={cn(surfaceCard, "flex items-center gap-3 p-4")}>
          <Eye className="h-5 w-5 text-[var(--av-text-muted)]" />
          <div>
            <p className="text-[12px] font-bold text-[var(--av-text-muted)]">
              {hi ? "दृश्यता" : "Visibility"}
            </p>
            <p className="text-[15px] font-bold text-[var(--av-text-primary)]">
              {weather.visibilityKm}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
