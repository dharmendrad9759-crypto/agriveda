"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  CloudRain,
  CloudSun,
  CreditCard,
  Leaf,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useFarmData } from "@/hooks/useFarmData";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { useAIHistory } from "@/hooks/useAIHistory";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { cropCatalog } from "@/data/crop-catalog";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import type { FarmField } from "@/lib/farm/types";
import { track } from "@/lib/analytics";
import { useState } from "react";
import { cn } from "@/lib/cn";
import WeatherSkyFX, {
  detectWeatherFxMode,
  weatherSkyInk,
  weatherSkyPhoto,
} from "@/components/weather/WeatherSkyFX";

const HOME_DAY_ANCHOR_MS = Date.parse("2026-07-16T12:00:00Z");

const QUICK_JOBS: {
  id: string;
  hi: string;
  en: string;
  hintHi: string;
  hintEn: string;
  href: string;
  icon: LucideIcon;
  imageSrc: string;
}[] = [
  {
    id: "photo",
    hi: "पत्ती की फोटो लो",
    en: "Take leaf photo",
    hintHi: "बीमारी बताएगा",
    hintEn: "Finds the disease",
    href: "/ai-doctor",
    icon: Camera,
    imageSrc: "/images/home/home-job-photo.jpg",
  },
  {
    id: "leaf",
    hi: "पत्ती पीली / खराब",
    en: "Yellow / sick leaf",
    hintHi: "पोषक कमी देखो",
    hintEn: "Check nutrient lack",
    href: "/deficiencies",
    icon: Leaf,
    imageSrc: "/images/home/home-job-yellow-leaf.jpg",
  },
  {
    id: "mandi",
    hi: "आज का भाव",
    en: "Today's price",
    hintHi: "मंडी रेट",
    hintEn: "Mandi rates",
    href: "/mandi",
    icon: TrendingUp,
    imageSrc: "/images/home/home-job-mandi.jpg",
  },
  {
    id: "weather",
    hi: "मौसम / स्प्रे",
    en: "Weather / spray",
    hintHi: "बारिश देखो",
    hintEn: "Check rain",
    href: "/weather",
    icon: CloudSun,
    imageSrc: "/images/home/home-job-weather.jpg",
  },
  {
    id: "schemes",
    hi: "योजना / KCC",
    en: "Schemes / KCC",
    hintHi: "लोन · सब्सिडी",
    hintEn: "Loan · subsidy",
    href: "/schemes",
    icon: CreditCard,
    imageSrc: "/images/home/home-job-plan.jpg",
  },
];

