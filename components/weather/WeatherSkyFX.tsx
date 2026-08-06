"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

export type WeatherFxMode = "rain" | "storm" | "cloud" | "clear" | "fog";

/**
 * Prefer spoken condition over mild rain% so "बादल" shows real cloud photo,
 * not forced rain plate.
 */
export function detectWeatherFxMode(
  condition: string,
  rainChance?: number | null
): WeatherFxMode {
  const c = (condition || "").toLowerCase();
  if (/thunder|storm|lightning|तूफान/.test(c)) return "storm";
  if (/rain|drizzle|shower|बारिश/.test(c)) return "rain";
  if (/fog|mist|haze|धुंध|कोहरा/.test(c)) return "fog";
  if (/cloud|overcast|बादल/.test(c)) {
    // Heavy rain chance can still push cloudy → rain look
    if (rainChance != null && rainChance >= 70) return "rain";
    return "cloud";
  }
  if (rainChance != null && rainChance >= 60) return "rain";
  if (/clear|sunny|साफ/.test(c)) return "clear";
  if (rainChance != null && rainChance >= 45) return "cloud";
  return "clear";
}

/** Real sky photo plate for weather heroes (home + /weather). */
export function weatherSkyPhoto(mode: WeatherFxMode): string {
  // cache-bust so refreshed sky plates load after asset swaps
  const v = "v3";
  switch (mode) {
    case "storm":
      return `/images/weather/sky-storm.jpg?${v}`;
    case "rain":
      return `/images/weather/sky-rain.jpg?${v}`;
    case "fog":
    case "cloud":
      return `/images/weather/sky-cloud.jpg?${v}`;
    default:
      return `/images/weather/sky-clear.jpg?${v}`;
  }
}

/** Soft veil — keep photo visible, still readable. */
export function weatherSkyInk(mode: WeatherFxMode) {
  const darkPhoto = mode === "storm" || mode === "rain";
  return {
    ink: "text-white",
    mute: "text-white/90",
    card: darkPhoto
      ? "bg-black/45 border-white/20 text-white"
      : "bg-black/40 border-white/25 text-white",
    chip: "bg-black/35 border-white/20",
    veil: darkPhoto
      ? "bg-gradient-to-t from-black/70 via-black/25 to-black/10"
      : "bg-gradient-to-t from-black/65 via-black/20 to-transparent",
  };
}

type Props = {
  mode: WeatherFxMode;
  density?: "home" | "page";
  className?: string;
};

/**
 * Subtle live FX only — photo does the realism.
 * No cartoon sun discs / fake fog blobs over the sky plate.
 */
export default function WeatherSkyFX({
  mode,
  density = "page",
  className,
}: Props) {
  const reduce = useReducedMotion();
  const rich = density === "page";

  const dropCount =
    mode === "storm" ? (rich ? 48 : 32) : mode === "rain" ? (rich ? 40 : 28) : 0;

  const drops = useMemo(
    () =>
      Array.from({ length: dropCount }, (_, i) => ({
        id: i,
        left: `${(i * 17 + (i % 7) * 9) % 100}%`,
        delay: `${((i * 0.07) % 2.2).toFixed(2)}s`,
        duration: `${(0.55 + (i % 8) * 0.09).toFixed(2)}s`,
        height: 16 + (i % 7) * 4,
        width: i % 5 === 0 ? 2.2 : 1.4,
        opacity: 0.35 + (i % 5) * 0.08,
      })),
    [dropCount]
  );

  if (reduce) return null;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {/* Soft breathing light — clear only, no fake sun graphic */}
      {mode === "clear" && (
        <span className="absolute -right-6 top-0 h-48 w-48 rounded-full bg-amber-200/25 blur-3xl animate-wx-sun" />
      )}

      {/* Rain particles only when raining — photo already has rain look */}
      {(mode === "rain" || mode === "storm") && (
        <div className="absolute inset-0">
          {drops.map((d) => (
            <span
              key={d.id}
              className={cn("wx-rain-drop", mode === "storm" && "wx-rain-drop--storm")}
              style={{
                left: d.left,
                width: d.width,
                height: d.height,
                opacity: d.opacity,
                animationDelay: d.delay,
                animationDuration: d.duration,
              }}
            />
          ))}
        </div>
      )}

      {mode === "storm" && <span className="wx-lightning" />}
    </div>
  );
}
