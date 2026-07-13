"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { Droplets, Loader2, Sun, Wind, CloudRain } from "lucide-react";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";

const HERO_BG =
  "https://images.unsplash.com/photo-1536304575081-ff8c827fd69f?w=1400&q=85&auto=format&fit=crop";

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

  return (
    <section className="relative overflow-hidden rounded-2xl border border-emerald-500/20 shadow-[0_8px_32px_rgba(0,100,50,0.15)]">
      <div className="absolute inset-0">
        <Image
          src={HERO_BG}
          alt="Green crop field"
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 1280px) 100vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/88 via-emerald-900/72 to-emerald-800/45" />
      </div>

      <div className="relative z-10 p-4 sm:p-5">
        <p className="text-lg font-black text-white sm:text-xl">
          {greeting()}, {name}! 👋
        </p>
        <p className="mt-0.5 text-xs text-emerald-50/85 sm:text-sm">
          आज का मौसम और खेती — एक नज़र में
        </p>

        {loading ? (
          <div className="mt-4 flex items-center gap-2 text-white/90">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">मौसम लोड हो रहा है…</span>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-3xl font-black text-white sm:text-4xl">{temp}</p>
              <p className="text-xs capitalize text-emerald-100/90">{condition}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Droplets, label: "Humidity", value: humidity },
                { icon: Wind, label: "Wind", value: wind },
                { icon: CloudRain, label: "Rain", value: `${rainChance}%` },
                { icon: Sun, label: "UV", value: "Mod" },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/15 bg-black/20 px-2.5 py-1.5 backdrop-blur-md"
                >
                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-emerald-100/75">
                    <Icon className="h-3 w-3" />
                    {label}
                  </div>
                  <p className="text-xs font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <AppLink
          href="/weather"
          className="mt-3 inline-flex text-[11px] font-bold text-emerald-200 hover:text-white"
        >
          पूरा मौसम देखें →
        </AppLink>
      </div>
    </section>
  );
}
