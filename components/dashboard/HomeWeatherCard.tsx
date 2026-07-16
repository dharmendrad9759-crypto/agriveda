"use client";

import AppLink from "@/components/ui/AppLink";
import { CloudRain, Droplets, Loader2, Thermometer, Wind, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";

export default function HomeWeatherCard() {
  const { weather, loading } = useLiveWeather();
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const isHi = locale === "hi" || locale === "hinglish";

  const temp = weather?.temp ?? "32°C";
  const condition = weather?.condition ?? (isHi ? "धूप" : "Sunny");
  const humidity = weather?.humidity ?? "45%";
  const wind = weather?.windSpeed ?? "8 km/h";
  const rainChance = weather?.hourlyForecast[0]?.rainChancePercent ?? 10;

  const stats = [
    { icon: Thermometer, label: isHi ? "तापमान" : "Temp", value: temp },
    { icon: Droplets, label: isHi ? "नमी" : "Humidity", value: humidity },
    { icon: Wind, label: isHi ? "हवा" : "Wind", value: wind },
    { icon: CloudRain, label: isHi ? "बारिश" : "Rain", value: `${rainChance}%` },
  ];

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.slow, ease: EASE_OUT, delay: 0.06 }}
    >
      <AppLink
        href="/weather"
        className="av-tool-press block overflow-hidden rounded-[1.35rem] border border-emerald-500/15 bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-md)]"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-display text-base font-bold tracking-tight text-[var(--av-text-primary)]">
              {isHi ? "आज का मौसम" : "Weather Today"}
            </p>
            <p className="mt-0.5 text-[12px] capitalize text-[var(--av-text-muted)]">
              {loading ? (isHi ? "लोड हो रहा है…" : "Loading…") : condition}
            </p>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[var(--av-accent)]">
            {isHi ? "विस्तार" : "Details"}
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>

        {loading ? (
          <div className="mt-4 flex items-center gap-2 text-[var(--av-text-muted)]">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">{isHi ? "मौसम…" : "Weather…"}</span>
          </div>
        ) : (
          <div className="mt-3.5 grid grid-cols-4 gap-2">
            {stats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl bg-[var(--av-surface-inset)] px-1.5 py-2.5 text-center"
              >
                <Icon className="mx-auto h-4 w-4 text-[var(--av-accent)]" strokeWidth={2.2} />
                <p className="mt-1.5 text-[13px] font-bold leading-none text-[var(--av-text-primary)]">
                  {value}
                </p>
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-[var(--av-text-muted)]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}
      </AppLink>
    </motion.section>
  );
}
