"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronRight,
  Droplets,
  MessageCircle,
  Sparkles,
  Sprout,
  TrendingUp,
  Landmark,
  ClipboardList,
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
import { HomeWeatherButton } from "@/components/weather/HomeWeatherChip";
import FarmerAppTour from "@/components/tutorial/FarmerAppTour";
import HomeCropStatusCard from "@/components/dashboard/HomeCropStatusCard";
import { farmerSpeak } from "@/lib/crops/farmerSpeak";



/** Unified Crop Disease & Doctor Hero Card — 2-Column Split Photo Cards, High-Affordance, Futuristic & Clean */
function UnifiedDiseaseDoctorCard({ isHi }: { isHi: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-emerald-500/25 bg-gradient-to-br from-emerald-850 via-emerald-900 to-teal-950 p-3.5 sm:p-4 text-white shadow-[0_16px_36px_-12px_rgba(5,70,45,0.45)]">
      {/* Background ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-teal-400/15 blur-3xl"
      />

      {/* Header section — Clean badges + punchy heading */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 border border-emerald-300/35 px-2.5 py-0.5 text-[10.5px] font-extrabold tracking-wide text-emerald-200">
          <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
          {isHi ? "फसल डॉक्टर" : "Crop Doctor"}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-200 backdrop-blur-xs">
          {isHi ? "⚡ 2 सेकंड में पहचान" : "⚡ 2s Instant Check"}
        </span>
      </div>

      <div className="relative z-10 mt-1.5">
        <h2 className="text-[17px] sm:text-[19px] font-black leading-tight text-white tracking-tight">
          {isHi ? "फसल में कोई समस्या या बीमारी है?" : "Crop Disease or Pest Issue?"}
        </h2>
        <p className="mt-0.5 text-[11px] sm:text-[12px] font-medium leading-normal text-emerald-100/85">
          {isHi
            ? "फोटो खींचें या लक्षणों से पहचानें — तुरंत सटीक इलाज व असली दवा।"
            : "Snap photo or browse symptoms — get instant cure & verified medicine."}
        </p>
      </div>

      {/* Dual Split Cards: 1) Camera Photo Scan, 2) Symptoms & Disease Directory */}
      <div className="relative z-10 mt-3 grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Card 1: AI Camera Scan */}
        <AppLink
          href="/ai-doctor"
          onClick={() => track("tool_open", { href: "/ai-doctor", label: "home_photo_scan" })}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-emerald-400/30 bg-emerald-950/70 backdrop-blur-md shadow-md transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-950/90 hover:shadow-xl active:scale-[0.97]"
        >
          {/* Prominent Photo Window */}
          <div className="relative h-28 sm:h-34 w-full overflow-hidden bg-slate-900">
            <Image
              src="/images/home/home-cta-scan.jpg"
              alt={isHi ? "कैमरा से पत्ती की जाँच" : "Camera scan"}
              fill
              sizes="(max-width: 640px) 50vw, 240px"
              quality={85}
              priority
              className="object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105"
            />
            {/* Top floating glass badge */}
            <div className="absolute left-2 top-2 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/75 px-2 py-0.5 text-[9.5px] font-extrabold text-white backdrop-blur-md border border-white/20 shadow-xs">
                <Camera className="h-3 w-3 text-emerald-300 animate-pulse" />
                {isHi ? "कैमरा जाँच" : "Camera"}
              </span>
            </div>
            {/* Live AI Pill Top-Right */}
            <div className="absolute right-2 top-2 z-10">
              <span className="rounded-full bg-emerald-500/85 px-1.5 py-0.5 text-[8.5px] font-black text-slate-950 shadow-xs uppercase tracking-wider backdrop-blur-xs">
                AI 2s
              </span>
            </div>
            {/* Bottom edge transition */}
            <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-emerald-950/90 to-transparent" />
          </div>

          {/* Lower Content & High-Affordance CTA */}
          <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3 pt-1">
            <div>
              <h3 className="text-[13px] sm:text-[14px] font-black leading-tight text-white group-hover:text-emerald-200 transition-colors">
                {isHi ? "पत्ती की फोटो लें" : "Take Leaf Photo"}
              </h3>
              <p className="mt-0.5 text-[10px] sm:text-[10.5px] font-medium leading-tight text-emerald-100/80 line-clamp-1">
                {isHi ? "रोग पहचान व सही दवा" : "Diagnosis & medicine"}
              </p>
            </div>

            {/* Clickable Action Pill Button */}
            <div className="mt-2.5 flex items-center justify-between rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 px-2.5 py-1.5 text-[11px] font-black text-emerald-950 shadow-sm transition-all group-hover:from-emerald-300 group-hover:to-teal-200">
              <span>{isHi ? "फोटो खींचें" : "Take Photo"}</span>
              <Camera className="h-3.5 w-3.5 stroke-[2.5]" />
            </div>
          </div>
        </AppLink>

        {/* Card 2: Symptoms & Disease Catalog */}
        <AppLink
          href="/crop-problems"
          onClick={() => track("tool_open", { href: "/crop-problems", label: "home_browse_crop_problems" })}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-teal-400/30 bg-teal-950/70 backdrop-blur-md shadow-md transition-all duration-300 hover:border-teal-300 hover:bg-teal-950/90 hover:shadow-xl active:scale-[0.97]"
        >
          {/* Prominent Photo Window */}
          <div className="relative h-28 sm:h-34 w-full overflow-hidden bg-slate-900">
            <Image
              src="/images/home/home-job-crop-problems.jpg"
              alt={isHi ? "रोग व कीट डायरेक्टरी" : "Crop diseases catalog"}
              fill
              sizes="(max-width: 640px) 50vw, 240px"
              quality={85}
              priority
              className="object-cover object-[center_32%] transition-transform duration-500 group-hover:scale-105"
            />
            {/* Top floating glass badge */}
            <div className="absolute left-2 top-2 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/75 px-2 py-0.5 text-[9.5px] font-extrabold text-white backdrop-blur-md border border-white/20 shadow-xs">
                <ClipboardList className="h-3 w-3 text-teal-300" />
                {isHi ? "रोग लाइब्रेरी" : "Library"}
              </span>
            </div>
            {/* Crop tag Top-Right */}
            <div className="absolute right-2 top-2 z-10">
              <span className="rounded-full bg-teal-500/85 px-1.5 py-0.5 text-[8.5px] font-black text-slate-950 shadow-xs uppercase tracking-wider backdrop-blur-xs">
                {isHi ? "फसल अनुसार" : "By Crop"}
              </span>
            </div>
            {/* Bottom edge transition */}
            <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-teal-950/90 to-transparent" />
          </div>

          {/* Lower Content & High-Affordance CTA */}
          <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3 pt-1">
            <div>
              <h3 className="text-[13px] sm:text-[14px] font-black leading-tight text-white group-hover:text-teal-200 transition-colors">
                {isHi ? "लक्षणों से पहचानें" : "Identify by Crop"}
              </h3>
              <p className="mt-0.5 text-[10px] sm:text-[10.5px] font-medium leading-tight text-teal-100/80 line-clamp-1">
                {isHi ? "कीट व बीमारी डायरेक्टरी" : "Browse all pests"}
              </p>
            </div>

            {/* Clickable Action Pill Button */}
            <div className="mt-2.5 flex items-center justify-between rounded-xl bg-gradient-to-r from-teal-400 to-cyan-300 px-2.5 py-1.5 text-[11px] font-black text-teal-950 shadow-sm transition-all group-hover:from-teal-300 group-hover:to-cyan-200">
              <span>{isHi ? "डायरेक्टरी देखें" : "Directory"}</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </div>
          </div>
        </AppLink>
      </div>
    </div>
  );
}

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
    id: "fert",
    hi: "खाद कैलकुलेटर",
    en: "Fertilizer Calculator",
    hintHi: "फसल में कितना खाद पड़ेगा, सही हिसाब",
    hintEn: "Accurate fertilizer dose per acre",
    href: "/services/fertilizer-calculator",
    icon: Droplets,
    imageSrc: "/images/jobs/job-fertilizer.jpg",
  },
  {
    id: "mandi",
    hi: "मंडी भाव",
    en: "Mandi Rates",
    hintHi: "अपनी मंडी में फसल का ताज़ा भाव देखें",
    hintEn: "Live prices in nearest mandi",
    href: "/mandi",
    icon: TrendingUp,
    imageSrc: "/images/home/home-job-mandi.jpg",
  },
  {
    id: "schemes",
    hi: "सरकारी योजना व लोन",
    en: "Govt Schemes & Loan",
    hintHi: "सरकारी लोन और सब्सिडी की पूरी जानकारी",
    hintEn: "Farmer loans & subsidy guides",
    href: "/schemes",
    icon: Landmark,
    imageSrc: "/images/home/home-cta-schemes.jpg",
  },
  {
    id: "ask",
    hi: "विशेषज्ञ सलाह",
    en: "Field Advice",
    hintHi: "खेत के बारे में जो पूछना हो, विशेषज्ञ से पूछें",
    hintEn: "Ask any farming question to agronomist",
    href: "/ask-query",
    icon: MessageCircle,
    imageSrc: "/images/home/ask-expert-trust.jpg",
  },
];

