"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import CropPageTabs from "@/components/crops/CropPageTabs";
import CropPremiumHero from "@/components/crops/premium/CropPremiumHero";
import AnimatedGrowthTimeline from "@/components/crops/AnimatedGrowthTimeline";
import CropOverviewSection from "@/components/crops/sections/CropOverviewSection";
import CropFertilizerSection from "@/components/crops/sections/CropFertilizerSection";
import CropPestsSection from "@/components/crops/sections/CropPestsSection";
import CropDiseasesSection from "@/components/crops/sections/CropDiseasesSection";
import CropNutrientsSection from "@/components/crops/sections/CropNutrientsSection";
import CropIrrigationSection from "@/components/crops/sections/CropIrrigationSection";
import CropWeedSection from "@/components/crops/sections/CropWeedSection";
import CropCalendarSection from "@/components/crops/sections/CropCalendarSection";
import CropHarvestSection from "@/components/crops/sections/CropHarvestSection";
import CropVarietiesSection from "@/components/crops/sections/CropVarietiesSection";
import CropFaqSection from "@/components/crops/sections/CropFaqSection";
import CropExpertSection from "@/components/crops/sections/CropExpertSection";
import { enrichCropDetail } from "@/lib/cropDetailEnrichment";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { isCropTabId, CROP_TAB_IDS, type CropTabId } from "@/lib/crops/crop-tabs";
import type { Crop } from "@/types/crop";

interface Props {
  crop: Crop;
  initialTab?: CropTabId;
}

const panelMotion = {
  initial: { opacity: 0, y: 14, scale: 0.99, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: MOTION.slow, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.995,
    filter: "blur(2px)",
    transition: { duration: MOTION.normal, ease: EASE_OUT },
  },
};

export default function CropDetailClient({ crop, initialTab = "overview" }: Props) {
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const detail = useMemo(() => enrichCropDetail(crop), [crop]);

  const tabFromUrl = searchParams.get("tab");
  const resolvedInitial = isCropTabId(tabFromUrl) ? tabFromUrl : initialTab;
  const [activeTab, setActiveTab] = useState<CropTabId>(resolvedInitial);

  useEffect(() => {
    if (isCropTabId(tabFromUrl)) setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const timingHint =
    detail.establishment === "transplant"
      ? "DAT = Days After Transplanting"
      : "DAS = Days After Sowing";

  const onTabChange = useCallback(
    (tab: CropTabId) => {
      setActiveTab(tab);
      const url = tab === "overview" ? `/crops/${crop.slug}` : `/crops/${crop.slug}?tab=${tab}`;
      window.history.replaceState(null, "", url);
      document.getElementById("crop-tab-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [crop.slug]
  );

  const tabIndex = useMemo(() => CROP_TAB_IDS.indexOf(activeTab), [activeTab]);

  const goTab = useCallback(
    (dir: 1 | -1) => {
      const next = CROP_TAB_IDS[tabIndex + dir];
      if (next) onTabChange(next);
    },
    [tabIndex, onTabChange]
  );

  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.x < -60) goTab(1);
      else if (info.offset.x > 60) goTab(-1);
    },
    [goTab]
  );

  return (
    <div className="crop-premium-page relative min-h-screen">
      <AppShell
        className="relative z-10 !bg-transparent"
        breadcrumbs={[
          { label: "Crops", href: "/crops" },
          { label: crop.name },
        ]}
      >
        <CropPremiumHero crop={crop} detail={detail} />

        <p className="mb-1 text-center text-[10px] font-medium text-[var(--av-text-muted)]">{timingHint}</p>

        <CropPageTabs active={activeTab} onChange={onTabChange} />

        <AnimatePresence mode="wait">
          <motion.div
            id="crop-tab-content"
            key={activeTab}
            drag={reduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={onDragEnd}
            initial={reduceMotion ? false : panelMotion.initial}
            animate={panelMotion.animate}
            exit={panelMotion.exit}
            className="touch-pan-y"
          >
            {activeTab === "overview" && (
              <CropOverviewSection crop={crop} detail={detail} onTabChange={onTabChange} />
            )}
            {activeTab === "growth" && <AnimatedGrowthTimeline stages={detail.growthStages} />}
            {activeTab === "fertilizer" && <CropFertilizerSection crop={crop} />}
            {activeTab === "pests" && <CropPestsSection crop={crop} />}
            {activeTab === "diseases" && <CropDiseasesSection crop={crop} />}
            {activeTab === "nutrients" && <CropNutrientsSection crop={crop} />}
            {activeTab === "irrigation" && (
              <CropIrrigationSection crop={crop} detail={detail} timingHint={timingHint} />
            )}
            {activeTab === "weeds" && <CropWeedSection crop={crop} />}
            {activeTab === "calendar" && <CropCalendarSection crop={crop} detail={detail} />}
            {activeTab === "varieties" && <CropVarietiesSection crop={crop} />}
            {activeTab === "harvest" && <CropHarvestSection crop={crop} />}
            {activeTab === "faq" && <CropFaqSection crop={crop} />}
            {activeTab === "expert" && <CropExpertSection crop={crop} />}
          </motion.div>
        </AnimatePresence>

        <ShellCtaBanner
          title="Need crop-specific advice?"
          description="AI Doctor se photo bhejein — diagnosis, dose aur next step turant milega."
          buttonLabel="Open AI Doctor"
          href="/ai-doctor"
        />
      </AppShell>
    </div>
  );
}
