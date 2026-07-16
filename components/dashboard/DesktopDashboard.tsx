"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Bug,
  Camera,
  CloudRain,
  CloudSun,
  Droplets,
  FlaskConical,
  Leaf,
  ShieldCheck,
  Sparkles,
  Sprout,
  Trophy,
  Users,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useFarmData } from "@/hooks/useFarmData";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { EASE_OUT } from "@/lib/motion/variants";

const QUICK_ACTIONS: {
  label: string;
  labelHi: string;
  href: string;
  icon: LucideIcon;
  tone: string;
  iconTone: string;
}[] = [
  {
    label: "Crop Guide",
    labelHi: "फसल गाइड",
    href: "/crops",
    icon: BookOpen,
    tone: "bg-emerald-50 ring-emerald-100",
    iconTone: "text-emerald-700",
  },
  {
    label: "Weather",
    labelHi: "मौसम",
    href: "/weather",
    icon: CloudSun,
    tone: "bg-sky-50 ring-sky-100",
    iconTone: "text-sky-700",
  },
  {
    label: "Spray Advisory",
    labelHi: "स्प्रे सलाह",
    href: "/weather/spray-advisory",
    icon: Droplets,
    tone: "bg-cyan-50 ring-cyan-100",
    iconTone: "text-cyan-700",
  },
  {
    label: "Fertilizer",
    labelHi: "खाद प्लान",
    href: "/services/fertilizer-calculator",
    icon: FlaskConical,
    tone: "bg-amber-50 ring-amber-100",
    iconTone: "text-amber-700",
  },
  {
    label: "Pest & Disease",
    labelHi: "कीट व रोग",
    href: "/pest-diseases",
    icon: Bug,
    tone: "bg-rose-50 ring-rose-100",
    iconTone: "text-rose-700",
  },
  {
    label: "Community",
    labelHi: "किसान मंच",
    href: "/community",
    icon: Users,
    tone: "bg-violet-50 ring-violet-100",
    iconTone: "text-violet-700",
  },
];

function daysSince(date: string | undefined): number {
  if (!date) return 38;
  const timestamp = new Date(date).getTime();
  if (!Number.isFinite(timestamp)) return 38;
  return Math.max(1, Math.floor((Date.now() - timestamp) / 86_400_000));
}

