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
  Wind,
  ScanLine,
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

const HERO_IMG = "/images/home/agriveda-hero-scan.jpg";
/** Stable calendar anchor for DAS labels (avoids impure Date.now in render). */
const HOME_DAY_ANCHOR_MS = Date.parse("2026-07-16T12:00:00Z");

const FARM_COMMAND: {
  label: string;
  labelHi: string;
  href: string;
  icon: LucideIcon;
  imageSrc?: string;
  tone: string;
  ring: string;
}[] = [
  {
    label: "My Farm",
    labelHi: "मेरा खेत",
    href: "/my-farm",
    icon: Sprout,
    imageSrc: "/images/icons/tools/my-farm.png",
    tone: "from-emerald-500/20 to-teal-500/10",
    ring: "ring-emerald-500/25",
  },
  {
    label: "Calendar",
    labelHi: "कैलेंडर",
    href: "/crop-calendar",
    icon: BookOpen,
    imageSrc: "/images/icons/tools/crop-planner.png",
    tone: "from-teal-500/20 to-cyan-500/10",
    ring: "ring-teal-500/25",
  },
  {
    label: "Advisor",
    labelHi: "सलाहकार",
    href: "/field-advisor",
    icon: MessageCircle,
    imageSrc: "/images/icons/tools/advisor.png",
    tone: "from-cyan-500/20 to-sky-500/10",
    ring: "ring-cyan-500/25",
  },
  {
    label: "Pests",
    labelHi: "कीट-रोग",
    href: "/pest-diseases",
    icon: Leaf,
    imageSrc: "/images/icons/tools/pest-scanner.png",
    tone: "from-rose-500/18 to-orange-500/10",
    ring: "ring-rose-500/25",
  },
  {
    label: "Weeds",
    labelHi: "खरपतवार",
    href: "/pest-diseases?type=weed",
    icon: Leaf,
    imageSrc: "/images/icons/tools/weed-guide.png",
    tone: "from-lime-500/20 to-amber-500/10",
    ring: "ring-lime-500/25",
  },
  {
    label: "Nutrients",
    labelHi: "पोषक",
    href: "/deficiencies",
    icon: Leaf,
    imageSrc: "/images/icons/tools/nutrients.png",
    tone: "from-lime-500/20 to-emerald-500/12",
    ring: "ring-lime-500/30",
  },
  {
    label: "Fertilizer",
    labelHi: "खाद",
    href: "/services/fertilizer-calculator",
    icon: Sprout,
    imageSrc: "/images/icons/tools/fertilizer.png",
    tone: "from-amber-500/20 to-yellow-500/10",
    ring: "ring-amber-500/30",
  },
  {
    label: "Spray",
    labelHi: "स्प्रे",
    href: "/weather/spray-advisory",
    icon: Droplets,
    imageSrc: "/images/icons/tools/spray-advisory.png",
    tone: "from-sky-500/18 to-cyan-500/10",
    ring: "ring-sky-500/25",
  },
  {
    label: "Alerts",
    labelHi: "अलर्ट",
    href: "/alerts",
    icon: ShieldCheck,
    imageSrc: "/images/icons/tools/farm-alert.png",
    tone: "from-red-500/15 to-orange-500/10",
    ring: "ring-red-500/25",
  },
  {
    label: "Ask",
    labelHi: "पूछें",
    href: "/ask-query",
    icon: MessageCircle,
    imageSrc: "/images/icons/tools/advisor.png",
    tone: "from-teal-500/18 to-emerald-500/10",
    ring: "ring-teal-500/25",
  },
];

function daysSince(dateStr: string): number | null {
  if (!dateStr) return null;
  const d = Date.parse(dateStr);
  if (Number.isNaN(d)) return null;
  const diff = Math.floor((HOME_DAY_ANCHOR_MS - d) / 86_400_000);
  return diff >= 0 ? diff : null;
}

