"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, Clock, CloudSun, Droplets, Sparkles, Sprout, TrendingUp } from "lucide-react";
import { getCropDashboard } from "@/data/crop-dashboard";
import { getCropHealthScore } from "@/lib/crops/crop-visual";
import { getCropImageUrl } from "@/lib/crops/crop-display";
import {
  getCropAgroMeta,
  getCropDiseaseRisk,
  getCropPestRisk,
} from "@/lib/crops/cropAgroMeta";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import type { Crop } from "@/types/crop";
import type { EnrichedCropDetail } from "@/types/crop-detail";

const CATEGORY_LABEL: Record<Crop["category"], string> = {
  Cereals: "Cereals",
  Vegetables: "Vegetables",
  Pulses: "Pulses",
  Millets: "Millets",
  "Cash-Crops": "Cash Crops",
};

interface Props {
  crop: Crop;
  detail: EnrichedCropDetail;
}

export default function CropPremiumHero({ crop, detail }: Props) {
  const reduceMotion = useReducedMotion();
  const cropImage = getCropImageUrl(crop);
  const health = getCropHealthScore(crop.slug);
  const dash = getCropDashboard(crop.slug);
  const agro = getCropAgroMeta(crop.slug);
  const pestRisk = getCropPestRisk(crop, detail);
  const diseaseRisk = getCropDiseaseRisk(crop, detail);
  const currentStage =
    dash?.growthStages.find((s) => s.status === "current")?.name ??
    detail.growthStages[0]?.title ??
    "Growing";

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.slow, ease: EASE_OUT }}
      className="crop-premium-hero relative overflow-hidden rounded-[28px] border border-emerald-500/15 p-5 sm:p-6"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 shadow-[0_8px_32px_rgba(16,185,129,0.2)]"
          >
            <Image
              src={cropImage}
              alt={crop.name}
              fill
              className="object-cover object-center"
              sizes="88px"
              priority
            />
          </motion.div>

          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <span className="crop-premium-badge">{CATEGORY_LABEL[crop.category]}</span>
              <span className="crop-premium-badge crop-premium-badge-muted">
                {detail.establishment === "transplant" ? "Transplant" : "Direct sown"}
              </span>
              <span className="crop-premium-badge crop-premium-badge-stage">
                <Sprout className="mr-1 h-3 w-3" />
                {currentStage}
              </span>
            </div>
            <h1 className="mt-2 text-[clamp(1.5rem,5vw,2rem)] font-black tracking-tight text-[var(--av-text-primary)]">
              {crop.name}
            </h1>
            <p className="mt-0.5 text-xs italic text-[var(--av-text-muted)]">{crop.scientificName}</p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 sm:flex-col">
          <div className="crop-premium-glass min-w-[100px] flex-1 p-3 sm:flex-none">
            <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">Health</p>
            <p
              className={`mt-0.5 text-xl font-black ${
                health.tone === "amber" ? "text-amber-500" : "text-emerald-500"
              }`}
            >
              {health.score}%
            </p>
            <p className="text-[10px] text-[var(--av-text-secondary)]">{health.label}</p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <motion.div
                className={`h-full rounded-full ${health.tone === "amber" ? "bg-amber-400" : "bg-emerald-400"}`}
                initial={{ width: 0 }}
                animate={{ width: `${health.score}%` }}
                transition={{ duration: 1, ease: EASE_OUT, delay: 0.2 }}
              />
            </div>
          </div>

          <div className="crop-premium-glass min-w-[100px] flex-1 p-3 sm:flex-none">
            <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
              <CloudSun className="h-3 w-3" /> Weather
            </p>
            <p className="mt-1 text-sm font-bold text-[var(--av-text-primary)]">32°C</p>
            <p className="text-[10px] text-[var(--av-text-secondary)]">Partly cloudy</p>
          </div>
        </div>
      </div>

      <p className="relative mt-4 text-sm leading-relaxed text-[var(--av-text-secondary)]">{crop.overview}</p>

      <div className="relative mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { icon: Clock, label: "Duration", value: crop.durationDays },
          { icon: TrendingUp, label: "Yield", value: crop.estimatedYield },
          { icon: Calendar, label: "Season", value: crop.suitableSeason },
          { icon: Droplets, label: "Water", value: agro.waterMm },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="crop-premium-stat">
              <Icon className="h-3.5 w-3.5 text-emerald-500" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">{stat.label}</p>
                <p className="text-xs font-semibold leading-snug text-[var(--av-text-primary)]" title={stat.label === "Water" ? agro.waterDetail : String(stat.value)}>
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`crop-premium-risk ${pestRisk.level === "high" ? "crop-premium-risk-amber" : "crop-premium-risk-lime"}`}
        >
          Pest: {pestRisk.top} · {pestRisk.pct}%
        </span>
        <span
          className={`crop-premium-risk ${diseaseRisk.level === "high" ? "crop-premium-risk-amber" : "crop-premium-risk-lime"}`}
        >
          Disease: {diseaseRisk.top} · {diseaseRisk.pct}%
        </span>
        <Link href="/ai-doctor" className="crop-premium-cta ml-auto">
          <Sparkles className="h-4 w-4" />
          AI Crop Doctor
        </Link>
      </div>
    </motion.section>
  );
}