const MORE_JOBS: {
  id: string;
  hi: string;
  en: string;
  hintHi: string;
  hintEn: string;
  href: string;
  imageSrc: string;
}[] = [
  {
    id: "farm",
    hi: "मेरा खेत",
    en: "My farm",
    hintHi: "खेत जोड़ो / देखो",
    hintEn: "Add or see fields",
    href: "/my-farm",
    imageSrc: "/images/jobs/job-my-farm.jpg",
  },
  {
    id: "pest",
    hi: "कीट और रोग",
    en: "Pests & disease",
    hintHi: "पत्ती / कीट टैप करो",
    hintEn: "Tap leaf or pest",
    href: "/pest-diseases",
    imageSrc: "/images/threats/threat-insect.jpg",
  },
  {
    id: "disease",
    hi: "बीमारी पहचानो",
    en: "Spot the disease",
    hintHi: "लक्षण से समाधान",
    hintEn: "Solve by symptoms",
    href: "/pest-solver",
    imageSrc: "/images/threats/threat-disease.jpg",
  },
  {
    id: "weeds",
    hi: "खरपतवार",
    en: "Weeds",
    hintHi: "घास देखो",
    hintEn: "See weeds",
    href: "/pest-diseases?type=weed",
    imageSrc: "/images/threats/threat-weed.jpg",
  },
  {
    id: "fert",
    hi: "खाद कितनी?",
    en: "How much fertilizer?",
    hintHi: "बोरी में हिसाब",
    hintEn: "Bag doses",
    href: "/services/fertilizer-calculator",
    imageSrc: "/images/jobs/job-fertilizer.jpg",
  },
  {
    id: "spray",
    hi: "आज स्प्रे?",
    en: "Spray today?",
    hintHi: "करें या नहीं",
    hintEn: "Yes or no",
    href: "/weather/spray-advisory",
    imageSrc: "/images/jobs/job-spray.jpg",
  },
  {
    id: "plan",
    hi: "फसल योजना",
    en: "Crop plan",
    hintHi: "कब क्या करूँ",
    hintEn: "What to do when",
    href: "/crop-calendar",
    imageSrc: "/images/home/home-job-plan.jpg",
  },
  {
    id: "advisor",
    hi: "खेत सलाह",
    en: "Field advice",
    hintHi: "आज की मदद",
    hintEn: "Help for today",
    href: "/field-advisor",
    imageSrc: "/images/home/home-job-advisor.jpg",
  },
  {
    id: "ask",
    hi: "विशेषज्ञ से पूछो",
    en: "Ask an expert",
    hintHi: "फोटो + सवाल",
    hintEn: "Photo + question",
    href: "/ask-query",
    imageSrc: "/images/home/ask-expert-trust.jpg",
  },
  {
    id: "alerts",
    hi: "खेत अलर्ट",
    en: "Farm alerts",
    hintHi: "पहले से सावधान",
    hintEn: "Stay ahead",
    href: "/alerts",
    imageSrc: "/images/jobs/job-alerts.jpg",
  },
  {
    id: "crops",
    hi: "फसल गाइड",
    en: "Crop guide",
    hintHi: "फसल टैप करो",
    hintEn: "Tap a crop",
    href: "/crops",
    imageSrc: "/images/home/home-job-guide.jpg",
  },
  {
    id: "nutrients",
    hi: "पत्ती की कमी",
    en: "Leaf deficiency",
    hintHi: "पोषक देखो",
    hintEn: "Check nutrients",
    href: "/deficiencies",
    imageSrc: "/images/home/home-job-yellow-leaf.jpg",
  },
];

const MORE_JOBS_FIRST = 6;


function daysSince(dateStr: string): number | null {
  if (!dateStr) return null;
  const d = Date.parse(dateStr);
  if (Number.isNaN(d)) return null;
  const diff = Math.floor((HOME_DAY_ANCHOR_MS - d) / 86_400_000);
  return diff >= 0 ? diff : null;
}

function cropChipLabel(slug: string | undefined, englishName: string): string {
  const key = (slug || "").trim().toLowerCase();
  return (
    getCropHindiName(key) ||
    cropCatalog.find((c) => c.slug === key)?.name ||
    englishName
  );
}

function cropLabel(slug: string | undefined, englishName: string): string {
  const key = (slug || "").trim().toLowerCase();
  const catalog = key ? cropCatalog.find((c) => c.slug === key) : undefined;
  const hi = getCropHindiName(key) ?? getCropHindiName(englishName.toLowerCase());
  const en =
    catalog?.name ||
    (englishName && !key
      ? englishName
      : key
        ? key.charAt(0).toUpperCase() + key.slice(1)
        : englishName);
  return hi ? `${hi} (${en})` : en;
}

function conditionHi(condition: string, isHi: boolean): string {
  if (!isHi || condition === "…" || condition === "—") return condition;
  if (/rain|drizzle|shower|बारिश/i.test(condition)) return "बारिश";
  if (/cloud|बादल|overcast/i.test(condition)) return "बादल";
  if (/clear|sunny|साफ/i.test(condition)) return "साफ आसमान";
  if (/storm|thunder|तूफान/i.test(condition)) return "तूफान";
  if (/fog|mist|धुंध|कोहरा/i.test(condition)) return "धुंध";
  return condition;
}

