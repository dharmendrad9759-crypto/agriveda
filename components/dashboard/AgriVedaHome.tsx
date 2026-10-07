"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  ChevronRight,
  MessageCircle,
  Volume2,
  Sparkles,
  Sprout,
  TrendingUp,
  Droplets,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import CropProblemCard from "@/components/home/CropProblemCard";
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
import { HomeSprayPill, HomeWeatherButton } from "@/components/weather/HomeWeatherChip";
import { speakFarmer } from "@/components/ui/SpeakButton";
import { farmerSpeak } from "@/lib/crops/farmerSpeak";

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
    hi: "खाद कितनी?",
    en: "How much fertilizer?",
    hintHi: "बोरी में हिसाब",
    hintEn: "Bag doses",
    href: "/services/fertilizer-calculator",
    icon: Droplets,
    imageSrc: "/images/jobs/job-fertilizer.jpg",
  },
  {
    id: "mandi",
    hi: "आज का भाव",
    en: "Today's price",
    hintHi: "नज़दीकी मंडी",
    hintEn: "Nearest mandi",
    href: "/mandi",
    icon: TrendingUp,
    imageSrc: "/images/home/home-job-mandi.jpg",
  },
  {
    id: "schemes",
    hi: "सरकारी योजना",
    en: "Govt schemes",
    hintHi: "किसान मदद",
    hintEn: "Farmer help",
    href: "/schemes",
    icon: Landmark,
    imageSrc: "/images/home/home-cta-schemes.jpg",
  },
  {
    id: "ask",
    hi: "खेती सलाह",
    en: "Field advice",
    hintHi: "विशेषज्ञ से पूछो",
    hintEn: "Ask an expert",
    href: "/ask-query",
    icon: MessageCircle,
    imageSrc: "/images/home/ask-expert-trust.jpg",
  },
];

