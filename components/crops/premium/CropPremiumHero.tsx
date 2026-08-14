"use client";

import { getCropDashboard } from "@/data/crop-dashboard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropHindiName, getCropImageUrl } from "@/lib/crops/crop-display";
import {
  getCropAgroMeta,
  getCropDiseaseRisk,
  getCropPestRisk,
} from "@/lib/crops/cropAgroMeta";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import type { Crop } from "@/types/crop";
import type { EnrichedCropDetail } from "@/types/crop-detail";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, Clock, CloudSun, Droplets, Sparkles, Sprout, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CATEGORY_LABEL_EN: Record<Crop["category"], string> = {
  Cereals: "Cereals",
  Vegetables: "Vegetables",
  Pulses: "Pulses",
  Millets: "Millets",
  "Cash-Crops": "Cash Crops",
};

const CATEGORY_LABEL_HI: Record<Crop["category"], string> = {
  Cereals: "अनाज",
  Vegetables: "सब्जी",
  Pulses: "दलहन",
  Millets: "मिलेट",
  "Cash-Crops": "नकदी फसल",
};

interface Props {
  crop: Crop;
  detail: EnrichedCropDetail;
}

export default function CropPremiumHero({ crop, detail }: Props) {
  const { t, locale } = useLocale();
  const hi = locale === "hi";
  const reduceMotion = useReducedMotion();
  const cropImage = getCropImageUrl(crop);
  const dash = getCropDashboard(crop.slug);
  const agro = getCropAgroMeta(crop.slug);
  const pestRisk = getCropPestRisk(crop, detail);
  const diseaseRisk = getCropDiseaseRisk(crop, detail);
  const hindiName = getCropHindiName(crop.slug);
  const watchLevel =
    pestRisk.level === "high" || diseaseRisk.level === "high"
      ? ("amber" as const)
      : pestRisk.level === "medium" || diseaseRisk.level === "medium"
        ? ("amber" as const)
        : ("emerald" as const);
  const watchLabel = watchLevel === "amber" ? t("cropScoutWeek") : t("cropGuideReady");
  const currentStage =
    dash?.growthStages.find((s) => s.status === "current")?.name ??
    detail.growthStages[0]?.title ??
    crop.fertilizerSchedule.stageWise[0]?.stage ??
    (hi ? "स्थापना" : "Establishment");

  const title =
    hi && hindiName ? hindiName : crop.name;
  const subtitle =
    hi && hindiName ? `${crop.name} · ${crop.scientificName}` : crop.scientificName;

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.slow, ease: EASE_OUT }}
      className="crop-premium-hero relative overflow-hidden rounded-[24px] border border-emerald-500/15 p-4 sm:p-5"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative flex gap-3">
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 shadow-[0_8px_28px_rgba(16,185,129,0.2)] sm:h-[84px] sm:w-[84px]"
        >
          <Image
            src={cropImage}
            alt={crop.name}
            fill
            className="object-cover object-center"
            sizes="84px"
            priority
          />
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-1.5">
            <span className="crop-premium-badge">
              {hi ? CATEGORY_LABEL_HI[crop.category] : CATEGORY_LABEL_EN[crop.category]}
            </span>
            {crop.isStub ? (
              <span className="crop-premium-badge crop-premium-badge-muted">
                {hi ? "संक्षिप्त गाइड" : "Brief guide"}
              </span>
            ) : null}
            <span className="crop-premium-badge crop-premium-badge-muted">
              {detail.establishment === "transplant" ? t("cropTransplant") : t("cropDirectSown")}
            </span>
            <span className="crop-premium-badge crop-premium-badge-stage">
              <Sprout className="mr-1 h-3 w-3" />
              {currentStage}
            </span>
          </div>
          <h1 className="mt-1.5 text-[clamp(1.35rem,4.5vw,1.85rem)] font-black leading-tight tracking-tight text-[var(--av-text-primary)]">
            {title}
          </h1>
          <p className="mt-0.5 text-[11px] italic text-[var(--av-text-muted)]">{subtitle}</p>
        </div>
      </div>

      {/* At-a-glance strip */}
      <div className="relative mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="crop-premium-glass p-2.5">
          <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
            {t("cropFieldFocus")}
          </p>
          <p
            className={`mt-0.5 text-sm font-black ${
              watchLevel === "amber" ? "text-amber-500" : "text-emerald-500"
            }`}
          >
            {watchLabel}
          </p>
          <p className="text-[10px] text-[var(--av-text-secondary)]">
            {t("cropWatch")}: {pestRisk.top.split(" ")[0]} / {diseaseRisk.top.split(" ")[0]}
          </p>
        </div>
        <div className="crop-premium-glass p-2.5">
          <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
            <CloudSun className="h-3 w-3" /> {t("cropClimate")}
          </p>
          <p className="mt-0.5 text-sm font-bold text-[var(--av-text-primary)]">
            {agro.tempMinC}–{agro.tempMaxC}°C
          </p>
          <p className="line-clamp-1 text-[10px] text-[var(--av-text-secondary)]">{crop.suitableSeason}</p>
        </div>
        <Link href="/weather" className="crop-premium-glass flex items-center gap-2 p-2.5 active:scale-[0.98]">
          <CloudSun className="h-4 w-4 shrink-0 text-cyan-500" />
          <span className="text-xs font-bold text-[var(--av-text-primary)]">{t("cropLiveWeather")}</span>
        </Link>
        <Link href="/ai-doctor" className="crop-premium-glass flex items-center gap-2 p-2.5 active:scale-[0.98]">
          <Sparkles className="h-4 w-4 shrink-0 text-emerald-500" />
          <span className="text-xs font-bold text-[var(--av-text-primary)]">{t("cropAiDoctor")}</span>
        </Link>
      </div>

      <div className="relative mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { icon: Clock, label: t("cropDuration"), value: crop.durationDays },
          { icon: TrendingUp, label: t("cropYield"), value: crop.estimatedYield },
          { icon: Calendar, label: t("cropSeason"), value: crop.suitableSeason },
          { icon: Droplets, label: t("cropWater"), value: agro.waterMm },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="crop-premium-stat !py-2">
              <Icon className="h-3.5 w-3.5 text-emerald-500" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
                  {stat.label}
                </p>
                <p
                  className="text-xs font-semibold leading-snug text-[var(--av-text-primary)]"
                  title={stat.label === t("cropWater") ? agro.waterDetail : String(stat.value)}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative mt-3 flex flex-wrap items-center gap-1.5">
        <span
          className={`crop-premium-risk ${pestRisk.level === "high" ? "crop-premium-risk-amber" : "crop-premium-risk-lime"}`}
        >
          {t("cropPestRisk")}: {pestRisk.top}
        </span>
        <span
          className={`crop-premium-risk ${diseaseRisk.level === "high" ? "crop-premium-risk-amber" : "crop-premium-risk-lime"}`}
        >
          {t("cropDiseaseRisk")}: {diseaseRisk.top}
        </span>
      </div>
    </motion.section>
  );
}
