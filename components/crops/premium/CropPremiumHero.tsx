"use client";

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
import { Calendar, Clock, Droplets, TrendingUp } from "lucide-react";
import Image from "next/image";
import CropMandiPriceStrip from "@/components/crops/premium/CropMandiPriceStrip";

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
  const agro = getCropAgroMeta(crop.slug);
  const pestRisk = getCropPestRisk(crop, detail);
  const diseaseRisk = getCropDiseaseRisk(crop, detail);
  const hindiName = getCropHindiName(crop.slug);
  const watchHot =
    pestRisk.level === "high" ||
    diseaseRisk.level === "high" ||
    pestRisk.level === "medium" ||
    diseaseRisk.level === "medium";

  const title = hi && hindiName ? hindiName : crop.name;
  const subtitle = hi && hindiName ? crop.name : crop.scientificName;

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.slow, ease: EASE_OUT }}
      className="crop-premium-hero relative overflow-hidden rounded-[20px] border border-emerald-500/15 p-3.5 sm:p-4"
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
          <div className="flex flex-wrap gap-1.5">
            <span className="crop-premium-badge">
              {hi ? CATEGORY_LABEL_HI[crop.category] : CATEGORY_LABEL_EN[crop.category]}
            </span>
          </div>
          <h1 className="mt-1 text-[clamp(1.25rem,4.2vw,1.7rem)] font-black leading-tight tracking-tight text-[var(--av-text-primary)]">
            {title}
          </h1>
          <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">{subtitle}</p>
          <p
            className={`mt-1.5 text-[11px] font-bold ${
              watchHot ? "text-amber-600" : "text-emerald-600"
            }`}
          >
            {watchHot
              ? hi
                ? `इस हफ्ते देखें · ${pestRisk.top.split(" ")[0]} / ${diseaseRisk.top.split(" ")[0]}`
                : `Watch this week · ${pestRisk.top.split(" ")[0]} / ${diseaseRisk.top.split(" ")[0]}`
              : hi
                ? "गाइड तैयार · खेत साफ रखें"
                : "Guide ready · keep field clean"}
          </p>
        </div>
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
                <p className="line-clamp-1 text-xs font-semibold leading-snug text-[var(--av-text-primary)]">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <CropMandiPriceStrip cropSlug={crop.slug} />
    </motion.section>
  );
}
