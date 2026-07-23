"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Camera,
  CloudRain,
  CloudSun,
  Droplets,
  Leaf,
  ListChecks,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Sprout,
  Stethoscope,
  Thermometer,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useFarmData } from "@/hooks/useFarmData";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { getCropHindiName } from "@/lib/crops/crop-display";
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

/** Simple, farmer-readable crop label: Hindi first, small English in ( ). */
function cropLabel(slug: string | undefined, englishName: string, isHi: boolean): string {
  const hi = getCropHindiName(slug ?? englishName.toLowerCase());
  if (isHi && hi) return `${hi} (${englishName})`;
  return englishName;
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

/** Today's risk chip — plain-language, from humidity + rain. */
function buildRisk(opts: { isHi: boolean; humidityPct: number; rainChance: number }): {
  label: string;
  tone: string;
} {
  const { isHi, humidityPct, rainChance } = opts;
  if (humidityPct >= 80 || rainChance >= 60) {
    return {
      label: isHi ? "रोग का ज़्यादा खतरा" : "High disease risk",
      tone: "border-rose-400/40 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300",
    };
  }
  if (humidityPct >= 65) {
    return {
      label: isHi ? "फफूंद का हल्का खतरा" : "Mild fungal risk",
      tone: "border-amber-400/40 bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300",
    };
  }
  return {
    label: isHi ? "आज खतरा कम" : "Low risk today",
    tone: "border-emerald-400/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
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

  return { crop, cropSlug, stage, name, days, img, key: `${name}-${index}` };
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
  const humidityPct = Number.parseInt(humidity, 10) || 58;

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
  const primaryCropLabel = cropLabel(primary.cropSlug, primary.crop, isHi);
  const advice = buildAdvice({
    isHi,
    rainChance,
    humidity,
    crop: primaryCropLabel,
    stage: primary.stage,
  });
  const risk = buildRisk({ isHi, humidityPct, rainChance });

  const steps = [
    {
      icon: Sprout,
      title: isHi ? "फसल चुनो" : "Choose crop",
      sub: isHi ? primaryCropLabel : primary.crop,
    },
    {
      icon: Camera,
      title: isHi ? "समस्या बताओ" : "Describe problem",
      sub: isHi ? "फोटो या लक्षण" : "Photo or symptoms",
    },
    {
      icon: Stethoscope,
      title: isHi ? "समाधान लो" : "Get solution",
      sub: isHi ? "तुरंत इलाज" : "Instant fix",
    },
  ];

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

      <div className="relative z-10 space-y-7 px-0.5 pt-1">
        {/* Welcome + personalization — bigger, clearer */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION.slow, ease: EASE_OUT }}
          className="px-0.5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-[var(--av-text-secondary)]">
                {isHi ? `नमस्ते, ${name} 🙏` : `Namaste, ${name} 🙏`}
              </p>
              <h1 className="mt-1 font-display text-[1.7rem] font-extrabold leading-tight tracking-tight text-[var(--av-text-primary)] sm:text-[1.9rem]">
                {isHi ? "आज खेत में क्या करें?" : "What should I do today?"}
              </h1>
            </div>
            <div className="shrink-0 rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-50 to-emerald-50 px-3 py-2 text-center shadow-[var(--av-shadow-sm)] dark:from-amber-950/40 dark:to-emerald-950/40">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <p className="mt-1 text-[11px] font-bold leading-tight text-emerald-800 dark:text-emerald-200">
                {isHi ? "विश्वसनीय" : "Trusted"}
              </p>
              <p className="text-[10px] font-semibold text-amber-800/80 dark:text-amber-200/80">
                50K+ kisan
              </p>
            </div>
          </div>

          {/* Personalization chips: crop + location + today's risk */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1.5 text-[13px] font-bold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
              <Sprout className="h-4 w-4" strokeWidth={2.25} />
              {isHi ? `आपकी फसल: ${primaryCropLabel}` : `Your crop: ${primary.crop}`}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-1.5 text-[13px] font-bold text-[var(--av-text-secondary)]">
              <MapPin className="h-4 w-4 text-sky-600" strokeWidth={2.25} />
              {place}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-bold ${risk.tone}`}
            >
              <ShieldCheck className="h-4 w-4" strokeWidth={2.25} />
              {isHi ? `आज: ${risk.label}` : `Today: ${risk.label}`}
            </span>
          </div>
        </motion.section>

        {/* MAIN FLOW — the one obvious first step: choose crop → problem → solution */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 16, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.04 }}
          className="overflow-hidden rounded-[26px] border border-emerald-500/25 bg-[var(--av-surface)] shadow-[var(--av-shadow-lg)]"
        >
          {/* Hero image */}
          <div className="relative min-h-[188px] sm:min-h-[220px]">
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f16]/92 via-[#0b1f16]/45 to-[#0b1f16]/10" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-emerald-200/90">
                {isHi ? "फसल का डॉक्टर" : "Your crop doctor"}
              </p>
              <h2 className="mt-1.5 max-w-[18ch] font-display text-[1.65rem] font-extrabold leading-tight text-white sm:text-[1.9rem]">
                {isHi ? "पत्ता दिखाओ — इलाज पाओ" : "Show the leaf — get the cure"}
              </h2>
            </div>
          </div>

          {/* 3 clear steps + one big CTA (on light surface for easy reading) */}
          <div className="p-4 sm:p-5">
            <p className="mb-3 text-center text-[15px] font-bold text-[var(--av-text-primary)]">
              {isHi ? "सिर्फ़ 3 आसान कदम" : "Just 3 easy steps"}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="relative rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-2 py-3 text-center"
                  >
                    <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-black text-white">
                      {i + 1}
                    </span>
                    <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-700 dark:text-emerald-300">
                      <Icon className="h-6 w-6" strokeWidth={2.1} />
                    </span>
                    <p className="mt-2 text-[13px] font-bold leading-tight text-[var(--av-text-primary)]">
                      {step.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-tight text-[var(--av-text-muted)]">
                      {step.sub}
                    </p>
                  </div>
                );
              })}
            </div>

            <AppLink
              href="/ai-doctor"
              className="mt-4 flex min-h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 text-[17px] font-extrabold text-white shadow-[0_12px_30px_rgba(5,150,105,0.42)] transition active:scale-[0.98]"
            >
              <Camera className="h-6 w-6" strokeWidth={2.25} />
              {isHi ? "अभी फोटो खींचें" : "Take a photo now"}
              <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
            </AppLink>
            <AppLink
              href="/crop-problem"
              className="mt-2.5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] px-5 text-[15px] font-bold text-[var(--av-text-secondary)] transition active:scale-[0.98]"
            >
              <ListChecks className="h-5 w-5 text-emerald-600" strokeWidth={2.25} />
              {isHi ? "फोटो नहीं? लक्षण से बताओ" : "No photo? Pick symptoms"}
            </AppLink>
          </div>
        </motion.section>

        {/* Quick Actions — bigger labels + spacing */}
        <section>
          <div className="mb-3 flex items-end justify-between px-0.5">
            <div>
              <h2 className="font-display text-lg font-bold text-[var(--av-text-primary)]">
                {isHi ? "और भी काम" : "More tools"}
              </h2>
              <p className="text-[13px] text-[var(--av-text-muted)]">
                {isHi ? "एक टैप में ज़रूरी सेवाएँ" : "Everyday farm tools — one tap"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
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
                    className="av-tool-press group flex flex-col items-center gap-2 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]/90 px-2 py-4 text-center shadow-[var(--av-shadow-sm)] backdrop-blur-sm transition hover:border-emerald-500/35"
                  >
                    <span
                      className={`relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${action.tone} ring-1 ring-emerald-600/10`}
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
                        <Icon className="h-6 w-6 text-emerald-700 dark:text-emerald-300" />
                      )}
                    </span>
                    <span className="line-clamp-2 text-[13px] font-bold leading-tight text-[var(--av-text-secondary)]">
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
            <div className="flex items-center justify-between border-b border-[var(--av-border-subtle)] bg-gradient-to-r from-sky-50/80 to-emerald-50/60 px-4 py-3.5 dark:from-sky-950/30 dark:to-emerald-950/20">
              <div>
                <h2 className="font-display text-lg font-bold text-[var(--av-text-primary)]">
                  {isHi ? "आज का मौसम" : "Weather Today"}
                </h2>
                <p className="text-[13px] text-[var(--av-text-muted)]">{place}</p>
              </div>
              <CloudSun className="h-9 w-9 text-sky-600/80 dark:text-sky-300" />
            </div>
            <div className="grid grid-cols-4 gap-2 px-3 py-4">
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
                  className="rounded-2xl bg-[var(--av-surface-inset)] px-2 py-3 text-center"
                >
                  <Icon className="mx-auto h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <p className="mt-1.5 text-[17px] font-bold tabular-nums text-[var(--av-text-primary)]">
                    {value}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-[var(--av-text-muted)]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
            <p className="flex items-center justify-between px-4 pb-3.5 text-[13px] font-medium capitalize text-[var(--av-text-secondary)]">
              <span>{condition}</span>
              <span className="inline-flex items-center gap-1 font-bold text-[var(--av-accent)]">
                {isHi ? "पूरा मौसम देखें" : "See full weather"}
                <ArrowRight className="h-4 w-4" />
              </span>
            </p>
          </AppLink>
        </motion.section>

        {/* My Fields — Hindi crop names */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: MOTION.slow, ease: EASE_OUT }}
        >
          <div className="mb-3 flex items-center justify-between px-0.5">
            <div>
              <h2 className="font-display text-lg font-bold text-[var(--av-text-primary)]">
                {isHi ? "मेरे खेत" : "My Fields"}
              </h2>
              <p className="text-[13px] text-[var(--av-text-muted)]">
                {isHi ? "फसल, स्टेज और दिन" : "Crop, growth stage & days"}
              </p>
            </div>
            <AppLink
              href="/my-farm"
              className="text-[13px] font-bold text-[var(--av-accent)]"
            >
              {isHi ? "सभी →" : "All →"}
            </AppLink>
          </div>
          <div className="space-y-3">
            {sourceFields.map((field, index) => {
              const card = fieldCard(field, index);
              return (
                <AppLink
                  key={card.key}
                  href="/my-farm"
                  className="flex items-center gap-3 rounded-[22px] border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-[var(--av-shadow-sm)] transition hover:border-emerald-500/35"
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
                    <p className="truncate text-[16px] font-bold text-[var(--av-text-primary)]">
                      {cropLabel(card.cropSlug, card.crop, isHi)}
                    </p>
                    <p className="truncate text-[13px] text-[var(--av-text-muted)]">{card.name}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[12px] font-bold text-emerald-700 dark:text-emerald-300">
                        {card.stage}
                      </span>
                      <span className="rounded-lg bg-[var(--av-surface-inset)] px-2 py-0.5 text-[12px] font-bold text-[var(--av-text-secondary)]">
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
                  <ArrowRight className="h-5 w-5 shrink-0 text-[var(--av-text-muted)]" />
                </AppLink>
              );
            })}
          </div>
        </motion.section>

        {/* Today's Advice — one practical recommendation with clear next step */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: MOTION.slow, ease: EASE_OUT }}
          className="rounded-[22px] border border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-white to-amber-50/60 p-5 shadow-[var(--av-shadow-md)] dark:from-emerald-950/40 dark:via-[var(--av-surface)] dark:to-amber-950/20"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-700/80 dark:text-emerald-300/80">
                {isHi ? "आज की सलाह" : "Today’s Advice"}
              </p>
              <h2 className="font-display text-[1.2rem] font-bold text-[var(--av-text-primary)]">
                {advice.title}
              </h2>
            </div>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--av-text-secondary)]">
            {advice.body}
          </p>
          <AppLink
            href={advice.href}
            className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-2.5 text-[15px] font-bold text-white transition hover:bg-emerald-800 active:scale-[0.98]"
          >
            {advice.cta}
            <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
          </AppLink>
        </motion.section>
      </div>
    </div>
  );
}