/** Farmer-readable crop label — Hindi first; English always from slug (not stale field.crop). */
function cropLabel(slug: string | undefined, englishName: string): string {
  const key = (slug || "").trim().toLowerCase();
  const catalog = key ? cropCatalog.find((c) => c.slug === key) : undefined;
  const hi = getCropHindiName(key) ?? getCropHindiName(englishName.toLowerCase());
  const en =
    catalog?.name ||
    (englishName && !key ? englishName : key ? key.charAt(0).toUpperCase() + key.slice(1) : englishName);
  return hi ? `${hi} (${en})` : en;
}

/** Compact chip text — Hindi only when available (saves wrap space). */
function cropChipLabel(slug: string | undefined, englishName: string): string {
  const key = (slug || "").trim().toLowerCase();
  return getCropHindiName(key) || cropCatalog.find((c) => c.slug === key)?.name || englishName;
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
      label: isHi ? "रोग खतरा ↑" : "High disease risk",
      tone: "border-rose-400/40 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300",
    };
  }
  if (humidityPct >= 65) {
    return {
      label: isHi ? "फफूंद खतरा" : "Mild fungal risk",
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

  const name = profile.name.trim() || (isHi ? "किसान भाई" : "Kisan");
  const hasLocation = Boolean(profile.village || profile.district || profile.state);
  const place = hasLocation
    ? [profile.district || profile.village, profile.state].filter(Boolean).join(", ")
    : null;
  const placeShort = place
    ? place.length > 22
      ? `${place.slice(0, 20)}…`
      : place
    : "स्थान सेट करें";

  const weatherIsSample = Boolean(weather?.isDemo || weatherError);
  const weatherLive = Boolean(weather && !weather.isDemo && !weatherError);
  const temp = weatherLoading ? "…" : weather?.temp ?? "—";
  const humidity = weatherLoading ? "…" : weather?.humidity ?? "—";
  const wind = weatherLoading ? "…" : weather?.windSpeed ?? "—";
  const rainChance = weatherLive ? (weather?.hourlyForecast[0]?.rainChancePercent ?? 0) : null;
  const condition = weatherLoading ? "…" : weather?.condition ?? "—";
  const humidityPct = weatherLive ? Number.parseInt(weather!.humidity, 10) || 0 : 0;

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
    humidity,
    crop: primaryCropLabel,
    stage: primary?.stage ?? (isHi ? "—" : "—"),
  });
  const risk =
    weatherLive && rainChance != null
      ? buildRisk({ isHi, humidityPct, rainChance })
      : {
          label: isHi ? "मौसम —" : "Weather —",
          tone: "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]",
        };

  const steps = [
    {
      n: "1",
      title: isHi ? "फसल" : "Crop",
      sub: primaryCropChip,
    },
    {
      n: "2",
      title: isHi ? "फोटो" : "Photo",
      sub: isHi ? "या लक्षण" : "or symptoms",
    },
    {
      n: "3",
      title: isHi ? "इलाज" : "Cure",
      sub: isHi ? "तुरंत" : "right away",
    },
  ];

  const greetName = name.trim()
    ? name.trim().charAt(0).toUpperCase() + name.trim().slice(1)
    : name;

  return (
    <div className="relative mx-auto min-w-0 max-w-lg overflow-x-hidden pb-2">
      {/* Soft earthy atmosphere — not a flat wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-20px] top-0 h-[360px] overflow-hidden"
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

      <div className="relative z-10 space-y-3.5 px-0.5 pt-1">
        {/* Welcome */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION.slow, ease: EASE_OUT }}
          className="px-0.5"
        >
          <p className="text-[13px] font-medium text-[var(--av-text-secondary)]">
            {isHi ? `नमस्ते, ${greetName} जी` : `Namaste, ${greetName}`}
          </p>
          <h1 className="mt-0.5 font-display text-[1.3rem] font-bold leading-tight tracking-tight text-[var(--av-text-primary)] sm:text-[1.45rem]">
            {isHi ? "आज खेत का काम आसान" : "Make today’s farm work easy"}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-50/90 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
              <Sprout className="h-3 w-3 shrink-0" strokeWidth={2.25} />
              <span className="truncate">{isHi ? `फसल: ${primaryCropChip}` : primaryCropChip}</span>
            </span>
            {hasLocation ? (
              <span className="inline-flex max-w-[46%] items-center gap-1 rounded-full border border-[var(--av-border)] bg-[var(--av-surface)]/90 px-2 py-0.5 text-[11px] font-semibold text-[var(--av-text-secondary)]">
                <MapPin className="h-3 w-3 shrink-0 text-sky-600" strokeWidth={2.25} />
                <span className="truncate">{placeShort}</span>
              </span>
            ) : (
              <AppLink
                href="/profile/edit"
                className="inline-flex max-w-[46%] items-center gap-1 rounded-full border border-sky-500/30 bg-sky-50/90 px-2 py-0.5 text-[11px] font-semibold text-sky-800 dark:bg-sky-950/30 dark:text-sky-200"
              >
                <MapPin className="h-3 w-3 shrink-0" strokeWidth={2.25} />
                <span className="truncate">{placeShort}</span>
              </AppLink>
            )}
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${risk.tone}`}
            >
              <ShieldCheck className="h-3 w-3 shrink-0" strokeWidth={2.25} />
              {risk.label}
            </span>
          </div>
        </motion.section>

        {/* Crop doctor — compact hero + tiny 1-2-3 + clear CTAs */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 14, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.03 }}
          className="overflow-hidden rounded-[22px] border border-emerald-500/25 bg-[var(--av-surface)] shadow-[var(--av-shadow-md)]"
        >
          <div className="relative min-h-[200px] sm:min-h-[230px]">
            <Image
              src={HERO_IMG}
              alt={
                isHi
                  ? "किसान फसल की पत्ती को फोन से स्कैन कर रहे हैं"
                  : "Farmer scanning a crop leaf with a phone"
              }
              fill
              priority
              sizes="(max-width: 512px) 100vw, 512px"
              className="object-cover object-[center_22%]"
            />
            {/* Soft bottom fade — keep farmer face/hands clear */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f16]/72 via-[#0b1f16]/12 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/15 to-transparent" />

            {/* Scan frame hint on leaf area */}
            <div
              aria-hidden
              className="pointer-events-none absolute right-[12%] top-[18%] h-16 w-16 rounded-xl border-2 border-emerald-300/80 shadow-[0_0_0_1px_rgba(16,185,129,0.35)] sm:h-20 sm:w-20"
            >
              <span className="absolute -left-0.5 -top-0.5 h-2.5 w-2.5 rounded-sm bg-emerald-300" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-sm bg-emerald-300" />
              <span className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-sm bg-emerald-300" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-sm bg-emerald-300" />
              <ScanLine className="absolute inset-0 m-auto h-5 w-5 animate-pulse text-emerald-200/90" />
            </div>

            {/* Result card ON the image — compact on phone */}
            <div className="absolute right-2 top-2 max-w-[42%] sm:right-4 sm:top-4 sm:max-w-[48%]">
              {lastScan ? (
                <AppLink
                  href="/ai-doctor"
                  className="block overflow-hidden rounded-xl border border-white/25 bg-[#0b1f16]/80 shadow-md backdrop-blur-md sm:rounded-2xl"
                >
                  {lastScan.thumbnailUrl && !lastScan.thumbnailUrl.startsWith("blob:") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={lastScan.thumbnailUrl}
                      alt=""
                      className="h-8 w-full object-cover sm:h-14"
                    />
                  ) : null}
                  <div className="px-2 py-1.5 sm:px-2.5 sm:py-2">
                    <p className="text-[8px] font-bold uppercase tracking-wide text-emerald-300 sm:text-[9px]">
                      {isHi ? "पिछला स्कैन" : "Last scan"}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[10px] font-bold leading-tight text-white sm:line-clamp-2 sm:text-[12px] sm:leading-snug">
                      {lastScan.result.diseaseName}
                    </p>
                    <p className="mt-0.5 text-[9px] font-semibold text-amber-200 sm:text-[10px]">
                      {lastScan.result.severity} · {lastScan.result.riskLevel}
                    </p>
                  </div>
                </AppLink>
              ) : (
                <div className="rounded-xl border border-white/25 bg-[#0b1f16]/80 px-2 py-1.5 shadow-md backdrop-blur-md sm:rounded-2xl sm:px-2.5 sm:py-2">
                  <p className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wide text-emerald-300 sm:text-[9px]">
                    <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    {isHi ? "स्कैन रिजल्ट" : "Scan result"}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[10px] font-bold leading-tight text-white sm:text-[12px]">
                    {isHi ? "फसल — पत्ती धब्बा" : "Crop — leaf spot"}
                  </p>
                  <p className="mt-0.5 text-[9px] font-semibold text-amber-200 sm:text-[10px]">
                    {isHi ? "उदाहरण · फोटो लो" : "Example · take photo"}
                  </p>
                </div>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 px-4 pb-3.5 pt-10">
              <p className="text-[11px] font-bold text-emerald-200/90">
                {isHi ? "AI फसल डॉक्टर" : "AI Crop Doctor"}
              </p>
              <h2 className="mt-0.5 max-w-[18ch] text-[1.3rem] font-extrabold leading-snug text-white sm:text-[1.45rem]">
                {isHi ? "फसल की पत्ती दिखाओ" : "Show crop leaf"}
              </h2>
              <p className="mt-0.5 text-[12px] font-medium text-white/85">
                {isHi
                  ? "फोटो पर ही बीमारी और इलाज दिखेगा"
                  : "Disease + cure appear on your photo"}
              </p>
            </div>
          </div>

          <div className="space-y-3 p-3.5 sm:p-4">
            {/* Tiny numbered flow — not three tall cards */}
            <div
              className="flex items-center justify-between gap-1 rounded-xl bg-[var(--av-surface-inset)] px-2.5 py-2"
              aria-label={isHi ? "तीन आसान कदम" : "Three easy steps"}
            >
              {steps.map((step, i) => (
                <div key={step.n} className="flex min-w-0 flex-1 items-center gap-1.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-black text-white">
                    {step.n}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-bold leading-tight text-[var(--av-text-primary)]">
                      {step.title}
                    </span>
                    <span className="block truncate text-[10px] font-medium leading-tight text-[var(--av-text-muted)]">
                      {step.sub}
                    </span>
                  </span>
                  {i < steps.length - 1 && (
                    <ArrowRight
                      className="ml-auto hidden h-3.5 w-3.5 shrink-0 text-emerald-600/50 xs:block sm:block"
                      aria-hidden
                    />
                  )}
                </div>
              ))}
            </div>

            <AppLink
              href="/ai-doctor"
              onClick={() => track("tool_open", { href: "/ai-doctor", label: "home_scan_cta" })}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 text-[15px] font-bold text-white shadow-[0_8px_22px_rgba(5,150,105,0.35)] transition active:scale-[0.98]"
            >
              <Camera className="h-5 w-5" strokeWidth={2.25} />
              {isHi ? "फोटो से जाँच करें" : "Check with photo"}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </AppLink>
            <AppLink
              href="/crop-problem"
              onClick={() => track("tool_open", { href: "/crop-problem", label: "home_symptoms_cta" })}
              className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-4 text-[13px] font-semibold text-[var(--av-text-secondary)] transition active:scale-[0.98]"
            >
              <ListChecks className="h-4 w-4 text-emerald-600" strokeWidth={2.25} />
              {isHi ? "फोटो नहीं है? लक्षण चुनें" : "No photo? Pick symptoms"}
            </AppLink>
          </div>
        </motion.section>

        {/* Farm Command — compact futuristic hub */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: MOTION.slow, ease: EASE_OUT }}
          className="relative overflow-hidden rounded-[22px] border border-emerald-500/20 bg-[var(--av-surface)]/85 p-3 shadow-[var(--av-shadow-md)] backdrop-blur-md sm:p-3.5"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-emerald-400/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-14 -left-8 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl"
          />

          <div className="relative mb-2.5 flex items-end justify-between gap-2 px-0.5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700/75 dark:text-emerald-300/80">
                Agriveda
              </p>
              <h2 className="font-display text-[15px] font-bold tracking-tight text-[var(--av-text-primary)] sm:text-base">
                {isHi ? "खेत कमांड" : "Farm Command"}
              </h2>
            </div>
            <p className="pb-0.5 text-[10px] font-semibold text-[var(--av-text-muted)]">
              {isHi ? "एक टैप · सब टूल" : "One tap · all tools"}
            </p>
          </div>

          <div className="relative grid grid-cols-4 gap-2 sm:gap-2.5">
            {FARM_COMMAND.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={`${action.href}-${action.label}`}
                  initial={reduced ? false : { opacity: 0, y: 10, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.05 + i * 0.025, duration: 0.35, ease: EASE_OUT }}
                  whileHover={reduced ? undefined : { y: -2 }}
                  whileTap={reduced ? undefined : { scale: 0.96 }}
                >
                  <AppLink
                    href={action.href}
                    onClick={() => track("tool_open", { href: action.href, label: action.label })}
                    className="av-tool-press group flex flex-col items-center gap-1 rounded-2xl border border-emerald-500/10 bg-[var(--av-surface-inset)]/70 px-1 py-2 text-center transition hover:border-emerald-500/35 hover:bg-[var(--av-surface)] hover:shadow-[0_8px_24px_-10px_rgba(5,150,105,0.45)]"
                  >
                    <span
                      className={`relative flex h-[3.35rem] w-[3.35rem] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${action.tone} shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ${action.ring} sm:h-16 sm:w-16`}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]"
                      />
                      {action.imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={action.imageSrc}
                          alt=""
                          className="relative h-full w-full scale-[1.22] object-cover transition duration-300 group-hover:scale-[1.3]"
                          draggable={false}
                        />
                      ) : (
                        <Icon className="relative h-7 w-7 text-emerald-700 dark:text-emerald-300" />
                      )}
                    </span>
                    <span className="line-clamp-1 max-w-full px-0.5 text-[10px] font-bold leading-tight text-[var(--av-text-primary)] sm:text-[11px]">
                      {isHi ? action.labelHi : action.label}
                    </span>
                  </AppLink>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Weather Today — farmer-first */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: MOTION.slow, ease: EASE_OUT }}
        >
          <AppLink
            href="/weather"
            className="av-weather-card block overflow-hidden rounded-[22px] border border-sky-500/25 bg-[var(--av-surface)] shadow-[var(--av-shadow-md)]"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-sky-500/20 via-cyan-500/10 to-emerald-500/15 px-4 pb-3 pt-3.5 dark:from-sky-950/50 dark:via-cyan-950/30 dark:to-emerald-950/25">
              <div className="av-weather-glow pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-amber-300/25 blur-2xl" />
              <div className="av-weather-glow-2 pointer-events-none absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-sky-400/20 blur-2xl" />
              <div
                aria-hidden
                className="av-weather-drift pointer-events-none absolute right-10 top-3 h-8 w-14 rounded-full bg-white/35 blur-[1px]"
              />
              <div
                aria-hidden
                className="av-weather-drift-slow pointer-events-none absolute right-20 top-8 h-5 w-10 rounded-full bg-white/25 blur-[1px]"
              />

              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-sky-800/80 dark:text-sky-200/80">
                    <CloudSun className="h-3.5 w-3.5" />
                    {isHi ? "आज का मौसम" : "Weather today"}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[12px] font-medium text-[var(--av-text-secondary)]">
                    <MapPin className="h-3 w-3 shrink-0 text-sky-600" />
                    <span className={`truncate ${!hasLocation ? "text-sky-700 dark:text-sky-300" : ""}`}>
                      {hasLocation ? place : placeShort}
                    </span>
                  </p>
                  {weatherIsSample && !weatherLoading ? (
                    <span className="mt-1 inline-flex rounded-full border border-amber-400/40 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                      नमूना — लाइव नहीं
                    </span>
                  ) : null}
                </div>
                <CloudSun className="av-weather-sun h-10 w-10 shrink-0 text-amber-500/90 drop-shadow-sm" />
              </div>

              <div className="relative mt-3 flex items-end gap-3">
                <p className="av-weather-temp text-[2.75rem] font-black leading-none tracking-tight text-[var(--av-text-primary)] tabular-nums">
                  {weatherLoading ? "…" : temp.replace(/\s/g, "")}
                </p>
                <div className="mb-1 min-w-0 pb-0.5">
                  <p className="text-[15px] font-bold capitalize leading-snug text-[var(--av-text-primary)]">
                    {condition}
                  </p>
                  {weatherLive && weather?.feelsLike ? (
                    <p className="text-[11px] font-medium text-[var(--av-text-muted)]">
                      {isHi ? `महसूस: ${weather.feelsLike}` : `Feels like ${weather.feelsLike}`}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Farmer field tip */}
              {weatherLive && rainChance != null ? (
                <div
                  className={`av-weather-tip relative mt-3 overflow-hidden rounded-xl border px-3 py-2 text-[12px] font-semibold leading-snug ${
                    rainChance >= 55
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100"
                      : humidityPct >= 80
                        ? "border-rose-500/25 bg-rose-500/10 text-rose-900 dark:text-rose-100"
                        : "border-emerald-500/25 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100"
                  }`}
                >
                  <span className="av-weather-tip-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                  {rainChance >= 55
                    ? isHi
                      ? `बारिश संभावना ${rainChance}% — आज स्प्रे न करें`
                      : `${rainChance}% rain chance — skip spray today`
                    : humidityPct >= 80
                      ? isHi
                        ? "नमी ज्यादा — पत्तों पर रोग का खतरा देखें"
                        : "High humidity — watch leaves for disease"
                      : isHi
                        ? "मौसम खेत के काम के लिए ठीक"
                        : "Good conditions for field work"}
                </div>
              ) : !weatherLoading ? (
                <div className="relative mt-3 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-[12px] font-semibold text-[var(--av-text-muted)]">
                  {isHi ? "लाइव मौसम उपलब्ध नहीं — स्थान सेट करें या मौसम पेज खोलें" : "Live weather unavailable — set location or open weather page"}
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-3 gap-px bg-[var(--av-border-subtle)]">
              {[
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
                  value: weatherLoading ? "…" : rainChance != null ? `${rainChance}%` : "—",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="av-weather-stat flex flex-col items-center bg-[var(--av-surface)] px-2 py-3 text-center"
                >
                  <Icon className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  <p className="mt-1 text-[16px] font-extrabold tabular-nums text-[var(--av-text-primary)]">
                    {value}
                  </p>
                  <p className="text-[10px] font-semibold text-[var(--av-text-muted)]">{label}</p>
                </div>
              ))}
            </div>

            <p className="flex items-center justify-between px-4 py-3 text-[13px] font-bold text-[var(--av-accent)]">
              <span>{isHi ? "पूरा मौसम और स्प्रे सलाह" : "Full weather & spray advice"}</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </p>
            <style>{`
              .av-weather-sun { animation: av-weather-pulse 2.8s ease-in-out infinite; }
              .av-weather-glow { animation: av-weather-breathe 4s ease-in-out infinite; }
              .av-weather-glow-2 { animation: av-weather-breathe 5.2s ease-in-out infinite reverse; }
              .av-weather-drift { animation: av-weather-drift 7s ease-in-out infinite; }
              .av-weather-drift-slow { animation: av-weather-drift 10s ease-in-out infinite reverse; }
              .av-weather-tip-shine { animation: av-weather-shine 3.2s ease-in-out infinite; }
              .av-weather-stat { transition: transform 0.2s ease, background 0.2s ease; }
              .av-weather-card:active .av-weather-stat { transform: translateY(1px); }
              @keyframes av-weather-pulse {
                0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.92; }
                50% { transform: scale(1.08) rotate(4deg); opacity: 1; }
              }
              @keyframes av-weather-breathe {
                0%, 100% { opacity: 0.55; transform: scale(1); }
                50% { opacity: 0.95; transform: scale(1.12); }
              }
              @keyframes av-weather-drift {
                0%, 100% { transform: translateX(0); opacity: 0.35; }
                50% { transform: translateX(-18px); opacity: 0.65; }
              }
              @keyframes av-weather-shine {
                0% { transform: translateX(-120%); opacity: 0; }
                35% { opacity: 0.7; }
                100% { transform: translateX(280%); opacity: 0; }
              }
              @media (prefers-reduced-motion: reduce) {
                .av-weather-sun,
                .av-weather-glow,
                .av-weather-glow-2,
                .av-weather-drift,
                .av-weather-drift-slow,
                .av-weather-tip-shine { animation: none !important; }
              }
            `}</style>
          </AppLink>
        </motion.section>

        {/* My Fields — Hindi crop names */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: MOTION.slow, ease: EASE_OUT }}
        >
          <div className="mb-2 flex items-center justify-between px-0.5">
            <h2 className="text-[14px] font-bold text-[var(--av-text-primary)]">
              {isHi ? "मेरे खेत" : "My Fields"}
            </h2>
            <AppLink
              href="/my-farm"
              className="text-[12px] font-bold text-[var(--av-accent)]"
            >
              {isHi ? "सभी →" : "All →"}
            </AppLink>
          </div>
          <div className="space-y-2.5">
            {hasFields ? (
              sourceFields.map((field, index) => {
                const card = fieldCard(field, index);
                return (
                  <AppLink
                    key={card.key}
                    href="/my-farm"
                    className="flex items-center gap-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3 shadow-[var(--av-shadow-sm)] transition hover:border-emerald-500/35"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--av-surface-inset)]">
                      <Image
                        src={card.img}
                        alt={card.crop}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-bold text-[var(--av-text-primary)]">
                        {cropChipLabel(card.cropSlug, card.crop)}
                      </p>
                      <p className="truncate text-[12px] text-[var(--av-text-muted)]">{card.name}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                          {card.stage}
                        </span>
                        <span className="rounded-md bg-[var(--av-surface-inset)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--av-text-secondary)]">
                          {card.days != null
                            ? isHi
                              ? `${card.days} दिन`
                              : `Day ${card.days}`
                            : isHi
                              ? "दिन जोड़ें"
                              : "Add date"}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[var(--av-text-muted)]" />
                  </AppLink>
                );
              })
            ) : (
              <AppLink
                href="/my-farm"
                className="flex min-h-[72px] items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-500/35 bg-emerald-50/50 px-4 py-5 text-center dark:bg-emerald-950/20"
              >
                <Sprout className="h-5 w-5 text-emerald-600" strokeWidth={2.25} />
                <span className="text-[15px] font-bold text-emerald-800 dark:text-emerald-200">
                  अपना खेत जोड़ें
                </span>
                <ArrowRight className="h-4 w-4 text-emerald-600" />
              </AppLink>
            )}
          </div>
        </motion.section>

        {/* आज का एक काम — pehle jaisi jagah: tools/weather/fields ke baad */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: MOTION.normal, ease: EASE_OUT }}
          className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-[var(--av-surface)] to-amber-50/50 p-3.5 dark:from-emerald-950/35 dark:via-[var(--av-surface)] dark:to-amber-950/15"
        >
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                {isHi ? "आज का एक काम" : "One job today"}
              </p>
              <h2 className="text-[15px] font-bold text-[var(--av-text-primary)]">{advice.title}</h2>
              <p className="mt-1 text-[13px] leading-snug text-[var(--av-text-secondary)]">{advice.body}</p>
              <AppLink
                href={advice.href}
                className="mt-2.5 inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 text-[13px] font-bold text-white active:scale-[0.98]"
              >
                {advice.cta}
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </AppLink>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