const MORE_JOBS: {
  id: string;
  hi: string;
  en: string;
  subHi: string;
  subEn: string;
  href: string;
  imageSrc: string;
}[] = [
  {
    id: "farm",
    hi: "मेरा खेत",
    en: "My farm",
    subHi: "खेत प्रोफाइल व फसलें",
    subEn: "Farm profile & crops",
    href: "/my-farm",
    imageSrc: "/images/jobs/job-my-farm.jpg",
  },
  {
    id: "mix",
    hi: "दवा मिश्रण जांच (घोल सुरक्षा)",
    en: "Tank Mix Advisor",
    subHi: "दो दवाएँ मिलाने से पहले सुरक्षा जाँचें",
    subEn: "Check compatibility before mixing",
    href: "/mix-advisor",
    imageSrc: "/images/jobs/job-spray.jpg",
  },
  {
    id: "weeds",
    hi: "खरपतवार नियंत्रण",
    en: "Weeds Control",
    subHi: "घास व खरपतवार नाशक दवाएं",
    subEn: "Herbicide solutions",
    href: "/pest-diseases?type=weed",
    imageSrc: "/images/threats/threat-weed.jpg",
  },
  {
    id: "leaf",
    hi: "पत्ती पीली / खराब",
    en: "Nutrient Deficiencies",
    subHi: "पीले व बीमार पत्तों के पोषक तत्व",
    subEn: "Nutrient solutions",
    href: "/deficiencies",
    imageSrc: "/images/home/home-job-yellow-leaf.jpg",
  },
  {
    id: "plan",
    hi: "फसल प्लानर",
    en: "Crop Planner",
    subHi: "बुवाई से कटाई का पूरा कैलेंडर",
    subEn: "Sowing to harvest schedule",
    href: "/crop-calendar",
    imageSrc: "/images/home/home-job-plan.jpg",
  },
  {
    id: "alerts",
    hi: "खेत अलर्ट",
    en: "Farm alerts",
    subHi: "मौसम, कीट व स्प्रे चेतावनी",
    subEn: "Weather, pests & spray warnings",
    href: "/alerts",
    imageSrc: "/images/jobs/job-alerts.jpg",
  },
  {
    id: "spray-rotation",
    hi: "स्प्रे चक्र व डायरी",
    en: "Spray Rotation & Log",
    subHi: "दवा बदलने और स्प्रे डायरी का हिसाब",
    subEn: "Track MoA & spray logs",
    href: "/spray-rotation",
    imageSrc: "/images/jobs/job-spray-avoid.jpg",
  },
];


