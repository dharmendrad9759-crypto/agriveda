"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { Droplets, Loader2, Sun, Wind, CloudRain, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";

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
  const reduced = useReducedMotion();
  const name = profile.name.trim() || "Kisan";
  const place = [profile.district, profile.state].filter(Boolean).join(", ");

  const temp = weather?.temp ?? "32°C";
  const condition = weather?.condition ?? "Sunny";
  const humidity = weather?.humidity ?? "22%";
  const wind = weather?.windSpeed ?? "8 km/h";
  const rainChance = weather?.hourlyForecast[0]?.rainChancePercent ?? 0;

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: MOTION.slow, ease: EASE_OUT }}
      className="relative overflow-hidden rounded-2xl border border-emerald-500/25 shadow-[0_10px_36px_rgba(0,80,40,0.18)]"
    >
      <div className="absolute inset-0">
        <Image
          src={HERO_BG}
          alt="Green crop field"
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 1280px) 100vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/75 to-lime-900/40" />
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl animate-float" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
      </div>

      <div className="relative z-10 p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-base font-black text-white sm:text-lg">
              {greeting()}, {name}
            </p>
            {place ? (
              <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-emerald-100/80">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{place}</span>
              </p>
            ) : (
              <p className="mt-0.5 text-[10px] text-emerald-100/75">आज की खेती — एक नज़र</p>
            )}
          </div>
          <AppLink
            href="/weather"
            className="shrink-0 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Weather
          </AppLink>
        </div>

        {loading ? (
          <div className="mt-3 flex items-center gap-2 text-white/90">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">मौसम…</span>
          </div>
        ) : (
          <div className="mt-2.5 flex items-end justify-between gap-3">
            <div>
              <p className="text-3xl font-black tracking-tight text-white">{temp}</p>
              <p className="text-[11px] capitalize text-emerald-100/90">{condition}</p>
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {[
                { icon: Droplets, label: "Hum", value: humidity },
                { icon: Wind, label: "Wind", value: wind },
                { icon: CloudRain, label: "Rain", value: `${rainChance}%` },
                { icon: Sun, label: "UV", value: "Mod" },
              ].map(({ icon: Icon, label, value }, idx) => (
                <motion.div
                  key={label}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx, duration: MOTION.normal, ease: EASE_OUT }}
                  className="min-w-[58px] rounded-xl border border-white/15 bg-black/25 px-2 py-1.5 backdrop-blur-md"
                >
                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-emerald-100/70">
                    <Icon className="h-3 w-3" />
                    {label}
                  </div>
                  <p className="text-[11px] font-bold text-white">{value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <AppLink href="/weather" className="mt-2 inline-block text-[10px] font-semibold text-emerald-200">
            Location set करें → live weather
          </AppLink>
        )}
      </div>
    </motion.section>
  );
}
