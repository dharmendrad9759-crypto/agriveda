"use client";

import { useState } from "react";
import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Camera,
  ChevronRight,
  CloudSun,
  Droplets,
  FlaskConical,
  Landmark,
  Leaf,
  MessageCircle,
  NotebookPen,
  Ruler,
  Shield,
  Sprout,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { CropDoctorSparkleIcon } from "@/components/brand/icons";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useFarmData } from "@/hooks/useFarmData";
import { useActiveField } from "@/hooks/useActiveField";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { useAIHistory } from "@/hooks/useAIHistory";
import { useToast } from "@/components/ui/Toast";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { cropCatalog } from "@/data/crop-catalog";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import type { FarmField } from "@/lib/farm/types";
import { track } from "@/lib/analytics";
import { HomeWeatherButton } from "@/components/weather/HomeWeatherChip";
import FarmerAppTour from "@/components/tutorial/FarmerAppTour";
import HomeCropStatusCard from "@/components/dashboard/HomeCropStatusCard";
import HomeAddCropHero from "@/components/dashboard/HomeAddCropHero";
import MeasureAfterAddPrompt from "@/components/farm/MeasureAfterAddPrompt";
import { farmerSpeak } from "@/lib/crops/farmerSpeak";
import { useClientReady, useSafeReducedMotion } from "@/hooks/useClientReady";
import { suggestFieldName } from "@/lib/farm/fieldName";
import { fieldAdvisorHref } from "@/lib/farm/fieldLinks";
import { parseAreaAcres } from "@/lib/farm/farmInit";
import { soilForPlace } from "@/lib/farm/placeProfile";



