"use client";

import AppLink from "@/components/ui/AppLink";
import { CloudSun, Loader2 } from "lucide-react";
import { useLiveWeather } from "@/hooks/useLiveWeather";

interface WeatherPillProps {
  compact?: boolean;
  className?: string;
}

export default function WeatherPill({ compact = false, className = "" }: WeatherPillProps) {
  const { weather, loading } = useLiveWeather();

  const label = loading
    ? "…"
    : weather
      ? compact
        ? weather.temp.replace("°C", "°")
        : `${weather.temp} ${weather.condition.split(" ")[0]}`
      : compact
        ? "—"
        : "Weather";

  return (
    <AppLink
      href="/weather"
      className={`flex items-center gap-1.5 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)] hover:border-[var(--av-accent)]/40 ${compact ? "px-2 py-1 text-[9px]" : "px-3 py-1.5 text-xs font-medium text-[var(--av-text-primary)]"} ${className}`}
    >
      {loading ? (
        <Loader2 className={`animate-spin text-[var(--av-accent)] ${compact ? "h-3 w-3" : "h-3.5 w-3.5"}`} />
      ) : (
        <CloudSun className={`text-amber-500 ${compact ? "h-3 w-3" : "h-3.5 w-3.5"}`} />
      )}
      <span className="max-w-[120px] truncate">{label}</span>
    </AppLink>
  );
}
