"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import FarmerSplitCard from "@/components/ui/FarmerSplitCard";
import { cn } from "@/lib/cn";
import { cropCareHref } from "@/lib/crops/crop-care-href";
import type { CropTabId } from "@/lib/crops/crop-tabs";
import {
  cropHarvestHint,
  cropHarvestLabel,
} from "@/lib/crops/harvestLabel";
import type { FarmerUiKey } from "@/lib/i18n/farmer-ui";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import type { Crop } from "@/types/crop";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

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

/** Farmer mental model: work → feed/water → protect → seed/cut → ask */
type TabGroup = {
  id: string;
  titleHi: string;
  titleEn: string;
  tabs: CropTabId[];
};

const GROUPS: TabGroup[] = [
  {
    id: "work",
    titleHi: "१. खेत का काम",
    titleEn: "1. Field work",
    tabs: ["calendar", "growth"],
  },
  {
    id: "feed",
    titleHi: "२. खाद और पानी",
    titleEn: "2. Feed & water",
    tabs: ["fertilizer", "nutrients", "irrigation"],
  },
  {
    id: "protect",
    titleHi: "३. खेत बचाव",
    titleEn: "3. Protect crop",
    tabs: ["pests", "diseases", "weeds"],
  },
];

const MORE: CropTabId[] = ["varieties", "harvest", "faq", "expert"];

const TAB_HINT_HI: Partial<Record<CropTabId, string>> = {
  fertilizer: "यूरिया / डीएपी कब डालें",
  pests: "कीड़ा या छेद दिखे तो",
  diseases: "दाग, सड़न, मुरझान",
  nutrients: "पत्ती पीली / कमजोर",
  irrigation: "कितना और कब पानी",
  weeds: "घास-फूस कैसे हटाएँ",
  calendar: "आज / इस हफ्ते का काम",
  growth: "पौधा किस अवस्था में",
  varieties: "कौन सा बीज बोएँ",
  faq: "आम सवाल–जवाब",
  expert: "खेत की सीधी सलाह",
};

const TAB_HINT_EN: Partial<Record<CropTabId, string>> = {
  fertilizer: "Urea / DAP — when & how much",
  pests: "If insects or holes show",
  diseases: "Spots, rot, wilting",
  nutrients: "Yellow or weak leaf",
  irrigation: "How much water, when",
  weeds: "Clear grass from field",
  calendar: "Today / this week",
  growth: "Which plant stage",
  varieties: "Which seed to sow",
  faq: "Common Q&A",
  expert: "Simple field advice",
};

interface CropPageTabsProps {
  crop: Pick<Crop, "slug" | "category">;
}

export default function CropPageTabs({ crop }: CropPageTabsProps) {
  const reduced = useReducedMotion();
  const { t, locale } = useLocale();
  const isHi = locale === "hi";
  const [showMore, setShowMore] = useState(false);
  const harvestLabel = cropHarvestLabel(crop, isHi);
  const harvestHint = cropHarvestHint(crop, isHi);
  const hintMap = isHi ? TAB_HINT_HI : TAB_HINT_EN;
  const openHint = isHi ? "खोलो" : "Open";

  let animIndex = 0;
  const renderJob = (id: CropTabId) => {
    const i = animIndex++;
    const title = id === "harvest" ? harvestLabel : t(TAB_I18N[id]);
    const subtitle = id === "harvest" ? harvestHint : hintMap[id];
    return (
      <motion.div
        key={id}
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: Math.min(i, 10) * 0.02,
          duration: MOTION.fast,
          ease: EASE_OUT,
        }}
      >
        <FarmerSplitCard
          tone="dark"
          href={cropCareHref(crop.slug, id)}
          title={title}
          subtitle={subtitle}
          image={TAB_PHOTO[id]}
          openHint={openHint}
        />
      </motion.div>
    );
  };

  return (
    <nav className="mb-3 min-w-0 space-y-4" aria-label={t("cropGuide")}>
      <div className="px-0.5">
        <p className="text-[15px] font-extrabold tracking-tight text-[var(--av-text-primary)]">
          {isHi ? "फसल गाइड — आसान रास्ता" : "Crop guide — simple path"}
        </p>
      </div>

      {GROUPS.map((group) => (
        <section key={group.id} className="space-y-2" aria-labelledby={`crop-tab-${group.id}`}>
          <h2
            id={`crop-tab-${group.id}`}
            className="px-0.5 text-[13px] font-black text-[var(--av-accent)]"
          >
            {isHi ? group.titleHi : group.titleEn}
          </h2>
          <div className="space-y-2">{group.tabs.map((id) => renderJob(id))}</div>
        </section>
      ))}

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5 text-left active:scale-[0.99]"
        >
          <span>
            <span className="block text-[13px] font-extrabold text-[var(--av-text-primary)]">
              {isHi
                ? `४. बीज · ${harvestLabel} · सवाल`
                : `4. Seed · ${harvestLabel.toLowerCase()} · ask`}
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold text-[var(--av-text-muted)]">
              {isHi
                ? showMore
                  ? "छिपाएँ"
                  : `किस्म, ${harvestLabel}, पूछो, सलाह — टैप करके खोलें`
                : showMore
                  ? "Hide"
                  : `Variety, ${harvestLabel.toLowerCase()}, FAQ, advice`}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-[var(--av-accent)] transition",
              showMore && "rotate-180"
            )}
          />
        </button>

        {showMore ? <div className="space-y-2">{MORE.map((id) => renderJob(id))}</div> : null}
      </div>
    </nav>
  );
}
