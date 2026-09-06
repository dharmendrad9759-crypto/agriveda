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
          <div className="flex flex-wrap gap-1.5">
            <span className="crop-premium-badge">
              {hi ? CATEGORY_LABEL_HI[crop.category] : CATEGORY_LABEL_EN[crop.category]}
            </span>
          </div>
          <h1 className="mt-1 text-[clamp(1.25rem,4.2vw,1.7rem)] font-black leading-tight tracking-tight text-[var(--av-text-primary)]">
            {title}
          </h1>
          <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">{subtitle}</p>
        </div>
      </div>
    </motion.section>
  );
}
