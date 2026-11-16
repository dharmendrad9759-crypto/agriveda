"use client";

import { sprayLightFromWeather, type SprayLight } from "@/lib/spray/sprayLight";

const TONE: Record<SprayLight, string> = {
  green: "bg-emerald-600 text-white",
  yellow: "bg-amber-400 text-amber-950",
  red: "bg-rose-600 text-white",
};

export default function SprayLightCard({
  weather,
}: {
  weather: {
    windSpeed?: string;
    isDemo?: boolean;
    dailyForecast?: { rainChance: number }[];
  } | null | undefined;
}) {
  const reading = sprayLightFromWeather(weather);
  return (
    <p className={`rounded-2xl px-3 py-2 text-[13px] font-black ${TONE[reading.light]}`}>
      {reading.lineHi}
    </p>
  );
}
