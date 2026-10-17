"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { daysAfterSowing } from "@/lib/cropGrowthStage";
import FarmerSplitCard from "@/components/ui/FarmerSplitCard";
import SpeakButton from "@/components/ui/SpeakButton";
import { cn } from "@/lib/cn";
import { cropCareHref } from "@/lib/crops/crop-care-href";
import type { CropTabId } from "@/lib/crops/crop-tabs";
import {
  cropHarvestHint,
  cropHarvestLabel,
} from "@/lib/crops/harvestLabel";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { getCropTabPhoto } from "@/lib/crops/cropTabPhotos";
import { getCatalogCrop } from "@/data/crop-catalog";
import type { FarmerUiKey } from "@/lib/i18n/farmer-ui";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import type { Crop } from "@/types/crop";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Sprout } from "lucide-react";
import { useEffect, useState } from "react";

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
  mistakes: "cropTabMistakes",
  harvest: "cropTabHarvest",
  market: "cropTabMarket",
  faq: "cropTabFaq",
  expert: "cropTabExpert",
};

type StageId = "sowing" | "feed" | "protect" | "finish";

type TabGroup = {
  id: string;
  stage: StageId;
  titleHi: string;
  titleEn: string;
  tabs: CropTabId[];
};

const STAGES: { id: StageId; hi: string; en: string; hintHi: string; hintEn: string }[] = [
  { id: "sowing", hi: "बुवाई", en: "Sowing", hintHi: "बीज", hintEn: "Seed" },
  { id: "feed", hi: "खाद", en: "Feed", hintHi: "पानी", hintEn: "Water" },
  { id: "protect", hi: "कीट", en: "Pests", hintHi: "रोग", hintEn: "Disease" },
  { id: "finish", hi: "कटाई", en: "Harvest", hintHi: "मंडी", hintEn: "Mandi" },
];

function stageForDays(days: number | null): StageId {
  if (days == null || days < 20) return "sowing";
  if (days < 55) return "feed";
  if (days < 95) return "protect";
  return "finish";
}

const STAGE_TABS: Record<StageId, CropTabId[]> = {
  sowing: ["varieties", "field-prep", "mistakes", "growth"],
  feed: ["fertilizer", "irrigation", "weeds", "nutrients"],
  protect: ["pests", "diseases", "expert"],
  finish: ["harvest", "market", "calendar", "faq"],
};

const TAB_HINT_HI: Partial<Record<CropTabId, string>> = {
  varieties: "उन्नत किस्में, उपज क्षमता व बीज दर",
  "field-prep": "खेत की जुताई, क्यारी व बुवाई दूरी",
  mistakes: "अक्सर होने वाली गलतियों से बचाव",
  growth: "बुवाई की तारीख व फसल की बढ़वार",
  fertilizer: "यूरिया, डीएपी, पोटाश व स्प्रे खुराक",
  irrigation: "फसल को कब और कितना पानी दें",
  weeds: "घास-फूस व खरपतवार का सही नियंत्रण",
  nutrients: "पत्तियों का पीलापन व पोषण सुधार",
  pests: "कीट पहचान, रोकथाम व असरदार दवा",
  diseases: "रोग के लक्षण व फफूंदनाशक इलाज",
  expert: "खेत की सीधी सलाह व फसल डॉक्टर",
  harvest: "तुड़ाई/खुदाई का समय व सही तरीका",
  market: "भंडारण, पैकिंग व ताज़ा मंडी भाव",
  calendar: "फसल का साप्ताहिक काम कार्यक्रम",
  faq: "किसानों के आम सवाल और जवाब",
};