/** Unified Crop Disease & Doctor Hero Card — 2-Column Split Photo Cards, High-Affordance, Futuristic & Clean */
function UnifiedDiseaseDoctorCard({ isHi }: { isHi: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-emerald-500/20 bg-gradient-to-br from-[#063320] via-[#042416] to-[#02180e] p-3.5 sm:p-4 text-white shadow-[0_16px_36px_-12px_rgba(2,24,14,0.5)]">
      {/* Header section — Clean badges + punchy heading */}
      <h2 className="relative z-10 text-[15px] font-bold leading-snug text-white">
        {isHi ? "फसल में कोई समस्या या बीमारी है?" : "Crop disease or pest?"}
      </h2>

      {/* Dual Split Cards: 1) Camera Photo Scan, 2) Symptoms & Disease Directory */}
      <div className="relative z-10 mt-3 grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Card 1: AI Camera Scan */}
        <AppLink
          id="tour-home-camera-card"
          href="/ai-doctor"
          onClick={() => track("tool_open", { href: "/ai-doctor", label: "home_photo_scan" })}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-emerald-400/30 bg-emerald-950/70 backdrop-blur-md shadow-md transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-950/90 hover:shadow-xl active:scale-[0.97]"
        >
          {/* Prominent Photo Window */}
          <div className="relative h-34 sm:h-40 w-full overflow-hidden bg-slate-900">
            <Image
              src="/images/home/home-cta-scan.jpg"
              alt={isHi ? "कैमरा से पत्ती की जाँच" : "Camera scan"}
              fill
              sizes="(max-width: 640px) 50vw, 240px"
              quality={85}
              priority
              className="object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-emerald-950/90 to-transparent" />
          </div>

          {/* Lower Content & High-Affordance CTA */}
          <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3 pt-1.5">
            <div>
              <h3 className="text-[13px] font-bold leading-tight text-white">
                {isHi ? "पत्ती की फोटो लें" : "Take Leaf Photo"}
              </h3>
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
          <div className="relative h-34 sm:h-40 w-full overflow-hidden bg-slate-900">
            <Image
              src="/images/home/home-job-crop-problems.jpg"
              alt={isHi ? "रोग व कीट डायरेक्टरी" : "Crop diseases catalog"}
              fill
              sizes="(max-width: 640px) 50vw, 240px"
              quality={85}
              priority
              className="object-cover object-[center_32%] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-teal-950/90 to-transparent" />
          </div>

          {/* Lower Content & High-Affordance CTA */}
          <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3 pt-1.5">
            <div>
              <h3 className="text-[13px] font-bold leading-tight text-white">
                {isHi ? "लक्षणों से पहचानें" : "Identify by Symptoms"}
              </h3>
            </div>

            {/* Clickable Action Pill Button */}
            <div className="mt-2.5 flex items-center justify-between rounded-xl bg-gradient-to-r from-teal-400 to-cyan-300 px-2.5 py-1.5 text-[11px] font-black text-teal-950 shadow-sm transition-all group-hover:from-teal-300 group-hover:to-cyan-200">
              <span>{isHi ? "रोग देखें" : "View Diseases"}</span>
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
    id: "ask",
    hi: "विशेषज्ञ से पूछें",
    en: "Ask an Expert",
    hintHi: "खेत का सवाल पूछें, जवाब पाएँ",
    hintEn: "Ask any farming question",
    href: "/ask-query",
    icon: MessageCircle,
    imageSrc: "/images/home/ask-expert-trust.jpg",
  },
  {
    id: "schemes",
    hi: "सरकारी योजना",
    en: "Govt Schemes",
    hintHi: "लोन और सब्सिडी की जानकारी",
    hintEn: "Loans and subsidy guides",
    href: "/schemes",
    icon: Landmark,
    imageSrc: "/images/home/home-cta-schemes.jpg",
  },
];

interface FarmToolItem {
  id: string;
  hi: string;
  en: string;
  subHi: string;
  subEn: string;
  href: string;
  imageSrc: string;
  icon: LucideIcon;
}

interface FarmToolCategory {
  id: string;
  titleHi: string;
  titleEn: string;
  items: FarmToolItem[];
}

const FARM_TOOL_CATEGORIES: FarmToolCategory[] = [
  {
    id: "protection",
    titleHi: "फसल सुरक्षा",
    titleEn: "Crop Protection",
    items: [
      {
        id: "mix",
        hi: "दवा घोल जांच",
        en: "Spray Mix Safety",
        subHi: "दो दवाएँ मिलाने से पहले सुरक्षा जाँचें",
        subEn: "Check compatibility before mixing",
        href: "/mix-advisor",
        imageSrc: "/images/jobs/tool-mix.jpg",
        icon: FlaskConical,
      },
      {
        id: "weeds",
        hi: "खरपतवार नियंत्रण",
        en: "Weeds Control",
        subHi: "घास व खरपतवार नाशक दवाएं",
        subEn: "Herbicide solutions",
        href: "/pest-diseases?type=weed",
        imageSrc: "/images/jobs/tool-weeds.jpg",
        icon: Sprout,
      },
      {
        id: "spray-rotation",
        hi: "स्प्रे डायरी",
        en: "Spray Diary",
        subHi: "दवा बदलने और स्प्रे डायरी का हिसाब",
        subEn: "Track MoA & spray logs",
        href: "/spray-rotation",
        imageSrc: "/images/jobs/tool-diary.jpg",
        icon: NotebookPen,
      },
      {
        id: "leaf",
        hi: "पत्ती पीली",
        en: "Nutrient Deficiencies",
        subHi: "पीले व बीमार पत्तों के पोषक तत्व",
        subEn: "Nutrient solutions",
        href: "/deficiencies",
        imageSrc: "/images/jobs/job-yellow-leaf-v2.jpg",
        icon: Leaf,
      },
    ],
  },
  {
    id: "management",
    titleHi: "खेत प्रबंधन",
    titleEn: "Farm Management",
    items: [
      {
        id: "field-measure",
        hi: "खेत नापें",
        en: "Measure Field",
        subHi: "उपग्रह व GPS से सटीक रकबा नापें",
        subEn: "Measure exact area with Satellite & GPS",
        href: "/my-farm/measure",
        imageSrc: "/images/jobs/tool-measure-v3.jpg",
        icon: Ruler,
      },
      {
        id: "plan",
        hi: "फसल प्लानर",
        en: "Crop Planner",
        subHi: "बुवाई से कटाई का पूरा कैलेंडर",
        subEn: "Sowing to harvest schedule",
        href: "/crop-calendar",
        imageSrc: "/images/jobs/tool-planner-v5.jpg",
        icon: CalendarDays,
      },
      {
        id: "alerts",
        hi: "खेत अलर्ट",
        en: "Farm Alerts",
        subHi: "मौसम, कीट व स्प्रे चेतावनी",
        subEn: "Weather, pests & spray warnings",
        href: "/alerts",
        imageSrc: "/images/jobs/tool-alerts-v3.jpg",
        icon: Bell,
      },
      {
        id: "weather",
        hi: "मौसम",
        en: "Weather",
        subHi: "बारिश, तापमान व स्प्रे विंडो",
        subEn: "Rain, temperature & spray window",
        href: "/weather",
        imageSrc: "/images/jobs/tool-weather-v3.jpg",
        icon: CloudSun,
      },
    ],
  },
];

const PROTECT_ROW: Record<string, { wash: string; frame: string }> = {
  mix: { wash: "bg-amber-50 dark:bg-amber-950/35", frame: "rounded-[22px]" },
  weeds: { wash: "bg-lime-50 dark:bg-lime-950/30", frame: "rounded-full" },
  "spray-rotation": { wash: "bg-stone-100 dark:bg-stone-800/60", frame: "rounded-lg" },
  leaf: { wash: "bg-yellow-50 dark:bg-yellow-950/30", frame: "rounded-[42%_58%_48%_52%]" },
};

const MANAGE_STAMP: Record<string, { ring: string; focus: string }> = {
  plan: { ring: "ring-amber-500/70", focus: "bg-[#f6f1e7] object-contain object-center" },
  alerts: { ring: "ring-rose-500/70", focus: "object-cover object-[34%_center]" },
  weather: { ring: "ring-sky-500/70", focus: "object-cover object-center" },
};

function FarmToolSuites({ isHi }: { isHi: boolean }) {
  const protection = FARM_TOOL_CATEGORIES[0];
  const management = FARM_TOOL_CATEGORIES[1];
  const measure = management.items[0];
  const stamps = management.items.slice(1);

  return (
    <div className="space-y-3.5">
      <section className="rounded-[28px] border border-[var(--av-border)] bg-[var(--av-surface)] p-3">
        <div className="mb-2.5 flex items-start justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Shield className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <div>
              <p className="text-[15px] font-bold leading-tight text-[var(--av-text-primary)]">
                {isHi ? protection.titleHi : protection.titleEn}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {protection.items.map((job) => {
            const tone = PROTECT_ROW[job.id] ?? PROTECT_ROW.mix;
            return (
              <AppLink
                key={job.id}
                href={job.href}
                onClick={() => track("tool_open", { href: job.href, label: `home_more_${job.id}` })}
                className={cn(
                  "flex items-center gap-3 rounded-[22px] p-1.5 pr-2.5 transition active:scale-[0.99]",
                  tone.wash
                )}
              >
                <span className={cn("relative h-[68px] w-[68px] shrink-0 overflow-hidden bg-black/10", tone.frame)}>
                  <Image
                    src={job.imageSrc}
                    alt=""
                    fill
                    sizes="68px"
                    quality={75}
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1 py-1">
                  <span className="block text-[14px] font-bold leading-tight text-[var(--av-text-primary)]">
                    {isHi ? job.hi : job.en}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-[var(--av-text-secondary)]">
                    {isHi ? job.subHi : job.subEn}
                  </span>
                </span>
              </AppLink>
            );
          })}
        </div>
      </section>

      <section className="rounded-[28px] border border-[var(--av-border)] bg-[var(--av-surface-muted)] p-3">
        <div className="mb-2.5 flex items-center gap-2 px-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-700 text-white">
            <Ruler className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <div>
            <p className="text-[15px] font-bold leading-tight text-[var(--av-text-primary)]">
              {isHi ? management.titleHi : management.titleEn}
            </p>
          </div>
        </div>

        <AppLink
          href={measure.href}
          onClick={() => track("tool_open", { href: measure.href, label: "home_more_field-measure" })}
          className="flex min-h-[124px] overflow-hidden rounded-[24px] border border-[var(--av-border)] bg-[var(--av-surface)] active:scale-[0.99]"
        >
          <span className="flex min-w-0 flex-1 flex-col justify-between p-3.5">
            <span>
              <span className="block text-[15px] font-bold leading-tight text-[var(--av-text-primary)]">
                {isHi ? measure.hi : measure.en}
              </span>
              <span className="mt-1 block text-[12px] leading-snug text-[var(--av-text-secondary)]">
                {isHi ? measure.subHi : measure.subEn}
              </span>
            </span>
          </span>
          <span className="relative w-[46%] shrink-0">
            <Image
              src={measure.imageSrc}
              alt=""
              fill
              sizes="180px"
              quality={75}
              className="object-cover object-[center_68%]"
            />
          </span>
        </AppLink>

        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {stamps.map((job) => (
            <AppLink
              key={job.id}
              href={job.href}
              onClick={() => track("tool_open", { href: job.href, label: `home_more_${job.id}` })}
              className="flex flex-col items-center rounded-[22px] bg-[var(--av-surface)] px-1.5 pb-2.5 pt-2.5 text-center active:scale-[0.98]"
            >
              <span
                className={cn(
                  "relative h-[92px] w-full overflow-hidden rounded-2xl ring-[3px]",
                  MANAGE_STAMP[job.id]?.ring ?? "ring-sky-500/70"
                )}
              >
                <Image
                  src={job.imageSrc}
                  alt=""
                  fill
                  sizes="160px"
                  quality={75}
                  className={MANAGE_STAMP[job.id]?.focus ?? "object-cover"}
                />
              </span>
              <span className="mt-2 text-[13px] font-bold leading-tight text-[var(--av-text-primary)]">
                {isHi ? job.hi : job.en}
              </span>
            </AppLink>
          ))}
        </div>
      </section>
    </div>
  );
}

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
  const sowingDate = field.sowingDateIso || field.sowingDate;
  const cropSlug = field.cropSlug;
  const days = daysSince(sowingDate);
  const img = resolveCropImage({ slug: cropSlug || crop.toLowerCase(), name: crop });
  const areaAcres =
    typeof field.areaAcres === "number" && field.areaAcres > 0
      ? field.areaAcres
      : parseAreaAcres(field.area) || undefined;
  return {
    id,
    crop,
    cropSlug,
    stage,
    name,
    days,
    sowingDate,
    sowingDateIso: field.sowingDateIso,
    areaAcres,
    img,
    key: `${id}-${index}`,
  };
}

