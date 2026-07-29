"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { Droplets, Loader2, Sun, Wind, Thermometer, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import type { FarmerUiKey } from "@/lib/i18n/farmer-ui";

/** Local curated paddy photo — premium farm hero backdrop */
const HERO_BG = "/images/crops/paddy.png";

function greetingKey(): FarmerUiKey {
  const h = new Date().getHours();
  if (h < 12) return "homeGoodMorning";
  if (h < 17) return "homeGoodAfternoon";
  return "homeGoodEvening";
}

export default function DashboardWeatherHero() {
  const { t } = useLocale();
  const { weather, loading, error } = useLiveWeather();
  const { profile } = useFarmerProfile();
  const reduced = useReducedMotion();
  const name = profile.name.trim() || "Kisan";
  const place =
    weather?.location?.split(",")[0]?.trim() ||
    [profile.district, profile.state].filter(Boolean).join(", ");

  const tempNum = parseInt(weather?.temp ?? "32", 10) || 32;
  const condition = weather?.condition ?? "Sunny";
  const humidity = weather?.humidity ?? "22%";
  const wind = weather?.windSpeed ?? "8 km/h";
  const feels = weather?.feelsLike ?? `${tempNum + 2}°`;

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
      className="relative overflow-hidden rounded-[28px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.28)]"
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
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950/80 via-amber-950/45 to-sky-950/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
        {!reduced && (
          <>
            <motion.div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-300/25 blur-3xl"
              animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.08, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pointer-events-none absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-sky-400/20 blur-3xl"
              animate={{ opacity: [0.2, 0.45, 0.2] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </>
        )}
      </div>

      <div className="relative z-10 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
              Agriveda
            </p>
            <p className="mt-1 truncate font-display text-lg font-extrabold tracking-tight text-white sm:text-xl">
              {t(greetingKey())}, {name}
            </p>
            {place ? (
              <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-white/70">
                <MapPin className="h-3 w-3 shrink-0 text-amber-200" />
                <span className="truncate">{place}</span>
              </p>
            ) : null}
          </div>
          <AppLink
            href="/weather"
            className="shrink-0 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md transition hover:bg-white/22"
          >
            {t("homeWeatherFull")}
          </AppLink>
        </div>

        {loading ? (
          <div className="mt-4 flex items-center gap-2 text-white/90">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">{t("homeWeatherLoading")}</span>
          </div>
        ) : (
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-5xl font-semibold leading-none tracking-tight text-white">
                {tempNum}
                <span className="align-top text-2xl font-medium text-white/65">°</span>
              </p>
              <p className="mt-2 text-sm font-semibold capitalize text-amber-100/90">
                {condition}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {[
                { icon: Thermometer, label: t("homeFeel"), value: feels },
                { icon: Wind, label: t("homeWind"), value: wind },
                { icon: Droplets, label: t("homeHum"), value: humidity },
                { icon: Sun, label: t("homeUv"), value: "Mod" },
              ].map(({ icon: Icon, label, value }, idx) => (
                <motion.div
                  key={label}
                  initial={reduced ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * idx, duration: MOTION.normal, ease: EASE_OUT }}
                  className="flex items-center justify-end gap-2"
                >
                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-wide text-white/45">
                      {label}
                    </p>
                    <p className="text-[11px] font-bold text-white">{value}</p>
                  </div>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/25 backdrop-blur-md">
                    <Icon className="h-3 w-3 text-amber-200" />
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <AppLink href="/weather" className="mt-3 inline-block text-[10px] font-semibold text-amber-100">
            {t("homeWeatherSetLocation")}
          </AppLink>
        )}
      </div>
    </motion.section>
  );
}