function SectionTitle({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle: string;
  href?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-sans text-[17px] font-extrabold tracking-[-0.02em] text-[#163a2a] sm:text-lg">
          {title}
        </h2>
        <p className="mt-0.5 text-[11px] font-medium text-[#6f8679] sm:text-xs">{subtitle}</p>
      </div>
      {href && (
        <AppLink
          href={href}
          className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-[#167447] transition hover:text-[#0c5934]"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </AppLink>
      )}
    </div>
  );
}

export default function DesktopDashboard({ embedded: _embedded }: { embedded?: boolean } = {}) {
  const reduced = useReducedMotion();
  const { profile } = useFarmerProfile();
  const { data: farm } = useFarmData();
  const { weather, loading } = useLiveWeather();

  const firstName = profile.name.trim().split(/\s+/)[0] || "Kisan";
  const primaryField = farm.fields[0];
  const cropName = primaryField?.crop?.split("(")[0].trim() || "गेहूँ · HD-2967";
  const fieldName = primaryField?.name || "North Field";
  const stage = primaryField?.stage || "Tillering stage";
  const cropDay = daysSince(primaryField?.sowingDate);
  const health = primaryField?.health || 92;

  const temperature = weather?.temp ?? (loading ? "—" : "29°C");
  const humidity = weather?.humidity ?? "64%";
  const wind = weather?.windSpeed ?? "8 km/h";
  const rainChance = weather?.hourlyForecast[0]?.rainChancePercent ?? 10;
  const condition = weather?.condition ?? "Clear skies";
  const windSpeed = Number.parseInt(wind, 10) || 0;
  const avoidSpray = rainChance >= 35 || windSpeed > 15;
  const adviceTitle = avoidSpray ? "आज स्प्रे रोक दें" : "आज शाम सिंचाई करें";
  const adviceBody = avoidSpray
    ? `बारिश की संभावना ${rainChance}% और हवा ${wind} है। दवा का छिड़काव अगले सुरक्षित window में करें।`
    : "गेहूँ में नमी बनाए रखने के लिए शाम 5 बजे के बाद हल्की सिंचाई करें। खेत में पानी जमा न होने दें।";

  return (
    <div className="relative mx-auto min-w-0 max-w-[1180px] pb-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-28 top-20 h-64 w-64 rounded-full bg-[#dff1d8]/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-[520px] h-56 w-56 rounded-full bg-[#f2dfb5]/35 blur-3xl"
      />

      <div className="relative space-y-6 lg:space-y-7">
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          className="flex items-center justify-between gap-3 px-0.5"
        >
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#6b8175]">नमस्ते, {firstName} जी 👋</p>
            <h1 className="mt-0.5 truncate font-sans text-[22px] font-extrabold tracking-[-0.035em] text-[#133b29] sm:text-3xl">
              आज खेत में क्या करना है?
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-[#ead9ad] bg-gradient-to-br from-[#fffaf0] to-[#f7eed8] px-2.5 py-2 shadow-[0_5px_18px_rgba(134,100,31,0.10)] sm:px-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e9b94c] text-white shadow-sm">
              <Trophy className="h-4 w-4" strokeWidth={2.4} />
            </span>
            <span>
              <span className="block text-xs font-extrabold leading-none text-[#795719]">840</span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.08em] text-[#9a7a38]">
                Kisan Points
              </span>
            </span>
          </div>
        </motion.section>

        <motion.section
          initial={reduced ? false : { opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.04 }}
          className="group relative min-h-[320px] overflow-hidden rounded-[28px] bg-[#0b4d31] shadow-[0_22px_55px_-20px_rgba(10,73,45,0.62)] sm:min-h-[350px] lg:min-h-[370px]"
        >
          <Image
            src="/images/agriveda-ai-doctor-hero.png"
            alt="Farmer scanning a crop leaf with the AgriVeda AI Doctor"
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 1180px"
            className="object-cover object-[62%_center] transition duration-700 group-hover:scale-[1.015] sm:object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,48,30,0.97)_0%,rgba(7,62,38,0.88)_36%,rgba(8,67,40,0.35)_68%,rgba(6,52,33,0.08)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(3,40,25,0.32),transparent_45%)]" />
          <div className="absolute -left-12 -top-16 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -left-3 -top-24 h-64 w-64 rounded-full border border-white/[0.06]" />

          <div className="relative z-10 flex min-h-[320px] max-w-[72%] flex-col justify-center px-5 py-7 sm:min-h-[350px] sm:max-w-[62%] sm:px-9 lg:min-h-[370px] lg:max-w-[54%] lg:px-12">
            <div className="mb-4 flex w-fit items-center gap-1.5 rounded-full border border-lime-200/25 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-lime-100 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-lime-300" />
              AgriVeda AI Doctor
            </div>
            <h2 className="max-w-[540px] font-sans text-[27px] font-extrabold leading-[1.08] tracking-[-0.04em] text-white sm:text-4xl lg:text-[44px]">
              फसल की परेशानी,
              <br />
              <span className="text-[#c9ef88]">अब फोटो से पहचानें</span>
            </h2>
            <p className="mt-3 max-w-sm text-[12px] font-medium leading-relaxed text-emerald-50/85 sm:text-sm">
              पत्ती की फोटो लें — रोग, कारण और सही इलाज मिनटों में पाएं।
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <AppLink
                href="/ai-doctor"
                className="motion-tap inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#f5cf65] px-4 text-[13px] font-extrabold text-[#17412c] shadow-[0_12px_28px_rgba(4,35,21,0.28)] transition hover:bg-[#ffe18d] sm:px-5 sm:text-sm"
              >
                <Camera className="h-[18px] w-[18px]" strokeWidth={2.5} />
                Scan Problem
                <ArrowRight className="h-4 w-4" />
              </AppLink>
              <AppLink
                href="/kisan-saathi"
                className="hidden min-h-12 items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-4 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20 min-[370px]:inline-flex sm:text-sm"
              >
                Ask AI
              </AppLink>
            </div>

            <div className="mt-5 flex items-center gap-2 text-[10px] font-semibold text-emerald-50/75 sm:text-[11px]">
              <ShieldCheck className="h-4 w-4 text-[#bfe77d]" />
              सुरक्षित सलाह · 2 मिनट में जवाब
            </div>
          </div>

          <div className="absolute bottom-4 right-4 hidden items-center gap-2 rounded-2xl border border-white/20 bg-[#0b3526]/65 px-3 py-2 text-white shadow-lg backdrop-blur-md sm:flex">
            <BadgeCheck className="h-5 w-5 text-[#c9ef88]" />
            <div>
              <p className="text-[10px] font-extrabold">Expert verified</p>
              <p className="text-[9px] text-white/65">Trusted crop care</p>
            </div>
          </div>
        </motion.section>

        <section>
          <SectionTitle title="Quick Actions" subtitle="ज़रूरी काम, बस एक tap में" />
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:grid-cols-6">
            {QUICK_ACTIONS.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.06 + index * 0.035 }}
                  whileHover={reduced ? undefined : { y: -3 }}
                  whileTap={reduced ? undefined : { scale: 0.97 }}
                >
                  <AppLink
                    href={action.href}
                    className="group flex min-h-[112px] flex-col items-center justify-center rounded-[22px] border border-[#e3ece5] bg-white/95 px-1.5 py-3 text-center shadow-[0_8px_28px_-18px_rgba(21,74,46,0.45)] transition hover:border-[#b9d8c3] hover:shadow-[0_14px_32px_-18px_rgba(21,74,46,0.48)] sm:min-h-[120px]"
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 transition duration-300 group-hover:scale-105 sm:h-12 sm:w-12 ${action.tone}`}
                    >
                      <Icon className={`h-5 w-5 sm:h-[22px] sm:w-[22px] ${action.iconTone}`} strokeWidth={2.15} />
                    </span>
                    <span className="mt-2 text-[11px] font-extrabold leading-tight text-[#244437] sm:text-xs">
                      {action.labelHi}
                    </span>
                    <span className="mt-0.5 text-[9px] font-medium text-[#809087] sm:text-[10px]">
                      {action.label}
                    </span>
                  </AppLink>
                </motion.div>
              );
            })}
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <motion.section
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.14 }}
            className="relative overflow-hidden rounded-[26px] border border-[#dceae1] bg-white p-4 shadow-[0_15px_40px_-26px_rgba(23,73,47,0.4)] sm:p-5"
          >
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-sky-100/55 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-[#173a2b]">आज का मौसम</h2>
                <p className="mt-0.5 text-[11px] font-medium capitalize text-[#74877d]">{condition}</p>
              </div>
              <AppLink
                href="/weather"
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#edf7fa] text-[#27778a] ring-1 ring-[#d8ecf1]"
                aria-label="Open weather details"
              >
                <CloudSun className="h-5 w-5" />
              </AppLink>
            </div>

            <div className="relative mt-4 flex items-center gap-4">
              <div className="flex min-w-[106px] items-center gap-2 border-r border-[#e6eee8] pr-4">
                <span className="text-[42px] font-extrabold leading-none tracking-[-0.06em] text-[#163f2c]">
                  {temperature}
                </span>
              </div>
              <div className="grid flex-1 grid-cols-3 gap-1.5">
                {[
                  { icon: Droplets, label: "Humidity", value: humidity, color: "text-sky-600" },
                  { icon: Wind, label: "Wind", value: wind, color: "text-teal-600" },
                  { icon: CloudRain, label: "Rain", value: `${rainChance}%`, color: "text-indigo-600" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="rounded-2xl bg-[#f6f9f6] px-1.5 py-2.5 text-center">
                    <Icon className={`mx-auto h-4 w-4 ${color}`} />
                    <p className="mt-1.5 truncate text-[11px] font-extrabold text-[#29483a]">{value}</p>
                    <p className="mt-0.5 truncate text-[8px] font-semibold uppercase tracking-wide text-[#84948b]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-4 flex items-center gap-2 rounded-2xl bg-[#eef8ec] px-3 py-2.5 text-[11px] font-bold text-[#316039]">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#4b8d4e]" />
              {avoidSpray ? "आज spray के लिए मौसम सुरक्षित नहीं है" : "Spray window: सुबह 6–9 बजे तक बेहतर"}
            </div>
          </motion.section>

          <motion.section
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.18 }}
            className="relative overflow-hidden rounded-[26px] border border-[#dceae1] bg-white p-4 shadow-[0_15px_40px_-26px_rgba(23,73,47,0.4)] sm:p-5"
          >
            <div className="absolute -bottom-14 -right-10 h-40 w-40 rounded-full bg-[#f1e8cb]/65 blur-2xl" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#779083]">My Fields</p>
                <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.02em] text-[#173a2b]">{fieldName}</h2>
                <p className="mt-0.5 text-xs font-semibold text-[#647b6e]">{cropName}</p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#e7f3dc] to-[#f8f4dc] text-[#3e7c42] ring-1 ring-[#d6e8cb]">
                <Sprout className="h-6 w-6" strokeWidth={2.1} />
              </span>
            </div>

            <div className="relative mt-5 grid grid-cols-3 divide-x divide-[#e7eee9] rounded-2xl bg-[#f8faf7] px-1 py-3">
              <div className="px-2 text-center">
                <p className="text-sm font-extrabold text-[#224535]">{stage}</p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-[#89968f]">Growth stage</p>
              </div>
              <div className="px-2 text-center">
                <p className="text-sm font-extrabold text-[#224535]">Day {cropDay}</p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-[#89968f]">Since sowing</p>
              </div>
              <div className="px-2 text-center">
                <p className="text-sm font-extrabold text-[#358349]">{health}%</p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-[#89968f]">Crop health</p>
              </div>
            </div>

            <div className="relative mt-4">
              <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold">
                <span className="text-[#75887d]">Season progress</span>
                <span className="text-[#397847]">{Math.min(86, Math.max(20, cropDay))}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#e8eee9]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#59a85d] to-[#a6c959]"
                  style={{ width: `${Math.min(86, Math.max(20, cropDay))}%` }}
                />
              </div>
            </div>

            <AppLink
              href="/my-farm"
              className="relative mt-4 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#167447]"
            >
              खेत की पूरी जानकारी <ArrowRight className="h-3.5 w-3.5" />
            </AppLink>
          </motion.section>
        </div>

        <motion.section
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.22 }}
        >
          <SectionTitle title="आज की सलाह" subtitle="आपकी फसल और मौसम के अनुसार" />
          <div className="relative overflow-hidden rounded-[26px] border border-[#d9e7d7] bg-gradient-to-br from-[#eff8e9] via-[#f8fbf3] to-[#fbf4df] p-4 shadow-[0_14px_38px_-26px_rgba(51,91,43,0.42)] sm:flex sm:items-center sm:gap-5 sm:p-5">
            <div className="pointer-events-none absolute -bottom-16 right-10 h-40 w-40 rounded-full border-[24px] border-white/35" />
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-white text-[#4e8a48] shadow-[0_8px_22px_-12px_rgba(40,93,43,0.45)] ring-1 ring-[#dbe9d6]">
              <Leaf className="h-6 w-6" strokeWidth={2.1} />
            </span>
            <div className="relative mt-3 min-w-0 flex-1 sm:mt-0">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.11em] text-[#5d874c]">
                <Sparkles className="h-3.5 w-3.5" />
                Smart recommendation
              </div>
              <h3 className="mt-1.5 text-[17px] font-extrabold tracking-[-0.02em] text-[#244531]">{adviceTitle}</h3>
              <p className="mt-1 max-w-2xl text-[12px] font-medium leading-relaxed text-[#5f7566] sm:text-[13px]">
                {adviceBody}
              </p>
            </div>
            <AppLink
              href={avoidSpray ? "/weather/spray-advisory" : "/field-advisor"}
              className="relative mt-4 inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-[#246b43] px-4 text-xs font-extrabold text-white shadow-[0_10px_24px_-12px_rgba(26,91,53,0.65)] transition hover:bg-[#185b36] sm:mt-0"
            >
              पूरी सलाह देखें <ArrowRight className="h-3.5 w-3.5" />
            </AppLink>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