export default function AgriVedaHome() {
  const { locale } = useLocale();
  const isHi = locale === "hi";
  const ready = useClientReady();
  const reduced = useSafeReducedMotion();
  const { profile, setSowingDate } = useFarmerProfile();
  const todayLabel = ready
    ? new Date().toLocaleDateString(isHi ? "hi-IN" : "en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : null;
  const { showToast } = useToast();
  const { weather, loading: weatherLoading, error: weatherError } = useLiveWeather();
  const { data: farm, setFields, addField, hydrated: farmHydrated } = useFarmData();
  const { activeField, setActiveField } = useActiveField(farm.fields, farmHydrated);
  const { history: aiHistory } = useAIHistory();
  const lastScan = aiHistory[0];
  const [measurePromptId, setMeasurePromptId] = useState<string | null>(null);

  const handleUpdateSowingDate = (fieldId: string, newDateIso: string) => {
    const target = farm.fields.find((f) => f.id === fieldId) ?? farm.fields[0];
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
    const slug = target?.cropSlug;
    if (slug) setSowingDate(slug, newDateIso);
  };

  const handleAddCropFromHome = (cropSlug: string, cropName: string, sowingDateIso?: string) => {
    const sDate = sowingDateIso || new Date().toISOString().split("T")[0];
    const cropHi = getCropHindiName(cropSlug) || cropName;
    const id = addField({
      name: suggestFieldName({
        existing: farm.fields,
        cropHi,
        village: profile.village,
      }),
      area: "1.0 एकड़",
      ownership: "Owned",
      crop: cropName,
      cropSlug,
      status: "Active",
      sowingDate: sDate,
      sowingDateIso: sDate,
      emoji: "🌱",
      stage: "सक्रिय",
      soilType: soilForPlace(profile.state, profile.district) || undefined,
      placeState: profile.state || undefined,
      placeDistrict: profile.district || undefined,
    });
    setActiveField(id);
    if (cropSlug) setSowingDate(cropSlug, sDate);
    setMeasurePromptId(id);
  };

  const handleSelectField = (fieldId: string) => {
    setActiveField(fieldId);
  };

  const handleChangeCrop = (cropSlug: string, cropName: string) => {
    const existing = farm.fields.find(
      (f) =>
        (f.cropSlug && f.cropSlug.toLowerCase() === cropSlug.toLowerCase()) ||
        f.crop.toLowerCase() === cropName.toLowerCase()
    );

    if (existing) {
      setActiveField(existing.id);
    } else if (activeField) {
      const nextFields = farm.fields.map((f) =>
        f.id === activeField.id ? { ...f, crop: cropName, cropSlug } : f
      );
      setFields(nextFields);
    } else {
      handleAddCropFromHome(cropSlug, cropName);
    }
    showToast(
      isHi ? `सक्रिय फसल बदली: ${cropName} ✓` : `Active crop changed: ${cropName} ✓`,
      "success"
    );
  };

  const name = profile.name.trim() || (isHi ? "किसान भाई" : "Kisan");

  const weatherIsSample = Boolean(weather?.isDemo || weatherError);

  const extraFields = farm.fields.filter((f) => f.id !== activeField?.id).slice(0, 2);
  const primary = activeField ? fieldCard(activeField, 0) : null;
  const adviceHref = activeField ? fieldAdvisorHref(activeField) : "/field-advisor";

  const greetName = name.trim()
    ? name.trim().charAt(0).toUpperCase() + name.trim().slice(1)
    : name;

  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: false as const,
          animate: { y: 0 },
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

      <div className="relative z-10 space-y-3 px-0.5 pt-1">
        {/* Welcome + compact weather button + interactive Today's Task checklist */}
        <motion.section {...fade(0)} className="px-0.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-[var(--av-text-secondary)]">
                {isHi ? `नमस्ते, ${greetName} जी 🙏` : `Namaste, ${greetName} 🙏`}
              </p>
              <h1 className="mt-0.5 font-display text-[1.15rem] font-bold leading-tight text-[var(--av-text-primary)]">
                {isHi ? "आज क्या करना है?" : "What do you need today?"}
              </h1>
              {todayLabel ? (
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-[12px] font-semibold text-[var(--av-text-muted)]" suppressHydrationWarning>
                    {todayLabel}
                  </span>
                </div>
              ) : (
                <div className="mt-1 h-[18px]" aria-hidden />
              )}
            </div>
            <HomeWeatherButton weather={weather} loading={weatherLoading} isSample={weatherIsSample} />
          </div>
        </motion.section>

        <motion.section {...fade(0.015)}>
          {!farmHydrated ? (
            <div className="h-[76px] rounded-[1.35rem] border border-emerald-900/10 bg-[var(--av-surface)]" aria-hidden />
          ) : primary ? (
            <HomeCropStatusCard
              field={primary}
              isHi={isHi}
              adviceHref={adviceHref}
              onUpdateSowingDate={handleUpdateSowingDate}
              onChangeCrop={handleChangeCrop}
              onSelectField={handleSelectField}
              allFields={farm.fields}
            />
          ) : (
            <HomeAddCropHero
              isHi={isHi}
              onAddCrop={handleAddCropFromHome}
            />
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
                  <CropDoctorSparkleIcon className="h-4 w-4" />
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

        <motion.section {...fade(0.07)} className="space-y-2.5 pt-0.5">
          <h2 className="px-1 text-[15px] font-semibold tracking-tight text-[var(--av-text-primary)]">
            {isHi ? "खेत के टूल्स" : "Farm Tools"}
          </h2>
          <FarmToolSuites isHi={isHi} />
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
                    href={`/my-farm/${card.id}`}
                    onClick={() => setActiveField(card.id)}
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
      <MeasureAfterAddPrompt
        fieldId={measurePromptId}
        isHi={isHi}
        onDismiss={() => setMeasurePromptId(null)}
      />
    </div>
  );
}
