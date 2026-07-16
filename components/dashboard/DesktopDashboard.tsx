"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Bug,
  Camera,
  ChevronRight,
  CloudRain,
  CloudSun,
  Droplets,
  FlaskConical,
  Leaf,
  MessageCircle,
  Plus,
  ShieldCheck,
  Sparkles,
  Wind,
  type LucideIcon,
} from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { useFarmData } from "@/hooks/useFarmData";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";

const HERO_IMAGE = "/images/premium/agriveda-scan-hero.webp";

const QUICK_ACTIONS: {
  label: string;
  sublabel: string;
  href: string;
  icon: LucideIcon;
  tint: string;
}[] = [
  {
    label: "Crop Guide",
    sublabel: "फसल गाइड",
    href: "/crops",
    icon: BookOpen,
    tint: "bg-lime-50 text-lime-700 dark:bg-lime-400/10 dark:text-lime-300",
  },
  {
    label: "Weather",
    sublabel: "मौसम",
    href: "/weather",
    icon: CloudSun,
    tint: "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300",
  },
  {
    label: "Spray Advisory",
    sublabel: "स्प्रे सलाह",
    href: "/weather/spray-advisory",
    icon: Droplets,
    tint: "bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300",
  },
  {
    label: "Fertilizer",
    sublabel: "खाद प्लानर",
    href: "/services/fertilizer-calculator",
    icon: FlaskConical,
    tint: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  },
  {
    label: "Pest & Disease",
    sublabel: "कीट व रोग",
    href: "/pest-diseases",
    icon: Bug,
    tint: "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
  },
  {
    label: "Community",
    sublabel: "किसान मंच",
    href: "/community",
    icon: MessageCircle,
    tint: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
];

function cropDays(sowingDate?: string) {
  if (!sowingDate) return 42;
  const planted = new Date(sowingDate).getTime();
  if (!Number.isFinite(planted)) return 42;
  const days = Math.floor((Date.now() - planted) / 86_400_000);
  return days > 0 && days < 366 ? days : 42;
}

function SectionTitle({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-[19px] font-bold leading-tight tracking-tight text-[var(--av-text-primary)]">
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">{subtitle}</p>}
      </div>
      {href && (
        <AppLink
          href={href}
          className="flex shrink-0 items-center gap-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300"
        >
          View all <ChevronRight className="h-3.5 w-3.5" />
        </AppLink>
      )}
    </div>
  );
}

export default function DesktopDashboard({ embedded: _embedded }: { embedded?: boolean } = {}) {
  const reduced = useReducedMotion();
  const { data: farm } = useFarmData();
  const { profile } = useFarmerProfile();
  const { weather, loading: weatherLoading } = useLiveWeather();

  const firstName = profile.name.trim().split(/\s+/)[0] || "Kisan";
  const primaryField = farm.fields[0];
  const cropName = primaryField?.crop?.split("(")[0].trim() || "Paddy";
  const cropStage = primaryField?.stage || "Tillering";
  const fieldName = primaryField?.name || "Main field";
  const day = cropDays(primaryField?.sowingDate);
  const cropImage = resolveCropImage({
    slug: primaryField?.cropSlug || "paddy",
    name: cropName,
  });

  const rainChance = weather?.hourlyForecast[0]?.rainChancePercent ?? 20;
  const humidity = weather?.humidity ?? "68%";
  const wind = weather?.windSpeed ?? "8 km/h";
  const temperature = weather?.temp ?? "29°C";
  const condition = weather?.condition ?? "Partly sunny";
  const humidityNumber = Number.parseInt(humidity, 10);
  const advice =
    rainChance >= 40
      ? "बारिश की संभावना है—आज स्प्रे रोकें और खेत में पानी की निकासी जाँच लें।"
      : humidityNumber >= 75
        ? "नमी अधिक है—सुबह पत्तियों के नीचे फफूंद के शुरुआती धब्बे जरूर देखें।"
        : "आज शाम मिट्टी की नमी जाँचें। ऊपर की 2–3 सेमी परत सूखी हो तभी हल्की सिंचाई करें।";

  return (
    <div className="relative mx-auto min-w-0 max-w-6xl space-y-5 pb-3 lg:space-y-7">
      <section className="flex items-end justify-between gap-4 px-0.5">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
            नमस्ते, {firstName} जी
          </p>
          <h1 className="mt-1 font-display text-[25px] font-bold leading-[1.12] tracking-tight text-[var(--av-text-primary)] sm:text-3xl">
            आज फसल के लिए क्या करें?
          </h1>
          <p className="mt-1 text-xs text-[var(--av-text-muted)]">Your farm plan for today, made simple.</p>
        </div>
        <AppLink
          href="/settings/upgrade"
          className="hidden shrink-0 items-center gap-2 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50 px-3 py-2 shadow-sm sm:flex dark:border-amber-400/20 dark:from-amber-400/10 dark:to-orange-400/5"
        >
          <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-300" />
          <span>
            <span className="block text-[9px] font-semibold uppercase tracking-wide text-amber-700/70 dark:text-amber-200/70">
              Kisan Rewards
            </span>
            <span className="block text-xs font-extrabold text-amber-900 dark:text-amber-100">320 points</span>
          </span>
        </AppLink>
      </section>

      <motion.section
        initial={reduced ? false : { opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: MOTION.slow, ease: EASE_OUT }}
        className="relative isolate min-h-[305px] overflow-hidden rounded-[30px] border border-emerald-900/10 bg-emerald-950 shadow-[0_24px_60px_-24px_rgba(5,80,50,0.75)] sm:min-h-[360px]"
      >
        <Image
          src={HERO_IMAGE}
          alt="Farmer scanning a paddy leaf with a phone"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1100px"
          className="object-cover object-center sm:object-[center_42%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#063b26]/95 via-[#063b26]/70 to-emerald-950/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041f16]/80 via-transparent to-black/5" />
        <div
          aria-hidden
          className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl"
        />

        <div className="relative z-10 flex min-h-[305px] max-w-[70%] flex-col justify-between p-5 sm:min-h-[360px] sm:max-w-[58%] sm:p-8 lg:max-w-[50%]">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-[10px] font-bold text-emerald-50 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-lime-300" />
              AI Crop Doctor
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/30 bg-amber-100/15 px-2.5 py-1 text-[10px] font-bold text-amber-50 backdrop-blur-md sm:hidden">
              <ShieldCheck className="h-3 w-3" />
              320 points
            </span>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-emerald-100">पत्ते पर दाग या कीट दिख रहा है?</p>
            <h2 className="max-w-md font-display text-[28px] font-bold leading-[1.05] tracking-[-0.02em] text-white sm:text-4xl">
              Scan the problem.
              <span className="block text-lime-200">Know what to do.</span>
            </h2>
            <p className="mt-2 max-w-sm text-[11px] leading-relaxed text-emerald-50/85 sm:text-sm">
              फोटो लें और पाएं आसान, भरोसेमंद सलाह — seconds में।
            </p>
            <AppLink
              href="/ai-doctor"
              className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-emerald-900 shadow-[0_12px_32px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5 hover:bg-emerald-50 active:scale-[0.98]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100">
                <Camera className="h-4 w-4" />
              </span>
              Scan Problem
              <ArrowRight className="h-4 w-4" />
            </AppLink>
          </div>
        </div>
      </motion.section>

      <section>
        <SectionTitle title="Quick Actions" subtitle="ज़रूरी सेवाएँ, बस एक टैप में" />
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6 sm:gap-3">
          {QUICK_ACTIONS.map(({ label, sublabel, href, icon: Icon, tint }, index) => (
            <motion.div
              key={href}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + index * 0.035, duration: MOTION.normal, ease: EASE_OUT }}
              whileTap={reduced ? undefined : { scale: 0.96 }}
            >
              <AppLink
                href={href}
                className="group flex min-h-[112px] flex-col items-center justify-center rounded-[22px] border border-emerald-950/[0.08] bg-white/90 px-2 py-3 text-center shadow-[0_8px_26px_-18px_rgba(5,80,50,0.7)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-emerald-500/25 hover:shadow-[0_14px_34px_-18px_rgba(5,120,75,0.5)] dark:border-white/10 dark:bg-white/[0.06]"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tint}`}>
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="mt-2 line-clamp-1 text-[11px] font-bold leading-tight text-[var(--av-text-primary)]">
                  {label}
                </span>
                <span className="mt-0.5 text-[9px] font-medium text-[var(--av-text-muted)]">{sublabel}</span>
              </AppLink>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[26px] border border-sky-900/[0.08] bg-gradient-to-br from-white via-sky-50/70 to-emerald-50/70 p-4 shadow-[0_18px_45px_-28px_rgba(14,116,144,0.45)] dark:border-white/10 dark:from-white/[0.08] dark:via-sky-400/[0.05] dark:to-emerald-400/[0.05] sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
                Weather Today
              </p>
              <div className="mt-2 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-sky-100 text-amber-600 dark:from-amber-400/15 dark:to-sky-400/10 dark:text-amber-300">
                  <CloudSun className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-3xl font-black tracking-tight text-[var(--av-text-primary)]">
                    {weatherLoading ? "—°" : temperature}
                  </p>
                  <p className="max-w-32 truncate text-[11px] capitalize text-[var(--av-text-muted)]">
                    {weatherLoading ? "मौसम देख रहे हैं…" : condition}
                  </p>
                </div>
              </div>
            </div>
            <AppLink
              href="/weather"
              className="rounded-xl border border-sky-200/80 bg-white/70 px-2.5 py-1.5 text-[10px] font-bold text-sky-700 dark:border-sky-300/15 dark:bg-white/5 dark:text-sky-300"
            >
              Full forecast
            </AppLink>
          </div>

          <div className="mt-4 grid grid-cols-3 divide-x divide-sky-900/10 rounded-2xl border border-sky-900/[0.06] bg-white/65 p-3 dark:divide-white/10 dark:border-white/10 dark:bg-black/10">
            {[
              { icon: Droplets, label: "Humidity", value: humidity },
              { icon: Wind, label: "Wind", value: wind },
              { icon: CloudRain, label: "Rain", value: `${rainChance}%` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="px-2 first:pl-0 last:pr-0">
                <Icon className="h-3.5 w-3.5 text-sky-600 dark:text-sky-300" />
                <p className="mt-1 text-[9px] text-[var(--av-text-muted)]">{label}</p>
                <p className="mt-0.5 truncate text-[11px] font-extrabold text-[var(--av-text-primary)]">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[26px] border border-emerald-900/[0.08] bg-white/90 shadow-[0_18px_45px_-28px_rgba(5,100,65,0.45)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.06]">
          <div className="flex items-center justify-between px-4 pt-4 sm:px-5 sm:pt-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                My Fields
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">फसल की आज की स्थिति</p>
            </div>
            <AppLink
              href="/my-farm"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/15 dark:bg-emerald-400/10 dark:text-emerald-300"
              aria-label={primaryField ? "View all fields" : "Add a field"}
            >
              {primaryField ? <ChevronRight className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </AppLink>
          </div>

          <AppLink href="/my-farm" className="mt-3 flex items-center gap-3 px-4 pb-4 sm:px-5 sm:pb-5">
            <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[20px] border border-emerald-100 bg-emerald-50 dark:border-white/10 dark:bg-emerald-400/10">
              <Image
                src={cropImage}
                alt={cropName}
                fill
                sizes="80px"
                className="object-cover"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-base font-extrabold text-[var(--av-text-primary)]">{cropName}</span>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                  Healthy
                </span>
              </span>
              <span className="mt-0.5 block truncate text-[10px] text-[var(--av-text-muted)]">{fieldName}</span>
              <span className="mt-3 grid grid-cols-2 gap-2">
                <span className="rounded-xl bg-[var(--av-surface-inset)] px-2.5 py-2">
                  <span className="block text-[9px] text-[var(--av-text-muted)]">Growth stage</span>
                  <span className="mt-0.5 block truncate text-[11px] font-bold text-[var(--av-text-primary)]">
                    {cropStage}
                  </span>
                </span>
                <span className="rounded-xl bg-[var(--av-surface-inset)] px-2.5 py-2">
                  <span className="block text-[9px] text-[var(--av-text-muted)]">Crop age</span>
                  <span className="mt-0.5 block text-[11px] font-bold text-[var(--av-text-primary)]">Day {day}</span>
                </span>
              </span>
            </span>
          </AppLink>
        </section>
      </div>

      <section>
        <SectionTitle title="Today’s Advice" subtitle="आज का सबसे जरूरी काम" href="/field-advisor" />
        <div className="relative overflow-hidden rounded-[26px] border border-amber-900/10 bg-gradient-to-br from-[#fffdf5] via-white to-emerald-50/70 p-4 shadow-[0_18px_50px_-32px_rgba(120,70,10,0.45)] dark:border-amber-200/10 dark:from-amber-200/[0.07] dark:via-white/[0.04] dark:to-emerald-400/[0.05] sm:p-5">
          <div
            aria-hidden
            className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-amber-200/25 blur-3xl dark:bg-amber-300/5"
          />
          <div className="relative flex gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-[0_8px_20px_-8px_rgba(5,100,65,0.8)]">
              <Leaf className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-amber-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-amber-800 dark:bg-amber-400/10 dark:text-amber-200">
                  Recommended today
                </span>
                <span className="text-[9px] font-semibold text-[var(--av-text-muted)]">• 10 min task</span>
              </div>
              <h3 className="mt-2 text-[15px] font-extrabold leading-snug text-[var(--av-text-primary)]">
                {cropName} की जल्दी जाँच करें
              </h3>
              <p className="mt-1 text-[12px] leading-[1.6] text-[var(--av-text-secondary)]">{advice}</p>
              <AppLink
                href="/field-advisor"
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300"
              >
                पूरी सलाह देखें <ArrowRight className="h-3.5 w-3.5" />
              </AppLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