function buildAdvice(opts: {
  isHi: boolean;
  rainChance: number;
  crop: string;
  stage: string;
}): { title: string; body: string; href: string; cta: string } {
  const { isHi, rainChance, crop, stage } = opts;
  if (rainChance >= 55) {
    return {
      title: isHi ? "आज स्प्रे मत करो" : "Skip spray today",
      body: isHi
        ? `बारिश ${rainChance}% — स्प्रे बाद में`
        : `${rainChance}% rain — spray later`,
      href: "/weather/spray-advisory",
      cta: isHi ? "स्प्रे सलाह" : "Spray advice",
    };
  }
  return {
    title: isHi ? "आज का एक काम" : "One job today",
    body: isHi
      ? `${crop} (${stage}) — पत्ती देखो, शक हो तो फोटो लो`
      : `${crop} (${stage}) — check leaves, photo if unsure`,
    href: "/ai-doctor",
    cta: isHi ? "फोटो लो" : "Take photo",
  };
}

function buildRisk(opts: {
  isHi: boolean;
  humidityPct: number;
  rainChance: number;
}): { label: string; tone: string } {
  const { isHi, humidityPct, rainChance } = opts;
  if (humidityPct >= 80 || rainChance >= 60) {
    return {
      label: isHi ? "रोग खतरा ↑" : "Disease risk ↑",
      tone: "border-rose-400/40 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300",
    };
  }
  if (humidityPct >= 65) {
    return {
      label: isHi ? "नमी ज्यादा" : "High humidity",
      tone: "border-amber-400/40 bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300",
    };
  }
  return {
    label: isHi ? "खतरा कम" : "Low risk",
    tone: "border-emerald-400/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  };
}

function fieldCard(field: FarmField, index: number) {
  const crop = field.crop;
  const stage = field.stage;
  const name = field.name;
  const sowingDate = field.sowingDate;
  const cropSlug = field.cropSlug;
  const days = daysSince(sowingDate);
  const img = resolveCropImage({ slug: cropSlug || crop.toLowerCase(), name: crop });
  return { crop, cropSlug, stage, name, days, img, key: `${name}-${index}` };
}

export default function AgriVedaHome() {
  const { locale } = useLocale();
  const isHi = locale === "hi";
  const reduced = useReducedMotion();
  const { profile } = useFarmerProfile();
  const { weather, loading: weatherLoading, error: weatherError } = useLiveWeather();
  const { data: farm } = useFarmData();
  const { history: aiHistory } = useAIHistory();
  const lastScan = aiHistory[0];
  const [showMoreTools, setShowMoreTools] = useState(false);

  const name = profile.name.trim() || (isHi ? "किसान भाई" : "Kisan");
  const hasLocation = Boolean(profile.village || profile.district || profile.state);
  const place = hasLocation
    ? [profile.district || profile.village, profile.state].filter(Boolean).join(", ")
    : null;
  const placeShort = place
    ? place.length > 22
      ? `${place.slice(0, 20)}…`
      : place
    : isHi
      ? "स्थान सेट करें"
      : "Set location";

  const weatherIsSample = Boolean(weather?.isDemo || weatherError);
  const weatherLive = Boolean(weather && !weather.isDemo && !weatherError);
  const temp = weatherLoading ? "…" : weather?.temp ?? "—";
  const rainChance = weatherLive ? (weather?.hourlyForecast[0]?.rainChancePercent ?? 0) : null;
  const condition = weatherLoading ? "…" : weather?.condition ?? "—";
  const humidityPct = weatherLive ? Number.parseInt(weather!.humidity, 10) || 0 : 0;
  const homeWxMode = detectWeatherFxMode(
    weather?.condition ?? "",
    rainChance ?? (weatherIsSample ? 55 : null)
  );
  const homeSky = weatherSkyInk(homeWxMode);
  const homeSkyPhoto = weatherSkyPhoto(homeWxMode);

  const sourceFields = farm.fields.slice(0, 2);
  const hasFields = sourceFields.length > 0;
  const primary = hasFields ? fieldCard(sourceFields[0], 0) : null;
  const primaryCropLabel = primary
    ? cropLabel(primary.cropSlug, primary.crop)
    : isHi
      ? "आपकी फसल"
      : "Your crop";
  const primaryCropChip = primary
    ? cropChipLabel(primary.cropSlug, primary.crop)
    : isHi
      ? "फसल जोड़ें"
      : "Add crop";

  const advice = buildAdvice({
    isHi,
    rainChance: rainChance ?? 0,
    crop: primaryCropLabel,
    stage: primary?.stage ?? "—",
  });
  const risk =
    weatherLive && rainChance != null
      ? buildRisk({ isHi, humidityPct, rainChance })
      : {
          label: isHi ? "मौसम —" : "Weather —",
          tone: "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]",
        };

  const greetName = name.trim()
    ? name.trim().charAt(0).toUpperCase() + name.trim().slice(1)
    : name;

  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: MOTION.slow, ease: EASE_OUT, delay },
        };

  return (
    <div className="relative mx-auto min-w-0 max-w-lg overflow-x-hidden pb-2">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-20px] top-0 h-[280px] overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(16,185,129,0.18),transparent_55%),radial-gradient(ellipse_at_90%_10%,rgba(180,140,70,0.1),transparent_45%),linear-gradient(180deg,#e8f6ee_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 space-y-4 px-0.5 pt-1">
        {/* Welcome — short */}
        <motion.section {...fade(0)} className="px-0.5">
          <p className="text-[13px] font-medium text-[var(--av-text-secondary)]">
            {isHi ? `नमस्ते, ${greetName} जी` : `Namaste, ${greetName}`}
          </p>
          <h1 className="mt-0.5 font-display text-[1.45rem] font-bold leading-tight tracking-tight text-[var(--av-text-primary)]">
            {isHi ? "आज क्या करना है?" : "What do you need today?"}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <AppLink
              href="/my-farm"
              className="inline-flex max-w-full items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-50/90 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
            >
              <Sprout className="h-3 w-3 shrink-0" />
              <span className="truncate">{primaryCropChip}</span>
            </AppLink>
            {hasLocation ? (
              <span className="inline-flex max-w-[46%] items-center gap-1 rounded-full border border-[var(--av-border)] bg-[var(--av-surface)]/90 px-2.5 py-1 text-[11px] font-semibold text-[var(--av-text-secondary)]">
                <MapPin className="h-3 w-3 shrink-0 text-sky-600" />
                <span className="truncate">{placeShort}</span>
              </span>
            ) : (
              <AppLink
                href="/profile/edit"
                className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-50/90 px-2.5 py-1 text-[11px] font-semibold text-sky-800"
              >
                <MapPin className="h-3 w-3" />
                {placeShort}
              </AppLink>
            )}
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                risk.tone
              )}
            >
              <ShieldCheck className="h-3 w-3 shrink-0" />
              {risk.label}
            </span>
          </div>
        </motion.section>

        {/* Look & tap jobs — photo backgrounds */}
        <motion.section {...fade(0.03)} className="grid grid-cols-2 gap-2.5">
          {QUICK_JOBS.map((job) => {
            const Icon = job.icon;
            return (
              <AppLink
                key={job.id}
                href={job.href}
                onClick={() => track("tool_open", { href: job.href, label: `home_${job.id}` })}
                className="group relative min-h-[148px] overflow-hidden rounded-2xl border border-white/20 shadow-[var(--av-shadow-md)] transition active:scale-[0.98]"
              >
                <Image
                  src={job.imageSrc}
                  alt=""
                  fill
                  sizes="(max-width: 512px) 50vw, 240px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/15" />
                <div className="relative flex h-full min-h-[148px] flex-col justify-end p-3.5">
                  <span className="mb-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white shadow-sm backdrop-blur-sm">
                    <Icon className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <p className="mt-3 text-[14px] font-bold leading-snug text-white drop-shadow-sm">
                    {isHi ? job.hi : job.en}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-white/85">
                    {isHi ? job.hintHi : job.hintEn}
                  </p>
                </div>
              </AppLink>
            );
          })}
        </motion.section>

        {/* Huge primary CTA — photo banner */}
        <motion.section {...fade(0.05)}>
          <AppLink
            href="/ai-doctor"
            onClick={() => track("tool_open", { href: "/ai-doctor", label: "home_scan_cta" })}
            className="relative flex min-h-[88px] w-full overflow-hidden rounded-2xl shadow-lg shadow-emerald-900/25 active:scale-[0.99]"
          >
            <Image
              src="/images/home/home-cta-scan.jpg"
              alt=""
              fill
              sizes="(max-width: 512px) 100vw, 512px"
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/75 to-emerald-800/40" />
            <span className="relative z-10 flex w-full items-center justify-center gap-2 px-4 py-5 text-[16px] font-bold text-white">
              <Camera className="h-5 w-5 shrink-0" />
              {isHi ? "फोटो लो — जाँच शुरू" : "Take photo — start check"}
              <ArrowRight className="h-4 w-4 shrink-0" />
            </span>
          </AppLink>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <AppLink
              href="/ask-query"
              className="relative flex min-h-[52px] items-center justify-center overflow-hidden rounded-xl border border-emerald-600/25 active:scale-[0.98]"
            >
              <Image
                src="/images/home/home-job-ask.jpg"
                alt=""
                fill
                sizes="200px"
                className="object-cover"
              />
              <span className="absolute inset-0 bg-emerald-950/65" />
              <span className="relative z-10 flex items-center gap-1.5 text-[13px] font-bold text-white">
                <MessageCircle className="h-4 w-4" />
                {isHi ? "पूछो" : "Ask"}
              </span>
            </AppLink>
            <AppLink
              href="/my-queries"
              className="relative flex min-h-[52px] items-center justify-center overflow-hidden rounded-xl border border-[var(--av-border)] active:scale-[0.98]"
            >
              <Image
                src="/images/home/home-job-photo.jpg"
                alt=""
                fill
                sizes="200px"
                className="object-cover object-[center_30%]"
              />
              <span className="absolute inset-0 bg-slate-950/70" />
              <span className="relative z-10 text-[13px] font-bold text-white">
                {isHi ? "मेरे जवाब" : "My answers"}
              </span>
            </AppLink>
          </div>
          <AppLink
            href="/schemes"
            onClick={() => track("tool_open", { href: "/schemes", label: "home_kcc_banner" })}
            className="mt-2 flex min-h-[52px] w-full items-center justify-between gap-2 rounded-xl border border-emerald-700/30 bg-gradient-to-r from-emerald-900 to-emerald-800 px-4 py-3 text-white shadow-md shadow-emerald-900/20 active:scale-[0.99]"
          >
            <span className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 shrink-0 text-emerald-200" />
              <span>
                <span className="block text-[14px] font-bold leading-tight">
                  {isHi ? "योजना · KCC · यंत्र" : "Schemes · KCC · Machinery"}
                </span>
                <span className="block text-[11px] font-medium text-emerald-100/90">
                  {isHi ? "लोन, सब्सिडी, बीमा — रास्ता यहाँ" : "Loan, subsidy, insurance — start here"}
                </span>
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-emerald-200" />
          </AppLink>
          {lastScan ? (
            <AppLink
              href="/ai-doctor"
              className="mt-2 flex items-center gap-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2"
            >
              {lastScan.thumbnailUrl && !lastScan.thumbnailUrl.startsWith("blob:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lastScan.thumbnailUrl}
                  alt=""
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700">
                  <Sparkles className="h-4 w-4" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                  {isHi ? "पिछला स्कैन" : "Last scan"}
                </span>
                <span className="block truncate text-[13px] font-bold text-[var(--av-text-primary)]">
                  {lastScan.result.diseaseName}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-[var(--av-text-muted)]" />
            </AppLink>
          ) : null}
        </motion.section>

        {/* More tools — same photo-card look as quick jobs, smaller */}
        <motion.section {...fade(0.07)}>
          <div className="mb-2 flex items-center justify-between px-0.5">
            <h2 className="text-[14px] font-bold text-[var(--av-text-primary)]">
              {isHi ? "और काम" : "More jobs"}
            </h2>
            <p className="text-[10px] font-semibold text-[var(--av-text-muted)]">
              {isHi ? "टैप करो" : "Tap"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {(showMoreTools ? MORE_JOBS : MORE_JOBS.slice(0, MORE_JOBS_FIRST)).map((job) => (
              <AppLink
                key={job.id}
                href={job.href}
                onClick={() => track("tool_open", { href: job.href, label: `home_more_${job.id}` })}
                className="group relative min-h-[112px] overflow-hidden rounded-2xl border border-white/15 shadow-[var(--av-shadow-sm)] transition active:scale-[0.98]"
              >
                <Image
                  src={job.imageSrc}
                  alt=""
                  fill
                  sizes="(max-width: 512px) 50vw, 220px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/48 to-black/15" />
                <div className="relative flex h-full min-h-[112px] flex-col justify-end p-3">
                  <p className="text-[13px] font-bold leading-snug text-white drop-shadow-sm">
                    {isHi ? job.hi : job.en}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-white/85">
                    {isHi ? job.hintHi : job.hintEn}
                  </p>
                </div>
              </AppLink>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowMoreTools((v) => !v)}
            className="mt-2.5 flex w-full items-center justify-center gap-1 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] py-2.5 text-[12px] font-bold text-[var(--av-text-secondary)]"
          >
            {showMoreTools
              ? isHi
                ? "कम दिखाओ"
                : "Show less"
              : isHi
                ? "और काम देखो"
                : "See more jobs"}
            <ArrowRight
              className={cn("h-3.5 w-3.5 transition", showMoreTools && "rotate-90")}
            />
          </button>
        </motion.section>

        {/* Weather — Google/Pixel mini widget */}
        <motion.section {...fade(0.1)}>
          <AppLink
            href="/weather"
            className="group relative isolate block min-h-[17.5rem] overflow-hidden rounded-[32px] px-5 pb-5 pt-4 text-white active:scale-[0.99]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={homeSkyPhoto}
              alt=""
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105",
                !reduced && "animate-wx-sky-ken"
              )}
            />
            <span className={cn("absolute inset-0", homeSky.veil)} />
            <WeatherSkyFX mode={homeWxMode} density="home" />

            <div className={cn("relative z-10 flex min-h-[16rem] flex-col", homeSky.ink)}>
              <div className="flex items-center justify-between gap-2">
                <p className={cn("flex min-w-0 items-center gap-1.5 text-[14px] font-medium", homeSky.mute)}>
                  <MapPin className="h-4 w-4 shrink-0 opacity-80" />
                  <span className="truncate">{hasLocation ? place : placeShort}</span>
                </p>
                <ArrowRight className="h-4 w-4 shrink-0 text-white/80 transition group-hover:translate-x-0.5" />
              </div>

              <div className="mt-auto flex flex-col pt-8">
                <p className={cn("text-center text-[16px] font-medium", homeSky.mute)}>
                  {conditionHi(condition, isHi)}
                </p>

                <div className="mt-1 flex items-end justify-center gap-1">
                  <p className="font-[family-name:var(--font-display)] text-[5.5rem] font-semibold leading-[0.9] tracking-tight">
                    {weatherLoading
                      ? "…"
                      : temp.replace(/\s/g, "").replace("°C", "").replace("°", "")}
                  </p>
                  {homeWxMode !== "clear" &&
                    (homeWxMode === "rain" || homeWxMode === "storm" ? (
                      <CloudRain className="mb-3 h-11 w-11 opacity-90" />
                    ) : (
                      <CloudSun className="mb-3 h-11 w-11 opacity-90" />
                    ))}
                </div>

                <div
                  className={cn(
                    "mt-4 rounded-[24px] border px-4 py-3.5 text-[15px] font-semibold leading-snug backdrop-blur-[2px]",
                    homeSky.card
                  )}
                >
                  {!weatherLive || rainChance == null
                    ? isHi
                      ? "पूरा मौसम खोलो — खेत सलाह मिलेगी"
                      : "Open weather for farm tip"
                    : rainChance >= 55
                      ? isHi
                        ? `बारिश ${rainChance}% — आज स्प्रे मत करो`
                        : `${rainChance}% rain — skip spray today`
                      : humidityPct >= 80
                        ? isHi
                          ? "नमी ज्यादा — पत्ती पर नज़र रखो"
                          : "High humidity — watch leaves"
                        : isHi
                          ? "स्प्रे और खेत काम ठीक दिख रहे हैं"
                          : "Spray and field work look fine"}
                </div>

                {weatherIsSample && !weatherLoading ? (
                  <p className="mt-3 text-center text-[11px] font-semibold text-amber-100">
                    {isHi ? "नमूना — लाइव नहीं" : "Sample — not live"}
                  </p>
                ) : null}
              </div>
            </div>
          </AppLink>
        </motion.section>

        {/* Fields */}
        <motion.section {...fade(0.12)}>
          <div className="mb-2 flex items-center justify-between px-0.5">
            <h2 className="text-[14px] font-bold text-[var(--av-text-primary)]">
              {isHi ? "मेरा खेत" : "My field"}
            </h2>
            <AppLink href="/my-farm" className="text-[12px] font-bold text-[var(--av-accent)]">
              {isHi ? "सभी →" : "All →"}
            </AppLink>
          </div>
          {hasFields ? (
            <div className="space-y-2">
              {sourceFields.map((field, index) => {
                const card = fieldCard(field, index);
                return (
                  <AppLink
                    key={card.key}
                    href="/my-farm"
                    className="flex items-center gap-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3 active:bg-emerald-500/5"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={card.img}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold text-[var(--av-text-primary)]">
                        {cropChipLabel(card.cropSlug, card.crop)}
                      </p>
                      <p className="truncate text-[11px] text-[var(--av-text-muted)]">
                        {card.stage}
                        {card.days != null
                          ? isHi
                            ? ` · ${card.days} दिन`
                            : ` · Day ${card.days}`
                          : ""}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[var(--av-text-muted)]" />
                  </AppLink>
                );
              })}
            </div>
          ) : (
            <AppLink
              href="/my-farm"
              className="flex min-h-[64px] items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-500/35 bg-emerald-50/50 px-4 dark:bg-emerald-950/20"
            >
              <Sprout className="h-5 w-5 text-emerald-600" />
              <span className="text-[14px] font-bold text-emerald-800 dark:text-emerald-200">
                {isHi ? "खेत जोड़ो" : "Add field"}
              </span>
            </AppLink>
          )}
        </motion.section>

        {/* One job */}
        <motion.section
          {...fade(0.14)}
          className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-[var(--av-surface)] to-amber-50/40 p-3.5 dark:from-emerald-950/35 dark:via-[var(--av-surface)] dark:to-amber-950/15"
        >
          <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            {isHi ? "आज का काम" : "Today's job"}
          </p>
          <h2 className="mt-0.5 text-[15px] font-bold text-[var(--av-text-primary)]">
            {advice.title}
          </h2>
          <p className="mt-1 text-[13px] text-[var(--av-text-secondary)]">{advice.body}</p>
          <AppLink
            href={advice.href}
            className="mt-2.5 inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 text-[13px] font-bold text-white active:scale-[0.98]"
          >
            {advice.cta}
            <ArrowRight className="h-4 w-4" />
          </AppLink>
        </motion.section>
      </div>
    </div>
  );
}
