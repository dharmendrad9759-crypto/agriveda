"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { Droplets, Loader2, Sun, Wind, CloudRain, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";

/** Local curated paddy photo — premium farm hero backdrop */
const HERO_BG = "/images/crops/paddy.png";

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
      initial={reduced ? false : { opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
      className="relative overflow-hidden rounded-[28px] border border-emerald-400/30 shadow-[0_16px_48px_rgba(0,80,40,0.22)]"
    >
      <div className="absolute inset-0">
        <Image
          src={HERO_BG}
          alt="Paddy field"
          fill
          className="object-cover object-center scale-110"
          priority
          sizes="(max-width: 1280px) 100vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/75 via-emerald-900/45 to-amber-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-emerald-950/20" />
        {!reduced && (
          <>
            <motion.div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-300/30 blur-3xl"
              animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.08, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pointer-events-none absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-emerald-400/25 blur-3xl"
              animate={{ opacity: [0.2, 0.45, 0.2] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </>
        )}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-300/55 to-transparent" />
      </div>

      <div className="relative z-10 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-200/80">
              Agriveda Farm OS
            </p>
            <p className="mt-1 truncate font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              {greeting()}, {name}
            </p>
            {place ? (
              <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-100/85">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{place}</span>
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-emerald-100/80">आज की खेती — smart nazar</p>
            )}
          </div>
          <AppLink
            href="/weather"
            className="av-neon-ring relative shrink-0 rounded-full border border-white/25 bg-white/12 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md transition hover:bg-white/22"
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
