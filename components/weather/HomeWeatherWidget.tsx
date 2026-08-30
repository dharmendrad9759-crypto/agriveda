"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import WeatherSummaryCard from "@/components/weather/WeatherSummaryCard";
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
  const tip =
  !isSample && rainChance >= 55
      ? isHi
        ? `बारिश ${rainChance}% — आज स्प्रे मत करो`
        : `${rainChance}% rain — skip spray today`
      : !isSample && humidityPct >= 80
        ? isHi
          ? "नमी ज्यादा — पत्ती पर नज़र रखो"
          : "High humidity — watch leaves"
        : isHi
          ? "पूरा मौसम खोलो — खेत सलाह मिलेगी"
          : "Open weather for farm tips";

  return (
    <div className={className}>
      <WeatherSummaryCard weather={weather} compact />
      <p className="mt-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-[12px] font-semibold leading-snug text-[var(--av-text-secondary)]">
        {tip}
      </p>
      {isSample ? (
        <p className="mt-1.5 text-center text-[11px] font-semibold text-amber-600">
          {isHi ? "नमूना — लाइव नहीं" : "Sample — not live"}
        </p>
      ) : null}
    </div>
  );
}