const TAB_HINT_EN: Partial<Record<CropTabId, string>> = {
  varieties: "Recommended varieties, yield & seed rate",
  "field-prep": "Ploughing, beds & spacing",
  mistakes: "Avoid common yield-reducing mistakes",
  growth: "Sowing date and active growth stage",
  fertilizer: "Urea, DAP, potash & foliar spray doses",
  irrigation: "When and how much water to give",
  weeds: "Effective weed and grass management",
  nutrients: "Yellow leaves & deficiency fixes",
  pests: "Identify pests, prevention & spray",
  diseases: "Disease symptoms & fungicide remedies",
  expert: "Direct field tips & AI crop doctor",
  harvest: "Harvest timing & proper handling",
  market: "Storage, packing & live mandi prices",
  calendar: "Weekly farm task calendar",
  faq: "Common farmer questions & answers",
};

interface CropPageTabsProps {
  crop: Pick<Crop, "slug" | "category">;
}

export default function CropPageTabs({ crop }: CropPageTabsProps) {
  const reduced = useReducedMotion();
  const { t, locale } = useLocale();
  const isHi = locale === "hi";
  const { profile, hydrated } = useFarmerProfile();
  const [stage, setStage] = useState<StageId>("sowing");
  const [stageTouched, setStageTouched] = useState(false);

  useEffect(() => {
    if (!hydrated || stageTouched) return;
    const iso = profile.sowingDates?.[crop.slug];
    const days = iso ? daysAfterSowing(iso) : null;
    setStage(stageForDays(days));
  }, [hydrated, stageTouched, profile.sowingDates, crop.slug]);

  const harvestLabel = cropHarvestLabel(crop, isHi);
  const harvestHint = cropHarvestHint(crop, isHi);
  const hintMap = isHi ? TAB_HINT_HI : TAB_HINT_EN;
  const openHint = isHi ? "देखो" : "Open";

  let animIndex = 0;
  const cropLabelHi = getCropHindiName(crop.slug) || crop.slug;
  const cropLabelEn = getCatalogCrop(crop.slug)?.name || crop.slug;

  const renderJob = (id: CropTabId) => {
    const i = animIndex++;
    const title =
      id === "harvest"
        ? harvestLabel
        : id === "pests"
          ? isHi
            ? `${cropLabelHi} के कीट`
            : `${cropLabelEn} pests`
          : id === "diseases"
            ? isHi
              ? `${cropLabelHi} के रोग`
              : `${cropLabelEn} diseases`
            : t(TAB_I18N[id]);
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
          image={getCropTabPhoto(crop.slug, id)}
          threatCategory={
            id === "pests" ? "insect" : id === "diseases" ? "fungal" : id === "weeds" ? "weed" : "crop"
          }
          openHint={openHint}
        />
      </motion.div>
    );
  };

  const currentTabs = STAGE_TABS[stage] || [];

  return (
    <nav className="mb-3 min-w-0 space-y-3.5" aria-label={t("cropGuide")}>
      <div className="grid grid-cols-4 gap-1.5" role="tablist" aria-label={isHi ? "फसल का चरण" : "Crop stage"}>
        {STAGES.map((item) => {
          const on = item.id === stage;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => {
                setStageTouched(true);
                setStage(item.id);
              }}
              className={cn(
                "min-h-12 rounded-xl border px-1 py-1.5 text-center leading-tight transition active:scale-[0.98]",
                on
                  ? "border-emerald-700 bg-emerald-800 text-white shadow-sm"
                  : "border-[#D0DDD7] bg-[var(--av-surface)] text-[var(--av-text-primary)] hover:border-emerald-500/40"
              )}
            >
              <span className="block text-[13px] font-black">{isHi ? item.hi : item.en}</span>
              <span className={cn("block text-[11px] font-semibold", on ? "text-emerald-100" : "text-[var(--av-text-muted)]")}>
                {isHi ? item.hintHi : item.hintEn}
              </span>
            </button>
          );
        })}
      </div>

      <SpeakButton
        hi={isHi}
        text={currentTabs
          .map((id) => (isHi ? `${t(TAB_I18N[id])}. ${(hintMap[id] ?? "")}` : t(TAB_I18N[id])))
          .join(" ")}
      />

      <div className="space-y-2.5">
        {currentTabs.map((id) => renderJob(id))}
      </div>
    </nav>
  );
}
