"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  CloudRain,
  CloudSun,
  Droplets,
  Leaf,
  MessageCircle,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Sprout,
  Thermometer,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useFarmData } from "@/hooks/useFarmData";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { DASHBOARD_FIELDS } from "@/data/mock/dashboard";
import type { FarmField } from "@/lib/farm/types";

const HERO_IMG = "/images/home/agriveda-hero-scan.jpg";
/** Stable calendar anchor for DAS labels (avoids impure Date.now in render). */
const HOME_DAY_ANCHOR_MS = Date.parse("2026-07-16T12:00:00Z");

const QUICK_ACTIONS: {
  label: string;
  labelHi: string;
  href: string;
  icon: LucideIcon;
  imageSrc?: string;
  tone: string;
}[] = [
  {
    label: "Crop Guide",
    labelHi: "फसल गाइड",
    href: "/crops",
    icon: BookOpen,
    imageSrc: "/images/icons/tools/crop-planner.png",
    tone: "from-emerald-500/15 to-teal-500/10",
  },
  {
    label: "Weather",
    labelHi: "मौसम",
    href: "/weather",
    icon: CloudSun,
    imageSrc: "/images/icons/tools/weather.png",
    tone: "from-sky-500/15 to-cyan-500/10",
  },
  {
    label: "Spray Advisory",
    labelHi: "स्प्रे सलाह",
    href: "/weather/spray-advisory",
    icon: Droplets,
    imageSrc: "/images/icons/tools/spray-advisory.png",
    tone: "from-lime-500/15 to-emerald-500/10",
  },
  {
    label: "Fertilizer Planner",
    labelHi: "खाद योजना",
    href: "/services/fertilizer-calculator",
    icon: Sprout,
    imageSrc: "/images/icons/tools/fertilizer.png",
    tone: "from-amber-500/15 to-yellow-500/10",
  },
  {
    label: "Pest & Disease",
    labelHi: "कीट-रोग",
    href: "/pest-diseases",
    icon: Leaf,
    imageSrc: "/images/icons/tools/pest-scanner.png",
    tone: "from-rose-500/12 to-orange-500/10",
  },
  {
    label: "Ask Community",
    labelHi: "समुदाय",
    href: "/community",
    icon: MessageCircle,
    imageSrc: "/images/icons/tools/advisor.png",
    tone: "from-teal-500/15 to-emerald-500/10",
  },
];

function daysSince(dateStr: string): number | null {
  if (!dateStr) return null;
  const d = Date.parse(dateStr);
  if (Number.isNaN(d)) return null;
  const diff = Math.floor((HOME_DAY_ANCHOR_MS - d) / 86_400_000);
  return diff >= 0 ? diff : null;
}

function buildAdvice(opts: {
  isHi: boolean;
  rainChance: number;
  humidity: string;
  crop: string;
  stage: string;
}): { title: string; body: string; href: string; cta: string } {
  const { isHi, rainChance, crop, stage } = opts;
  if (rainChance >= 55) {
    return {
      title: isHi ? "आज स्प्रे न करें" : "Skip spray today",
      body: isHi
        ? `बारिश की संभावना ${rainChance}% है। ${crop} पर स्प्रे टालें — शाम के बाद मौसम फिर चेक करें।`
        : `${rainChance}% rain chance. Hold spray on ${crop} and recheck weather this evening.`,
      href: "/weather/spray-advisory",
      cta: isHi ? "स्प्रे सलाह देखें" : "Open spray advisory",
    };
  }
  return {
    title: isHi ? "आज का एक काम" : "One job for today",
    body: isHi
      ? `${crop} (${stage}) — पत्तों को ध्यान से देखें। पीले धब्बे या कीड़े दिखें तो AI Doctor से स्कैन करें।`
      : `${crop} is in ${stage}. Check leaves closely — scan with AI Doctor if you spot spots or pests.`,
    href: "/ai-doctor",
    cta: isHi ? "अभी स्कैन करें" : "Scan now",
  };
}

