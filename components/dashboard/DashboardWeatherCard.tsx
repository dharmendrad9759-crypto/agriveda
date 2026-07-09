"use client";

import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { AV } from "@/lib/design/tokens";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { CloudSun, Droplets, Loader2, Sun, Wind } from "lucide-react";

export default function DashboardWeatherCard() {
  const { weather, loading, error } = useLiveWeather();
  const { profile } = useFarmerProfile();
  const location =
    weather?.location ??
    ([profile.district, profile.state].filter(Boolean).join(", ") || "Sehore, MP");

  const temp = weather?.temp ?? "—";
  const condition = weather?.condition ?? (error ? "Load weather" : "—");
  const humidity = weather?.humidity ?? "—";
  const wind = weather?.windSpeed ?? "—";
  const rainChance = weather?.hourlyForecast[0]?.rainChancePercent ?? 0;
  const feelsLike = weather ? `${parseInt(weather.temp, 10) + 4}°C` : "—";

  return (
    <DarkCard hover className="xl:col-span-8" delay={1}>
      <SectionHeader title="Weather Today" action={{ label: "Full Forecast", href: "/weather" }} />
      <div className="mt-4 flex flex-wrap items-center gap-6">
        {loading ? (
          <div className="flex items-center gap-3 py-4">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--av-accent)]" />
            <p className={`text-sm ${AV.body}`}>Loading live weather…</p>
          </div>
        ) : (
          <>
            <div>
              <p className="text-4xl font-bold text-[var(--av-text-primary)]">{temp}</p>
              <p className={`text-sm capitalize ${AV.body}`}>
                {condition}
                {weather ? ` · Feels like ${feelsLike}` : ""}
              </p>
              <p className={`mt-0.5 ${AV.micro}`}>{location}</p>
              {error && (
                <AppLink href="/weather" className="mt-1 inline-block text-xs font-semibold text-[var(--av-accent)]">
                  Set location →
                </AppLink>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
              <span className={`flex items-center gap-1 ${AV.body}`}>
                <Droplets className="h-3.5 w-3.5 text-[var(--av-accent)]" /> {humidity}
              </span>
              <span className={`flex items-center gap-1 ${AV.body}`}>
                <Wind className="h-3.5 w-3.5 text-[var(--av-accent)]" /> {wind}
              </span>
              <span className={`flex items-center gap-1 ${AV.body}`}>
                <CloudSun className="h-3.5 w-3.5 text-[var(--av-accent)]" /> {rainChance}% rain
              </span>
              <span className={`flex items-center gap-1 ${AV.body}`}>
                <Sun className="h-3.5 w-3.5 text-amber-500" /> UV —
              </span>
            </div>
          </>
        )}
      </div>
    </DarkCard>
  );
}
