"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { Droplets, Loader2, Sun, Wind, CloudRain } from "lucide-react";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardWeatherHero() {
  const { weather, loading, error } = useLiveWeather();
  const { profile } = useFarmerProfile();
  const name = profile.name.trim() || "Kisan";

  const temp = weather?.temp ?? "32°C";
  const condition = weather?.condition ?? (error ? "Sunny" : "Sunny");
  const humidity = weather?.humidity ?? "22%";
  const wind = weather?.windSpeed ?? "8 km/h";
  const rainChance = weather?.hourlyForecast[0]?.rainChancePercent ?? 0;
  const feelsLike = weather ? `${parseInt(weather.temp, 10) + 3}°C` : "35°C";

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--av-border)] shadow-[var(--av-shadow-md)]">
      <div className="absolute inset-0">
        <Image
          src="/images/dashboard-hero.jpg"
          alt="Farm landscape at sunrise"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1280px) 100vw, 70vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-900/70 to-emerald-800/40" />
      </div>

      <div className="relative z-10 p-4 sm:p-5 lg:p-6">
        <p className="text-base font-bold text-white sm:text-lg lg:text-xl">
          {greeting()}, {name}! 👋
        </p>
        <p className="mt-1 max-w-xl text-xs text-emerald-50/90 sm:text-sm">
          Let&apos;s make your farm more productive today.
        </p>

        {loading ? (
          <div className="mt-5 flex items-center gap-2 text-white/90 sm:mt-6">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading weather…</span>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-4 sm:mt-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{temp}</p>
              <p className="mt-1 text-xs capitalize text-emerald-50 sm:text-sm">
                {condition} · Feels like {feelsLike}
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:gap-3 sm:grid-cols-4">
              {[
                { icon: Droplets, label: "Humidity", value: humidity },
                { icon: Wind, label: "Wind", value: wind },
                { icon: CloudRain, label: "Rain", value: `${rainChance}%` },
                { icon: Sun, label: "UV", value: "Moderate" },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="min-w-0 rounded-xl border border-white/15 bg-white/10 px-2 py-1.5 backdrop-blur-sm sm:px-3 sm:py-2"
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-100/80">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </div>
                  <p className="mt-0.5 text-sm font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <AppLink href="/weather" className="mt-3 inline-block text-xs font-semibold text-emerald-200 hover:underline">
            Set location for live weather →
          </AppLink>
        )}
      </div>
    </section>
  );
}
