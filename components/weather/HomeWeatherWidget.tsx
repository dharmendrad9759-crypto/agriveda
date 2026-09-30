"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import WeatherSummaryCard from "@/components/weather/WeatherSummaryCard";
import AppLink from "@/components/ui/AppLink";
import type { WeatherViewModel } from "@/lib/weatherApi";
import { cn } from "@/lib/cn";

interface Props {
  weather: WeatherViewModel | null;
  loading?: boolean;
  isSample?: boolean;
  className?: string;
}

export default function HomeWeatherWidget({ weather, loading, isSample, className }: Props) {
  const { locale } = useLocale();
  const isHi = locale === "hi";

  if (loading || !weather) {
    return (
      <div
        className={cn(
          "min-h-[9.5rem] animate-pulse rounded-2xl bg-gradient-to-br from-sky-200 to-emerald-200",
          className
        )}
      />
    );
  }

  const rainChance = weather.hourlyForecast[0]?.rainChancePercent ?? 0;
  const humidityPct = Number.parseInt(weather.humidity, 10) || 0;
  const holdSpray = !isSample && (rainChance >= 40 || humidityPct >= 85);
  const tip = holdSpray
    ? isHi
      ? `बारिश ${rainChance}% — आज छिड़काव टालें`
      : `${rainChance}% rain — hold spray today`
    : isHi
      ? "आज छिड़काव करें या टालें?"
      : "Spray today, or wait?";

  return (
    <div className={className}>
      <WeatherSummaryCard weather={weather} compact />
      <AppLink
        href="/weather/spray-advisory"
        className="mt-2 block rounded-xl border border-[#D0DDD7] bg-[var(--av-surface)] px-3 py-3 text-[14px] font-bold leading-snug text-[var(--av-text-primary)]"
      >
        {tip}
      </AppLink>
      {isSample ? (
        <p className="mt-1.5 text-center text-[11px] font-semibold text-amber-600">
          {isHi ? "नमूना — लाइव नहीं" : "Sample — not live"}
        </p>
      ) : null}
    </div>
  );
}