function fieldCard(field: FarmField | (typeof DASHBOARD_FIELDS)[number], index: number) {
  const crop = "crop" in field ? field.crop : "Paddy";
  const stage = "stage" in field ? field.stage : "Tillering";
  const name = "name" in field ? field.name : "Main Farm";
  const sowingDate = "sowingDate" in field ? field.sowingDate : "";
  const cropSlug = "cropSlug" in field ? field.cropSlug : undefined;
  const days = daysSince(sowingDate);
  const img = resolveCropImage({ slug: cropSlug || crop.toLowerCase(), name: crop });

  return { crop, stage, name, days, img, key: `${name}-${index}` };
}

export default function AgriVedaHome() {
  const { locale } = useLocale();
  const isHi = locale === "hi" || locale === "hinglish";
  const reduced = useReducedMotion();
  const { profile } = useFarmerProfile();
  const { weather, loading: weatherLoading } = useLiveWeather();
  const { data: farm } = useFarmData();

  const name = profile.name.trim() || (isHi ? "किसान भाई" : "Kisan");
  const place =
    [profile.village || profile.district, profile.state].filter(Boolean).join(", ") ||
    "Sehore, MP";

  const temp = weather?.temp ?? "32°C";
  const humidity = weather?.humidity ?? "58%";
  const wind = weather?.windSpeed ?? "8 km/h";
  const rainChance = weather?.hourlyForecast[0]?.rainChancePercent ?? 20;
  const condition = weather?.condition ?? (isHi ? "साफ़ आसमान" : "Clear skies");

  const sourceFields =
    farm.fields.length > 0
      ? farm.fields.slice(0, 2)
      : DASHBOARD_FIELDS.slice(0, 2).map((f, i) => ({
          id: `demo-${i}`,
          name: f.name,
          area: f.area,
          ownership: "Own",
          crop: f.crop,
          cropSlug: f.crop.toLowerCase(),
          status: f.status,
          // Stable demo sowing anchors (avoid Date.now in render)
          sowingDate: f.crop === "Paddy" ? "2026-06-18" : "2026-05-30",
          emoji: "🌾",
          health: f.health,
          stage: f.stage,
        }));

  const primary = fieldCard(sourceFields[0], 0);
  const advice = buildAdvice({
    isHi,
    rainChance,
    humidity,
    crop: primary.crop,
    stage: primary.stage,
  });

  return (
    <div className="relative mx-auto min-w-0 max-w-lg overflow-x-hidden pb-2">
      {/* Soft earthy atmosphere — not a flat wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-20px] top-0 h-[420px] overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(16,185,129,0.18),transparent_55%),radial-gradient(ellipse_at_90%_10%,rgba(180,140,70,0.12),transparent_45%),linear-gradient(180deg,#e8f6ee_0%,transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23065f46' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative z-10 space-y-5 px-0.5 pt-1">
        {/* Welcome + trust — answers “what should I do today?” framing */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION.slow, ease: EASE_OUT }}
          className="flex items-start justify-between gap-3 px-0.5"
        >
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[var(--av-text-secondary)]">
              {isHi ? `नमस्ते, ${name}` : `Namaste, ${name}`}
            </p>
            <h1 className="mt-0.5 font-display text-[1.45rem] font-extrabold leading-snug tracking-tight text-[var(--av-text-primary)] sm:text-[1.65rem]">
              {isHi ? "आज फसल के लिए क्या करें?" : "What should I do for my crop today?"}
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--av-text-muted)]">
              {isHi
                ? "Agriveda आपका स्मार्ट खेत साथी — एक टैप में सही सलाह।"
                : "Agriveda is your smart farm saathi — clear advice in one tap."}
            </p>
          </div>
          <div className="shrink-0 rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-50 to-emerald-50 px-2.5 py-2 text-center shadow-[var(--av-shadow-sm)] dark:from-amber-950/40 dark:to-emerald-950/40">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="h-4 w-4" strokeWidth={2.25} />
            </div>
            <p className="mt-1 text-[10px] font-bold leading-tight text-emerald-800 dark:text-emerald-200">
              {isHi ? "विश्वसनीय" : "Trusted"}
            </p>
            <p className="text-[9px] font-semibold text-amber-800/80 dark:text-amber-200/80">
              50K+ kisan
            </p>
          </div>
        </motion.section>

        {/* Hero — full-bleed visual plane + one CTA */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 16, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.04 }}
          className="relative -mx-3 overflow-hidden sm:-mx-4"
        >
          <div className="relative min-h-[240px] sm:min-h-[280px]">
            <Image
              src={HERO_IMG}
              alt={
                isHi
                  ? "किसान फसल की पत्ती को फोन से स्कैन कर रहे हैं"
                  : "Farmer scanning a crop leaf with a phone for disease detection"
              }
              fill
              priority
              sizes="(max-width: 512px) 100vw, 512px"
              className="object-cover object-[center_28%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f16]/92 via-[#0b1f16]/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200/90">
                AgriVeda
              </p>
              <h2 className="mt-1 max-w-[16ch] font-display text-2xl font-extrabold leading-tight text-white sm:text-[1.75rem]">
                {isHi ? "पत्ता स्कैन करें — तुरंत इलाज" : "Scan the leaf — get help now"}
              </h2>
              <p className="mt-1.5 max-w-[28ch] text-[13px] leading-snug text-emerald-50/90">
                {isHi
                  ? "कीट या रोग दिखे तो AI Doctor से पूछें।"
                  : "See spots or pests? Ask AI Doctor in seconds."}
              </p>
              <AppLink
                href="/ai-doctor"
                className="mt-3.5 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-[15px] font-bold text-white shadow-[0_10px_28px_rgba(5,150,105,0.45)] transition active:scale-[0.98]"
              >
                <ScanLine className="h-5 w-5" strokeWidth={2.25} />
                {isHi ? "समस्या स्कैन करें" : "Scan Problem"}
              </AppLink>
            </div>
          </div>
        </motion.section>

        {/* Quick Actions — 6 simple icons */}
        <section>
          <div className="mb-2.5 flex items-end justify-between px-0.5">
            <div>
              <h2 className="font-display text-base font-bold text-[var(--av-text-primary)]">
                {isHi ? "त्वरित सेवाएँ" : "Quick Actions"}
              </h2>
              <p className="text-[12px] text-[var(--av-text-muted)]">
                {isHi ? "ज़रूरी काम — एक टैप" : "Everyday farm tools — one tap"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {QUICK_ACTIONS.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.href}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.04, duration: MOTION.normal, ease: EASE_OUT }}
                >
                  <AppLink
                    href={action.href}
                    className="av-tool-press group flex flex-col items-center gap-1.5 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]/90 px-2 py-3 text-center shadow-[var(--av-shadow-sm)] backdrop-blur-sm transition hover:border-emerald-500/35"
                  >
                    <span
                      className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${action.tone} ring-1 ring-emerald-600/10`}
                    >
                      {action.imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={action.imageSrc}
                          alt=""
                          className="h-full w-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        <Icon className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                      )}
                    </span>
                    <span className="line-clamp-2 text-[11px] font-bold leading-tight text-[var(--av-text-secondary)]">
                      {isHi ? action.labelHi : action.label}
                    </span>
                  </AppLink>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Weather Today */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: MOTION.slow, ease: EASE_OUT }}
        >
          <AppLink
            href="/weather"
            className="block overflow-hidden rounded-[22px] border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-md)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--av-border-subtle)] bg-gradient-to-r from-sky-50/80 to-emerald-50/60 px-4 py-3 dark:from-sky-950/30 dark:to-emerald-950/20">
              <div>
                <h2 className="font-display text-base font-bold text-[var(--av-text-primary)]">
                  {isHi ? "आज का मौसम" : "Weather Today"}
                </h2>
                <p className="text-[12px] text-[var(--av-text-muted)]">{place}</p>
              </div>
              <CloudSun className="h-8 w-8 text-sky-600/80 dark:text-sky-300" />
            </div>
            <div className="grid grid-cols-4 gap-2 px-3 py-3.5">
              {[
                {
                  icon: Thermometer,
                  label: isHi ? "तापमान" : "Temp",
                  value: weatherLoading ? "…" : temp,
                },
                {
                  icon: Droplets,
                  label: isHi ? "नमी" : "Humidity",
                  value: weatherLoading ? "…" : humidity,
                },
                {
                  icon: Wind,
                  label: isHi ? "हवा" : "Wind",
                  value: weatherLoading ? "…" : wind,
                },
                {
                  icon: CloudRain,
                  label: isHi ? "बारिश" : "Rain",
                  value: weatherLoading ? "…" : `${rainChance}%`,
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl bg-[var(--av-surface-inset)] px-2 py-2.5 text-center"
                >
                  <Icon className="mx-auto h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <p className="mt-1.5 text-[15px] font-bold tabular-nums text-[var(--av-text-primary)]">
                    {value}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold text-[var(--av-text-muted)]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
            <p className="px-4 pb-3 text-[12px] font-medium capitalize text-[var(--av-text-secondary)]">
              {condition}
            </p>
          </AppLink>
        </motion.section>

        {/* My Fields */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: MOTION.slow, ease: EASE_OUT }}
        >
          <div className="mb-2.5 flex items-center justify-between px-0.5">
            <div>
              <h2 className="font-display text-base font-bold text-[var(--av-text-primary)]">
                {isHi ? "मेरे खेत" : "My Fields"}
              </h2>
              <p className="text-[12px] text-[var(--av-text-muted)]">
                {isHi ? "फसल, स्टेज और दिन" : "Crop, growth stage & days"}
              </p>
            </div>
            <AppLink
              href="/my-farm"
              className="text-[12px] font-bold text-[var(--av-accent)]"
            >
              {isHi ? "सभी →" : "All →"}
            </AppLink>
          </div>
          <div className="space-y-2.5">
            {sourceFields.map((field, index) => {
              const card = fieldCard(field, index);
              return (
                <AppLink
                  key={card.key}
                  href="/my-farm"
                  className="flex items-center gap-3 rounded-[22px] border border-[var(--av-border)] bg-[var(--av-surface)] p-3 shadow-[var(--av-shadow-sm)] transition hover:border-emerald-500/35"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[var(--av-surface-inset)]">
                    <Image
                      src={card.img}
                      alt={card.crop}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-bold text-[var(--av-text-primary)]">
                      {card.crop}
                    </p>
                    <p className="truncate text-[12px] text-[var(--av-text-muted)]">{card.name}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                        {card.stage}
                      </span>
                      <span className="rounded-lg bg-[var(--av-surface-inset)] px-2 py-0.5 text-[11px] font-bold text-[var(--av-text-secondary)]">
                        {card.days != null
                          ? isHi
                            ? `${card.days} दिन`
                            : `Day ${card.days}`
                          : isHi
                            ? "दिन जोड़ें"
                            : "Add sowing date"}
                      </span>
                    </div>
                  </div>
                </AppLink>
              );
            })}
          </div>
        </motion.section>

        {/* Today's Advice — one practical recommendation */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: MOTION.slow, ease: EASE_OUT }}
          className="rounded-[22px] border border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-white to-amber-50/60 p-4 shadow-[var(--av-shadow-md)] dark:from-emerald-950/40 dark:via-[var(--av-surface)] dark:to-amber-950/20"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700/80 dark:text-emerald-300/80">
                {isHi ? "आज की सलाह" : "Today’s Advice"}
              </p>
              <h2 className="font-display text-[1.05rem] font-bold text-[var(--av-text-primary)]">
                {advice.title}
              </h2>
            </div>
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--av-text-secondary)]">
            {advice.body}
          </p>
          <AppLink
            href={advice.href}
            className="mt-3.5 inline-flex min-h-11 items-center rounded-2xl bg-emerald-700 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-emerald-800 active:scale-[0.98]"
          >
            {advice.cta}
          </AppLink>
        </motion.section>
      </div>
    </div>
  );
}
