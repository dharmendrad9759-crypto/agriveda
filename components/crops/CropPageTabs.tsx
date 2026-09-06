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
import { ChevronDown, Sprout } from "lucide-react";
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
  fertilizer: "कब डालें और कितनी — यूरिया, डीएपी, एमओपी",
  irrigation: "कितना और कब पानी दें",
  pests: "फोटो देखो · क्या लगे · क्या दवा डालें",
  diseases: "फोटो देखो · पत्ती/डंठल का हाल · इलाज",
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
  fertilizer: "When & how much — urea, DAP, MOP",
  irrigation: "How much water, when",
  pests: "See photo · what it is · which spray",
  diseases: "See photo · leaf/stem signs · treatment",
  harvest: "When to pick, staking, ripeness",
  market: "Storage, packing, live mandi",
  weeds: "Clear grass from field",
  growth: "Plant stage",
  calendar: "Crop schedule",
  nutrients: "Yellow or weak leaf",
  faq: "Common Q&A",
  expert: "Simple field advice",
};

const MORE_TEASER_HI = ["घास", "पीली पत्ती", "हफ्ते का काम", "सवाल"] as const;
const MORE_TEASER_EN = ["Weeds", "Yellow leaf", "This week", "Ask"] as const;

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
      titleHi: "2. सही बीज का चुनाव",
      titleEn: "2. Seed variety",
      tabs: ["varieties"],
    },
    {
      id: "field-prep",
      titleHi: "3. तैयारी (ज़मीन और बुवाई)",
      titleEn: "3. Field prep & sowing",
      tabs: ["field-prep"],
    },
    {
      id: "feed",
      titleHi: "4. खाद और सिंचाई",
      titleEn: "4. Fertilizer & irrigation",
      tabs: ["fertilizer", "irrigation"],
    },
    {
      id: "protect",
      titleHi: "5. कीट और रोग नियंत्रण",
      titleEn: "5. Pest & disease control",
      tabs: ["pests", "diseases"],
    },
    {
      id: "harvest",
      titleHi: `6. ${harvestLabel}, सहारा`,
      titleEn: `6. ${harvestLabel} & staking`,
      tabs: ["harvest"],
    },
    {
      id: "market",
      titleHi: "7. मंडी भाव और बिक्री",
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

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          aria-expanded={showMore}
          className={cn(
            "group relative w-full overflow-hidden rounded-2xl border text-left transition active:scale-[0.99]",
            "border-amber-600/35 bg-gradient-to-br from-amber-50 via-orange-50/80 to-emerald-50",
            "shadow-[0_8px_24px_-12px_rgba(180,83,9,0.45)]",
            "dark:border-amber-400/25 dark:from-amber-950/50 dark:via-orange-950/30 dark:to-emerald-950/40",
            showMore && "ring-2 ring-amber-500/40"
          )}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-amber-400/25 blur-2xl dark:bg-amber-500/15"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl"
          />

          <span className="relative flex items-start gap-3 p-3.5 sm:p-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-700/30">
              <Sprout className="h-6 w-6" strokeWidth={2.25} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-[15px] font-black tracking-tight text-amber-950 dark:text-amber-50">
                  {isHi
                    ? showMore
                      ? "बाकी गाइड खुली है"
                      : "बाकी गाइड भी देखो"
                    : showMore
                      ? "Extra guide open"
                      : "See more crop guide"}
                </span>
                {!showMore ? (
                  <span className="rounded-md bg-amber-600 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
                    {isHi ? "टैप करो" : "Tap"}
                  </span>
                ) : null}
              </span>

              <span className="mt-1 block text-[11px] font-semibold leading-snug text-amber-900/75 dark:text-amber-100/75">
                {isHi
                  ? showMore
                    ? "ऊपर वापस छिपाने के लिए फिर टैप करें"
                    : "घास, पीली पत्ती, हफ्ते का काम और सवाल — यहाँ"
                  : showMore
                    ? "Tap again to hide"
                    : "Weeds, yellow leaf, weekly work & questions"}
              </span>

              {!showMore ? (
                <span className="mt-2.5 flex flex-wrap gap-1.5">
                  {(isHi ? MORE_TEASER_HI : MORE_TEASER_EN).map((label) => (
                    <span
                      key={label}
                      className="rounded-lg border border-amber-700/15 bg-white/70 px-2 py-1 text-[10px] font-bold text-amber-950/90 dark:border-amber-300/20 dark:bg-black/25 dark:text-amber-50"
                    >
                      {label}
                    </span>
                  ))}
                </span>
              ) : null}
            </span>

            <span
              className={cn(
                "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white shadow-sm transition group-hover:bg-amber-700",
                showMore && "rotate-180"
              )}
            >
              <ChevronDown className="h-5 w-5" strokeWidth={2.5} />
            </span>
          </span>
        </button>

        {showMore ? <div className="space-y-2">{MORE.map((id) => renderJob(id))}</div> : null}
      </div>
    </nav>
  );
}
