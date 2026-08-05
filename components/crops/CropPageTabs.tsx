"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import { CROP_TABS, type CropTabId } from "@/lib/crops/crop-tabs";
import type { FarmerUiKey } from "@/lib/i18n/farmer-ui";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { motion, useReducedMotion } from "framer-motion";

/** Real farm photos — look and tap, not icon illustrations */
const TAB_PHOTO: Record<CropTabId, string> = {
  overview: "/images/jobs/job-crops-hero.jpg",
  growth: "/images/jobs/job-my-farm.jpg",
  fertilizer: "/images/jobs/job-fertilizer.jpg",
  pests: "/images/threats/threat-insect.jpg",
  diseases: "/images/threats/threat-disease.jpg",
  nutrients: "/images/home/home-job-yellow-leaf.jpg",
  irrigation: "/images/home/home-job-weather.jpg",
  weeds: "/images/threats/threat-weed.jpg",
  calendar: "/images/jobs/job-my-farm.jpg",
  varieties: "/images/jobs/job-crops-hero.jpg",
  harvest: "/images/jobs/job-crops-hero.jpg",
  faq: "/images/home/ask-expert-trust.jpg",
  expert: "/images/home/home-job-ask.jpg",
};

const TAB_I18N: Record<CropTabId, FarmerUiKey> = {
  overview: "cropTabOverview",
  growth: "cropTabGrowth",
  fertilizer: "cropTabFertilizer",
  pests: "cropTabPests",
  diseases: "cropTabDiseases",
  nutrients: "cropTabNutrients",
  irrigation: "cropTabIrrigation",
  weeds: "cropTabWeeds",
  calendar: "cropTabCalendar",
  varieties: "cropTabVarieties",
  harvest: "cropTabHarvest",
  faq: "cropTabFaq",
  expert: "cropTabExpert",
};

interface CropPageTabsProps {
  active: CropTabId;
  onChange: (tab: CropTabId) => void;
}

export default function CropPageTabs({ active, onChange }: CropPageTabsProps) {
  const reduced = useReducedMotion();
  const { t, locale } = useLocale();
  const isHi = locale === "hi";

  return (
    <nav className="mb-4 min-w-0" aria-label={t("cropGuide")}>
      <p className="mb-2 px-0.5 text-sm font-bold text-[var(--av-text-primary)]">
        {isHi ? "क्या देखना है?" : "What to open?"}
      </p>
      <div className="-mx-0.5 flex gap-2.5 overflow-x-auto pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CROP_TABS.map((tab, i) => {
          const isActive = active === tab.id;
          return (
            <motion.button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: Math.min(i, 10) * 0.02,
                duration: MOTION.normal,
                ease: EASE_OUT,
              }}
              className={cn(
                "relative h-[88px] w-[76px] shrink-0 overflow-hidden rounded-2xl border text-left transition active:scale-[0.97]",
                isActive
                  ? "border-emerald-500 ring-2 ring-emerald-500/35"
                  : "border-[var(--av-border)] opacity-95"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={TAB_PHOTO[tab.id]}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              <span
                className={cn(
                  "absolute inset-0 bg-gradient-to-t",
                  isActive
                    ? "from-emerald-950/90 via-emerald-950/40 to-black/10"
                    : "from-black/85 via-black/35 to-black/10"
                )}
              />
              <span className="relative z-10 flex h-full flex-col justify-end p-2">
                <span className="line-clamp-2 text-[11px] font-extrabold leading-tight text-white">
                  {t(TAB_I18N[tab.id])}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