function daysSince(dateStr: string): number | null {
  if (!dateStr) return null;
  const sown = new Date(dateStr);
  if (Number.isNaN(sown.getTime())) return null;
  sown.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - sown.getTime()) / 86_400_000);
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

function fieldCard(field: FarmField, index: number) {
  const id = field.id || `field-${index}`;
  const crop = field.crop;
  const stage = field.stage;
  const name = field.name;
  const sowingDate = field.sowingDate;
  const cropSlug = field.cropSlug;
  const days = daysSince(sowingDate);
  const img = resolveCropImage({ slug: cropSlug || crop.toLowerCase(), name: crop });
  return { id, crop, cropSlug, stage, name, days, sowingDate, img, key: `${name}-${index}` };
}

export default function AgriVedaHome() {
  const { locale } = useLocale();
  const isHi = locale === "hi";
  const reduced = useReducedMotion();
  const { profile } = useFarmerProfile();
  const { weather, loading: weatherLoading, error: weatherError } = useLiveWeather();
  const { data: farm, setFields } = useFarmData();
  const { history: aiHistory } = useAIHistory();
  const lastScan = aiHistory[0];

  const handleUpdateSowingDate = (fieldId: string, newDateIso: string) => {
    const nextFields = farm.fields.map((f, i) => {
      if (f.id === fieldId || (!fieldId && i === 0)) {
        return {
          ...f,
          sowingDate: newDateIso,
          sowingDateIso: newDateIso,
        };
      }
      return f;
    });
    setFields(nextFields);
  };

  const name = profile.name.trim() || (isHi ? "किसान भाई" : "Kisan");

  const weatherIsSample = Boolean(weather?.isDemo || weatherError);

  const sourceFields = farm.fields.slice(0, 2);
  const extraFields = sourceFields.slice(1);
  const hasFields = sourceFields.length > 0;
  const primary = hasFields ? fieldCard(sourceFields[0], 0) : null;

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
      <FarmerAppTour />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-20px] top-0 h-[280px] overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(16,185,129,0.18),transparent_55%),radial-gradient(ellipse_at_90%_10%,rgba(180,140,70,0.1),transparent_45%),linear-gradient(180deg,#e8f6ee_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 space-y-4 px-0.5 pt-1">
        {/* Welcome + compact weather button + interactive Today's Task checklist */}
        <motion.section {...fade(0)} className="px-0.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-[var(--av-text-secondary)]">
                {isHi ? `नमस्ते, ${greetName} जी 🙏` : `Namaste, ${greetName} 🙏`}
              </p>
              <h1 className="mt-0.5 font-display text-[1.45rem] font-bold leading-tight tracking-tight text-[var(--av-text-primary)]">
                {isHi ? "आज क्या करना है?" : "What do you need today?"}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-semibold text-[var(--av-text-muted)]">
                  {new Date().toLocaleDateString(isHi ? "hi-IN" : "en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
            </div>
            <HomeWeatherButton weather={weather} loading={weatherLoading} isSample={weatherIsSample} />
          </div>
        </motion.section>

        <motion.section {...fade(0.015)}>
          {primary ? (
            <HomeCropStatusCard
              field={primary}
              isHi={isHi}
              onUpdateSowingDate={handleUpdateSowingDate}
            />
          ) : (
            <AppLink
              href="/my-farm"
              className="flex min-h-[64px] items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-500/35 bg-emerald-50/50 px-4 dark:bg-emerald-950/20"
            >
              <Sprout className="h-5 w-5 text-emerald-600" />
              <span className="text-[15px] font-bold text-emerald-800 dark:text-emerald-200">
                {isHi ? "अपनी फसल जोड़ो" : "Add your crop"}
              </span>
            </AppLink>
          )}
        </motion.section>

        {/* Unified Disease & Crop Doctor Module (AI photo + manual list in one place) */}
        <motion.section {...fade(0.02)}>
          <UnifiedDiseaseDoctorCard isHi={isHi} />
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
                  quality={50}
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/15" />
                <div className="relative flex h-full min-h-[148px] flex-col justify-end p-3.5">
                  <span className="mb-auto ml-auto flex h-7 w-7 items-center justify-center rounded-lg bg-black/35 text-white shadow-sm backdrop-blur-md border border-white/20">
                    <Icon className="h-4 w-4" strokeWidth={2.25} />
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

        {/* Premium Field Advisory Banner */}
        <motion.section {...fade(0.045)} className="px-0.5">
          <AppLink
            href="/field-advisor"
            onClick={() => track("tool_open", { href: "/field-advisor", label: "home_premium_advisor" })}
            className="group relative flex min-h-[100px] w-full overflow-hidden rounded-[1.35rem] shadow-lg active:scale-[0.99]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-sky-800" />
            <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay" />
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-teal-400/30 blur-2xl transition duration-500 group-hover:bg-teal-300/40" />
            
            <div className="relative z-10 flex w-full items-center gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                <Sparkles className="h-6 w-6 text-emerald-100" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[17px] font-extrabold tracking-tight text-white drop-shadow-sm">
                  {isHi ? "मेरी खेत सलाह" : "My Field Advice"}
                </h3>
                <p className="mt-0.5 text-[12px] font-medium text-emerald-50/90 leading-snug line-clamp-1">
                  {isHi ? "खेत के लिए आज की ज़रूरी टिप्स" : "Today's important tips for your farm"}
                </p>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm transition-transform group-hover:translate-x-1">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </AppLink>
        </motion.section>

        {lastScan ? (
          <motion.section {...fade(0.05)}>
            <AppLink
              href="/ai-doctor"
              className="flex items-center gap-3 overflow-hidden rounded-[1.35rem] border border-emerald-900/10 bg-[var(--av-surface)] p-3 shadow-[0_10px_28px_-18px_rgba(11,61,40,0.35)]"
            >
              {lastScan.thumbnailUrl && !lastScan.thumbnailUrl.startsWith("blob:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lastScan.thumbnailUrl}
                  alt=""
                  className="h-12 w-12 rounded-2xl object-cover"
                />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700">
                  <Sparkles className="h-4 w-4" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold text-emerald-800 dark:text-emerald-200">
                  {isHi ? "पिछला स्कैन" : "Last scan"}
                </span>
                <span className="block truncate text-[15px] font-bold text-[var(--av-text-primary)]">
                  {lastScan.result.diseaseName}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-[var(--av-text-muted)]" />
            </AppLink>
          </motion.section>
        ) : null}

        {/* Farm tools & utilities — clean balanced grid */}
        <motion.section {...fade(0.07)}>
          <div className="mb-3 px-1 mt-4">
            <h2 className="text-[16px] font-extrabold tracking-tight text-[var(--av-text-primary)]">
              {isHi ? "खेत के अन्य टूल्स (Farm Tools)" : "Farm Tools & Services"}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-2.5 px-0.5 sm:grid-cols-2">
            {MORE_JOBS.map((job) => (
              <AppLink
                key={job.id}
                href={job.href}
                onClick={() => track("tool_open", { href: job.href, label: `home_more_${job.id}` })}
                className="group flex items-center gap-3 overflow-hidden rounded-2xl border border-emerald-900/10 bg-[var(--av-surface)] p-2.5 shadow-[0_4px_16px_-8px_rgba(11,61,40,0.12)] transition hover:border-emerald-500/30 active:scale-[0.98] dark:border-emerald-800/20 dark:shadow-none"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-black/5 dark:border-white/5">
                  <Image
                    src={job.imageSrc}
                    alt=""
                    fill
                    sizes="48px"
                    quality={50}
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-[var(--av-text-primary)] group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                    {isHi ? job.hi : job.en}
                  </p>
                  <p className="truncate text-[11px] font-semibold text-[var(--av-text-muted)]">
                    {isHi ? job.subHi : job.subEn}
                  </p>
                </div>
                <div className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </AppLink>
            ))}
          </div>
        </motion.section>

        {extraFields.length > 0 ? (
          <motion.section {...fade(0.12)}>
            <div className="mb-2 flex items-center justify-between px-0.5">
              <h2 className="text-[14px] font-bold text-[var(--av-text-primary)]">
                {isHi ? "और खेत" : "More fields"}
              </h2>
              <AppLink href="/my-farm" className="text-[12px] font-bold text-[var(--av-accent)]">
                {isHi ? "सभी" : "All"}
              </AppLink>
            </div>
            <div className="space-y-2">
              {extraFields.map((field, index) => {
                const card = fieldCard(field, index + 1);
                return (
                  <AppLink
                    key={card.key}
                    href="/my-farm"
                    className="flex items-center gap-3 overflow-hidden rounded-[1.35rem] border border-emerald-900/10 bg-[var(--av-surface)] p-3 shadow-[0_10px_28px_-18px_rgba(11,61,40,0.35)]"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={card.img}
                        alt=""
                        fill
                        sizes="48px"
                        quality={45}
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold text-[var(--av-text-primary)]">
                        {cropChipLabel(card.cropSlug, card.crop)}
                      </p>
                      <p className="truncate text-[12px] text-[var(--av-text-muted)]">
                        {isHi ? farmerSpeak(card.stage) : card.stage}
                        {card.days != null
                          ? isHi
                            ? ` · ${card.days} दिन`
                            : ` · Day ${card.days}`
                          : ""}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[var(--av-text-muted)]" />
                  </AppLink>
                );
              })}
            </div>
          </motion.section>
        ) : null}

      </div>
    </div>
  );
}
