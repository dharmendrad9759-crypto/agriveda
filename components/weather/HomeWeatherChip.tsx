"use client";

import { SprayCan } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import WeatherConditionIcon from "@/components/weather/WeatherConditionIcon";
import AppLink from "@/components/ui/AppLink";
import type { WeatherViewModel } from "@/lib/weatherApi";
import { hindiConditionLine, parseTempNum, shortLocation } from "@/lib/weather/weatherUi";
import { cn } from "@/lib/cn";

interface Props {
  weather: WeatherViewModel | null;
  loading?: boolean;
  isSample?: boolean;
}

type Tone = "good" | "warn" | "stop" | "neutral";

function sprayVerdict(
  hi: boolean,
  isSample: boolean,
  rain: number,
  humidity: number,
  wind: number
): { label: string; tone: Tone } {
  if (isSample) return { label: hi ? "छिड़काव सलाह" : "Spray advice", tone: "neutral" };
  if (rain >= 40) return { label: hi ? `बारिश ${rain}% · छिड़काव टालें` : `${rain}% rain · hold spray`, tone: "stop" };
  if (wind >= 15) return { label: hi ? "तेज़ हवा · छिड़काव टालें" : "Windy · hold spray", tone: "stop" };
  if (humidity >= 85) return { label: hi ? "नमी ज़्यादा · ध्यान से" : "Humid · spray carefully", tone: "warn" };
  return { label: hi ? "आज छिड़काव ठीक" : "Good to spray", tone: "good" };
}

const TONE_STYLE: Record<Tone, { pill: string; dot: string }> = {
  good: {
    pill: "border-emerald-600/20 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
    dot: "bg-emerald-500",
  },
  warn: {
    pill: "border-amber-500/25 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
    dot: "bg-amber-500",
  },
  stop: {
    pill: "border-rose-500/25 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200",
    dot: "bg-rose-500",
  },
  neutral: {
    pill: "border-sky-500/20 bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200",
    dot: "bg-sky-500",
  },
};

/** Small tappable weather button (top-right of home greeting). */
export function HomeWeatherButton({ weather, loading, isSample }: Props) {
  const { t, locale } = useLocale();
  const hi = locale === "hi";

  if (loading || !weather) {
    return (
      <div className="h-[58px] w-[104px] shrink-0 animate-pulse rounded-2xl bg-gradient-to-br from-sky-200/70 to-emerald-200/60 dark:from-sky-900/50 dark:to-emerald-900/40" />
    );
  }

  const temp = parseTempNum(weather.temp);
  const cond = hindiConditionLine(weather.condition, t, locale);

  return (
    <AppLink
      href="/weather"
      aria-label={hi ? `मौसम ${temp} डिग्री, ${cond}` : `Weather ${temp} degrees, ${cond}`}
      className="group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 via-sky-700 to-emerald-800 py-2 pl-2 pr-3 text-white shadow-[0_10px_24px_-12px_rgba(8,47,73,0.7)] ring-1 ring-white/10 transition active:scale-95"
    >
      <span aria-hidden className="pointer-events-none absolute -right-4 -top-5 h-14 w-14 rounded-full bg-amber-300/30 blur-xl" />
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
        <WeatherConditionIcon condition={weather.condition} className="h-6 w-6 text-amber-200" />
      </span>
      <span className="relative min-w-0 leading-none">
        <span className="block text-[20px] font-bold tracking-tight">
          {temp}°
          {isSample ? (
            <span className="ml-1 align-top text-[9px] font-bold text-amber-200">{hi ? "नमूना" : "demo"}</span>
          ) : null}
        </span>
        <span className="mt-1 block max-w-[78px] truncate text-[10px] font-semibold text-white/80">
          {shortLocation(weather.location) || cond}
        </span>
      </span>
    </AppLink>
  );
}

/** One-line spray status pill, shown under the greeting. */
export function HomeSprayPill({ weather, loading, isSample }: Props) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  if (loading || !weather) return null;

  const rain = weather.hourlyForecast[0]?.rainChancePercent ?? 0;
  const humidity = Number.parseInt(weather.humidity, 10) || 0;
  const wind = Number.parseInt(weather.windSpeed, 10) || 0;
  const v = sprayVerdict(hi, Boolean(isSample), rain, humidity, wind);
  const style = TONE_STYLE[v.tone];

  return (
    <AppLink
      href="/weather/spray-advisory"
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-bold transition active:scale-95",
        style.pill
      )}
    >
      <span className={cn("relative flex h-2 w-2 shrink-0 rounded-full", style.dot)}>
        <span className={cn("absolute inset-0 animate-ping rounded-full opacity-60", style.dot)} />
      </span>
      <SprayCan className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{v.label}</span>
    </AppLink>
  );
}
