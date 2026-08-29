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
  "field-prep": "/images/jobs/job-my-farm.jpg",
  fertilizer: "/images/jobs/job-fertilizer.jpg",
  pests: "/images/threats/threat-insect.jpg",
  diseases: "/images/threats/threat-disease.jpg",
  nutrients: "/images/home/home-job-yellow-leaf.jpg",
  irrigation: "/images/home/home-job-weather.jpg",
  weeds: "/images/threats/threat-weed.jpg",
  calendar: "/images/jobs/job-my-farm.jpg",
  varieties: "/images/jobs/job-crops-hero.jpg",
  harvest: "/images/jobs/job-crops-hero.jpg",
  market: "/images/jobs/job-crops-hero.jpg",
  faq: "/images/home/ask-expert-trust.jpg",
  expert: "/images/home/home-job-ask.jpg",
};

const TAB_I18N: Record<CropTabId, FarmerUiKey> = {
  overview: "cropTabOverview",
  growth: "cropTabGrowth",
  "field-prep": "cropTabFieldPrep",
  fertilizer: "cropTabFertilizer",
  pests: "cropTabPests",
  diseases: "cropTabDiseases",
  nutrients: "cropTabNutrients",
  irrigation: "cropTabIrrigation",
  weeds: "cropTabWeeds",
  calendar: "cropTabCalendar",
  varieties: "cropTabVarieties",
  harvest: "cropTabHarvest",
  market: "cropTabMarket",
  faq: "cropTabFaq",
  expert: "cropTabExpert",
};

type TabGroup = {
  id: string;
  titleHi: string;
  titleEn: string;
  tabs: CropTabId[];
};

const TAB_HINT_HI: Partial<Record<CropTabId, string>> = {
  varieties: "हाइब्रिड, देसी, लोकल — रोग प्रतिरोध, भंडारण, फल आकार",
  "field-prep": "नर्सरी, बीज दर, रोपाई, दूरी, मल्चिंग, ड्रिप",
  fertilizer: "बेसल खाद — यूरिया, डीएपी, एमओपी",
  irrigation: "कितना और कब पानी दें",
  pests: "आम कीट — फोटो, लक्षण, समाधान",
  diseases: "आम रोग — फोटो, लक्षण, समाधान",
  harvest: "तुड़ाई का समय, सहारा, पकने की अवस्था",
  market: "भंडारण, पैकिंग, लाइव मंडी भाव",
  weeds: "घास-फूस कैसे हटाएँ",
  growth: "पौधे की अवस्था",
  calendar: "फसल का कार्यक्रम",
  nutrients: "पत्ती पीली / कमज़ोर",
  faq: "आम सवाल–जवाब",
  expert: "खेत की सीधी सलाह",
};

const TAB_HINT_EN: Partial<Record<CropTabId, string>> = {
  varieties: "Hybrid, local — disease resist, storage, fruit size",
  "field-prep": "Nursery, seed rate, transplant, spacing, mulch, drip",
  fertilizer: "Basal dose — urea, DAP, MOP",
  irrigation: "How much water, when",
  pests: "Common pests — photo, signs, fix",
  diseases: "Common diseases — photo, signs, fix",
  harvest: "When to pick, staking, ripeness",
  market: "Storage, packing, live mandi",
  weeds: "Clear grass from field",
  growth: "Plant stage",
  calendar: "Crop schedule",
  nutrients: "Yellow or weak leaf",
  faq: "Common Q&A",
  expert: "Simple field advice",
};

const MORE: CropTabId[] = ["weeds", "growth", "calendar", "nutrients", "faq", "expert"];

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
  const openHint = isHi ? "देखो" : "Open";

  const groups: TabGroup[] = [
    {
      id: "varieties",
      titleHi: "२. सही बीज का चुनाव",
      titleEn: "2. Seed variety",
      tabs: ["varieties"],
    },
    {
      id: "field-prep",
      titleHi: "३. तैयारी (ज़मीन और बुवाई)",
      titleEn: "3. Field prep & sowing",
      tabs: ["field-prep"],
    },
    {
      id: "feed",
      titleHi: "४. खाद और सिंचाई",
      titleEn: "4. Fertilizer & irrigation",
      tabs: ["fertilizer", "irrigation"],
    },
    {
      id: "protect",
      titleHi: "५. कीट और रोग नियंत्रण",
      titleEn: "5. Pest & disease control",
      tabs: ["pests", "diseases"],
    },
    {
      id: "harvest",
      titleHi: `६. ${harvestLabel}, सहारा`,
      titleEn: `6. ${harvestLabel} & staking`,
      tabs: ["harvest"],
    },
    {
      id: "market",
      titleHi: "७. मंडी भाव और बिक्री",
      titleEn: "7. Mandi & sales",
      tabs: ["market"],
    },
  ];

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
      {groups.map((group) => (
        <section key={group.id} className="space-y-2" aria-labelledby={`crop-tab-${group.id}`}>
          <h2
            id={`crop-tab-${group.id}`}
            className="px-0.5 text-[16px] font-black leading-tight tracking-tight text-[var(--av-accent)]"
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
              {isHi ? "और जानकारी" : "More"}
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold text-[var(--av-text-muted)]">
              {isHi
                ? showMore
                  ? "छिपाएँ"
                  : "खरपतवार, अवस्था, कार्यक्रम, पीली पत्ती, सवाल"
                : showMore
                  ? "Hide"
                  : "Weeds, stages, schedule, nutrients, FAQ"}
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