const MORE_JOBS: {
  id: string;
  hi: string;
  en: string;
  href: string;
  imageSrc: string;
}[] = [
  {
    id: "farm",
    hi: "मेरा खेत",
    en: "My farm",
    href: "/my-farm",
    imageSrc: "/images/jobs/job-my-farm.jpg",
  },
  {
    id: "pest",
    hi: "कीट और रोग",
    en: "Pests & disease",
    href: "/crop-problems",
    imageSrc: "/images/threats/threat-insect.jpg",
  },
  {
    id: "mix",
    hi: "दवा मिलाएँ",
    en: "Mix medicines",
    href: "/mix-advisor",
    imageSrc: "/images/jobs/job-spray.jpg",
  },
  {
    id: "weeds",
    hi: "खरपतवार",
    en: "Weeds",
    href: "/pest-diseases?type=weed",
    imageSrc: "/images/threats/threat-weed.jpg",
  },
  {
    id: "leaf",
    hi: "पत्ती पीली / खराब",
    en: "Yellow / sick leaf",
    href: "/deficiencies",
    imageSrc: "/images/home/home-job-yellow-leaf.jpg",
  },
  {
    id: "plan",
    hi: "फसल तरीका",
    en: "Crop method",
    href: "/crop-calendar",
    imageSrc: "/images/home/home-job-plan.jpg",
  },
  {
    id: "alerts",
    hi: "खेत अलर्ट",
    en: "Farm alerts",
    href: "/alerts",
    imageSrc: "/images/jobs/job-alerts.jpg",
  },
  {
    id: "spray-rotation",
    hi: "स्प्रे चक्र व लॉग",
    en: "Spray rotation log",
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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-20px] top-0 h-[280px] overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(16,185,129,0.18),transparent_55%),radial-gradient(ellipse_at_90%_10%,rgba(180,140,70,0.1),transparent_45%),linear-gradient(180deg,#e8f6ee_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 space-y-4 px-0.5 pt-1">
        {/* Welcome + compact weather button */}
        <motion.section {...fade(0)} className="px-0.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-[var(--av-text-secondary)]">
                {isHi ? `नमस्ते, ${greetName} जी 🙏` : `Namaste, ${greetName} 🙏`}
              </p>
              <h1 className="mt-0.5 font-display text-[1.45rem] font-bold leading-tight tracking-tight text-[var(--av-text-primary)]">
                {isHi ? "आज क्या करना है?" : "What do you need today?"}
              </h1>
              <p className="mt-0.5 text-[12px] font-semibold text-[var(--av-text-muted)]">
                {new Date().toLocaleDateString(isHi ? "hi-IN" : "en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
            <HomeWeatherButton weather={weather} loading={weatherLoading} isSample={weatherIsSample} />
          </div>
          <div className="mt-2.5">
            <HomeSprayPill weather={weather} loading={weatherLoading} isSample={weatherIsSample} />
          </div>
        </motion.section>

        <motion.section {...fade(0.015)}>
          {primary ? (
            <div className="overflow-hidden rounded-[1.35rem] border border-emerald-900/10 bg-[var(--av-surface)] shadow-[0_10px_28px_-18px_rgba(11,61,40,0.35)]">
              <div className="flex items-center gap-3 p-3">
                <AppLink
                  href={primary.cropSlug ? `/crops/${primary.cropSlug}` : "/my-farm"}
                  className="flex min-w-0 flex-1 items-center gap-3 active:opacity-80"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-1 ring-emerald-900/10">
                    <Image src={primary.img} alt="" fill sizes="64px" quality={75} className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[17px] font-bold leading-tight text-[var(--av-text-primary)]">
                        {cropChipLabel(primary.cropSlug, primary.crop)}
                      </p>
                      {primary.days != null ? (
                        <span className="shrink-0 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">
                          {isHi ? `${primary.days} दिन` : `Day ${primary.days}`}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[13px] font-medium leading-snug text-[var(--av-text-secondary)]">
                      {isHi ? farmerSpeak(primary.stage) : primary.stage}
                    </p>
                  </div>
                </AppLink>
                <button
                  type="button"
                  onClick={() =>
                    speakFarmer(
                      isHi
                        ? `मेरी फसल ${cropChipLabel(primary.cropSlug, primary.crop)}. ${
                            primary.days != null ? `बुवाई के ${primary.days} दिन बाद।` : ""
                          } ${farmerSpeak(primary.stage)}`
                        : `My crop ${primary.crop}. ${primary.days != null ? `Day ${primary.days}.` : ""} ${primary.stage}`,
                      isHi
                    )
                  }
                  aria-label={isHi ? "सुनें" : "Listen"}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 active:scale-95 dark:bg-emerald-950/40 dark:text-emerald-300"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>
              {primary.cropSlug ? (
                <AppLink
                  href={`/crops/${primary.cropSlug}/fertilizer-schedule`}
                  className="flex items-center gap-2 border-t border-emerald-900/8 bg-emerald-50/60 px-3.5 py-2.5 text-[13px] font-bold text-emerald-800 active:bg-emerald-100/70 dark:bg-emerald-950/25 dark:text-emerald-200"
                >
                  <Droplets className="h-4 w-4" />
                  <span className="flex-1">{isHi ? "अभी कौन-सी खाद डालें" : "Fertilizer for now"}</span>
                  <ChevronRight className="h-4 w-4" />
                </AppLink>
              ) : null}
            </div>
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

        {/* AI photo CTA */}
        <motion.section {...fade(0.02)}>
          <AppLink
            href="/ai-doctor"
            onClick={() => track("tool_open", { href: "/ai-doctor", label: "home_scan_cta" })}
            className="group relative flex min-h-[96px] w-full overflow-hidden rounded-2xl border border-emerald-800/20 bg-emerald-950 shadow-lg shadow-emerald-900/25 active:scale-[0.99]"
          >
            <span className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-1.5 bg-emerald-950 px-3.5 py-4 sm:px-5">
              <span className="inline-flex w-fit items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-100/90">
                <Camera className="h-3 w-3" />
                {isHi ? "AI जाँच" : "AI check"}
              </span>
              <span className="text-[16px] font-bold leading-snug text-white sm:text-[17px]">
                {isHi ? "फसल में बीमारी है? फोटो खींचो" : "Crop looks sick? Take a photo"}
              </span>
            </span>
            <span className="relative w-[48%] min-w-[140px] max-w-[240px] shrink-0 self-stretch sm:w-[52%] sm:max-w-[280px]">
              <Image
                src="/images/home/home-cta-scan.jpg"
                alt=""
                fill
                sizes="280px"
                quality={50}
                className="object-cover object-[center_28%] transition duration-300 group-hover:scale-105"
                priority
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-emerald-950 via-emerald-950/50 to-transparent sm:w-16"
              />
              <span className="absolute bottom-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-emerald-900 shadow-md">
                <Camera className="h-5 w-5" strokeWidth={2.4} />
              </span>
            </span>
          </AppLink>
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

        {/* फसल समस्या पहचानें — only new home insert under the 4 cards */}
        <motion.section {...fade(0.04)} className="mt-0">
          <CropProblemCard />
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
          <div className="mb-3 flex items-center justify-between px-1 mt-4">
            <h2 className="text-[16px] font-extrabold tracking-tight text-[var(--av-text-primary)]">
              {isHi ? "खेत के अन्य टूल्स (Farm Tools)" : "Farm Tools & Services"}
            </h2>
            <span className="text-[11px] font-semibold text-[var(--av-text-muted)]">
              {isHi ? "8 सुविधाएँ" : "8 Tools"}
            </span>
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
                    quality={40}
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-[var(--av-text-primary)] group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                    {isHi ? job.hi : job.en}
                  </p>
                  <p className="truncate text-[11px] font-semibold text-[var(--av-text-muted)]">
                    {isHi ? job.en : job.hi}
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
