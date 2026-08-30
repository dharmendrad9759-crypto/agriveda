"use client";

import AppLink from "@/components/ui/AppLink";
import WeatherConditionIcon from "@/components/weather/WeatherConditionIcon";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { WeatherViewModel } from "@/lib/weatherApi";
import { buildFarmDashboardData } from "@/lib/weatherDashboardData";
import {
  hindiConditionLine,
  parseTempNum,
  shortLocation,
} from "@/lib/weather/weatherUi";
import { cn } from "@/lib/cn";
import { Droplets, MapPin, Wind } from "lucide-react";

interface Props {
  weather: WeatherViewModel;
  className?: string;
  href?: string;
  linked?: boolean;
  onLocationClick?: () => void;
  compact?: boolean;
}

export default function WeatherSummaryCard({
  weather,
  className,
  href = "/weather",
  linked = true,
  onLocationClick,
  compact = false,
}: Props) {
  const { t, locale } = useLocale();
  const hi = locale === "hi";
  const dash = buildFarmDashboardData(weather);
  const temp = parseTempNum(weather.temp);
  const high = Math.round(dash.metrics.tempHigh);
  const low = Math.round(dash.metrics.tempLow);
  const rainNow = weather.hourlyForecast[0]?.rainChancePercent ?? dash.metrics.rainChance;
  const cond = hindiConditionLine(weather.condition, t, locale);

  const inner = (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-500 via-sky-600 to-emerald-600 p-4 text-white shadow-[0_8px_28px_rgba(14,116,144,0.22)]",
        compact ? "min-h-[9.5rem]" : "min-h-[11rem]",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-2">
          {onLocationClick ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onLocationClick();
              }}
              className="flex min-w-0 items-center gap-1 text-left text-[13px] font-semibold text-white/95"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{shortLocation(weather.location)}</span>
            </button>
          ) : (
            <p className="flex min-w-0 items-center gap-1 text-[13px] font-semibold text-white/95">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{shortLocation(weather.location)}</span>
            </p>
          )}
          <WeatherConditionIcon condition={weather.condition} className="h-8 w-8 shrink-0 text-white/90" />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <p className="text-[12px] font-medium text-white/85">{cond}</p>
            <p className="mt-0.5 font-[family-name:var(--font-display)] text-[3.25rem] font-bold leading-none tracking-tight">
              {temp}°
            </p>
            <p className="mt-1 text-[12px] font-semibold text-white/85">
              H {high}° · L {low}°
            </p>
          </div>
          <div className="space-y-1.5 text-right text-[11px] font-semibold text-white/90">
            <p className="inline-flex items-center justify-end gap-1">
              <Droplets className="h-3.5 w-3.5" />
              {weather.humidity}
            </p>
            <p className="inline-flex items-center justify-end gap-1">
              <Wind className="h-3.5 w-3.5" />
              {weather.windSpeed}
            </p>
            {rainNow > 0 ? (
              <p>
                {hi ? "बारिश" : "Rain"} {rainNow}%
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  if (linked && href) {
    return (
      <AppLink href={href} className="block active:scale-[0.99]">
        {inner}
      </AppLink>
    );
  }
  return inner;
}
