"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropHindiName, getCropImageUrl } from "@/lib/crops/crop-display";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import type { Crop } from "@/types/crop";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

const CATEGORY_LABEL_EN: Record<Crop["category"], string> = {
  Cereals: "Cereals",
  Millets: "Millets",
  Vegetables: "Vegetables",
  Pulses: "Pulses",
  Oilseeds: "Oilseeds",
  Spices: "Spices",
  Fruits: "Fruits",
  "Cash-Crops": "Cash Crops",
};

const CATEGORY_LABEL_HI: Record<Crop["category"], string> = {
  Cereals: "अनाज",
  Millets: "मिलेट",
  Vegetables: "सब्जी",
  Pulses: "दलहन",
  Oilseeds: "तिलहन",
  Spices: "मसाला",
  Fruits: "फल",
  "Cash-Crops": "नकदी फसल",
};

interface Props {
  crop: Crop;
}

export default function CropPremiumHero({ crop }: Props) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const reduceMotion = useReducedMotion();
  const cropImage = getCropImageUrl(crop);
  const hindiName = getCropHindiName(crop.slug);
  const title = hi && hindiName ? hindiName : crop.name;
  const subtitle = hi && hindiName ? crop.name : crop.scientificName;

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.slow, ease: EASE_OUT }}
      className="crop-premium-hero relative mb-4 overflow-hidden rounded-[20px] border border-emerald-500/15 p-3.5 sm:p-4"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/15 blur-3xl" />

      <div className="relative flex gap-3">
        <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 sm:h-[76px] sm:w-[76px]">
          <Image
            src={cropImage}
            alt={title}
            fill
            className="object-cover object-center"
            sizes="76px"
            priority
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="crop-premium-badge">
              {hi ? CATEGORY_LABEL_HI[crop.category] : CATEGORY_LABEL_EN[crop.category]}
            </span>
            {crop.suitableSeason && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                🌿 {crop.suitableSeason}
              </span>
            )}
          </div>
          <h1 className="mt-1 text-[clamp(1.25rem,4.2vw,1.7rem)] font-black leading-tight tracking-tight text-[var(--av-text-primary)]">
            {title}
          </h1>
          <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">{subtitle}</p>

          {/* Quick Crop Metrics Strip */}
          <div className="mt-2.5 flex flex-wrap gap-1.5 sm:gap-2">
            {crop.estimatedYield && (
              <div className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/20 bg-emerald-50/70 px-2 py-1 text-[11px] font-bold text-emerald-900 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-200 shadow-2xs">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">पैदावार:</span>
                <span>{crop.estimatedYield}</span>
              </div>
            )}
            {crop.durationDays && (
              <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white/80 px-2 py-1 text-[11px] font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-medium">अवधि:</span>
                <span>{crop.durationDays}</span>
              </div>
            )}
            {crop.sowingGuide?.bestSowingTime && (
              <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white/80 px-2 py-1 text-[11px] font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-medium">बुवाई:</span>
                <span>{crop.sowingGuide.bestSowingTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
