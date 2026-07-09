"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Calendar, Sprout } from "lucide-react";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import CropPageTabs from "@/components/crops/CropPageTabs";
import AnimatedGrowthTimeline from "@/components/crops/AnimatedGrowthTimeline";
import CropOverviewSection from "@/components/crops/sections/CropOverviewSection";
import CropFertilizerSection from "@/components/crops/sections/CropFertilizerSection";
import CropPestsSection from "@/components/crops/sections/CropPestsSection";
import CropDiseasesSection from "@/components/crops/sections/CropDiseasesSection";
import CropNutrientsSection from "@/components/crops/sections/CropNutrientsSection";
import CropIrrigationSection from "@/components/crops/sections/CropIrrigationSection";
import { enrichCropDetail } from "@/lib/cropDetailEnrichment";
import { fadeDown, tabPanel } from "@/lib/motion/variants";
import { isCropTabId, type CropTabId } from "@/lib/crops/crop-tabs";
import type { Crop } from "@/types/crop";

const CATEGORY_LABEL: Record<Crop["category"], string> = {
  Cereals: "Cereals",
  Vegetables: "Vegetables",
  Pulses: "Pulses",
  Millets: "Millets",
  "Cash-Crops": "Cash Crops",
};

interface Props {
  crop: Crop;
  initialTab?: CropTabId;
}

export default function CropDetailClient({ crop, initialTab = "overview" }: Props) {
  const searchParams = useSearchParams();
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

  const statPills = [
    { icon: Clock, value: crop.durationDays },
    { icon: Sprout, value: crop.estimatedYield },
    { icon: Calendar, value: crop.suitableSeason },
  ];

  return (
    <AppShell
      breadcrumbs={[
        { label: "Crops", href: "/crops" },
        { label: crop.name },
      ]}
    >
      <motion.header
        variants={fadeDown}
        initial="hidden"
        animate="visible"
        className="av-hero p-4 sm:p-5"
      >
        <div className="flex flex-col gap-3">
          <div className="min-w-0">
            <span className="inline-block rounded-md border border-[var(--av-accent)]/25 bg-[var(--av-accent-soft)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--av-accent)]">
              {CATEGORY_LABEL[crop.category]}
            </span>
            <h1 className="mt-1 text-[clamp(1.25rem,4.5vw,1.75rem)] font-bold leading-tight text-[var(--av-text-primary)]">
              {crop.name}
            </h1>
            <p className="mt-0.5 text-xs italic text-[var(--av-text-secondary)]">{crop.scientificName}</p>
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 scrollbar-hide sm:flex-wrap sm:overflow-visible">
            {statPills.map((pill) => {
              const Icon = pill.icon;
              return (
                <span
                  key={pill.value}
                  className="av-chip inline-flex min-h-[40px] shrink-0 items-center px-3 py-2 text-xs sm:text-sm"
                >
                  <Icon className="mr-1.5 h-3.5 w-3.5 text-[var(--av-accent)]" />
                  <span>{pill.value}</span>
                </span>
              );
            })}
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-[var(--av-text-secondary)]">{crop.overview}</p>
        <p className="mt-2 text-[10px] font-medium text-[var(--av-text-muted)]">
          {detail.establishment === "transplant" ? "Transplanted crop" : "Direct-sown crop"} · {timingHint}
        </p>
      </motion.header>

      <CropPageTabs active={activeTab} onChange={onTabChange} />

      <AnimatePresence mode="wait">
        <motion.div
          id="crop-tab-content"
          key={activeTab}
          initial={tabPanel.initial}
          animate={tabPanel.animate}
          exit={tabPanel.exit}
          transition={tabPanel.transition}
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
        </motion.div>
      </AnimatePresence>

      <ShellCtaBanner
        title="Need crop-specific advice?"
        description="AI Doctor se photo bhejein — diagnosis, dose aur next step turant milega."
        buttonLabel="Open AI Doctor"
        href="/ai-doctor"
      />
    </AppShell>
  );
}
