"use client";

import AppShell from "@/components/shell/AppShell";
import AnimatedGrowthTimeline from "@/components/crops/AnimatedGrowthTimeline";
import CropFertilizerSection from "@/components/crops/sections/CropFertilizerSection";
import CropPestsSection from "@/components/crops/sections/CropPestsSection";
import CropDiseasesSection from "@/components/crops/sections/CropDiseasesSection";
import CropNutrientsSection from "@/components/crops/sections/CropNutrientsSection";
import CropIrrigationSection from "@/components/crops/sections/CropIrrigationSection";
import CropWeedSection from "@/components/crops/sections/CropWeedSection";
import CropCalendarSection from "@/components/crops/sections/CropCalendarSection";
import CropHarvestSection from "@/components/crops/sections/CropHarvestSection";
import CropVarietiesSection from "@/components/crops/sections/CropVarietiesSection";
import CropMistakesSection from "@/components/crops/sections/CropMistakesSection";
import CropFieldPrepSection from "@/components/crops/sections/CropFieldPrepSection";
import CropMarketSection from "@/components/crops/sections/CropMarketSection";
import CropFaqSection from "@/components/crops/sections/CropFaqSection";
import CropExpertSection from "@/components/crops/sections/CropExpertSection";
import CropThreatPageHero from "@/components/crops/CropThreatPageHero";
import StubCropNotice from "@/components/crops/StubCropNotice";
import { enrichCropDetail } from "@/lib/cropDetailEnrichment";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { cropHarvestLabel } from "@/lib/crops/harvestLabel";
import type { CropTabId } from "@/lib/crops/crop-tabs";
import type { FarmerUiKey } from "@/lib/i18n/farmer-ui";
import type { Crop } from "@/types/crop";
import React, { Component, useMemo, type ReactNode } from "react";

const TAB_TO_STAGE: Record<string, string> = {
  varieties: "sowing",
  "field-prep": "sowing",
  mistakes: "sowing",
  growth: "sowing",
  fertilizer: "feed",
  irrigation: "feed",
  weeds: "feed",
  nutrients: "feed",
  pests: "protect",
  diseases: "protect",
  expert: "protect",
  harvest: "finish",
  market: "finish",
  calendar: "finish",
  faq: "finish",
};

class SectionErrorBoundary extends Component<
  { children: ReactNode; title: string; hi: boolean },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; title: string; hi: boolean }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[SectionErrorBoundary]", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
          <p className="text-base font-black text-emerald-950 dark:text-emerald-100">
            {this.props.hi ? `${this.props.title} लोड नहीं हो सका` : `Could not load ${this.props.title}`}
          </p>
          <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
            {this.props.hi
              ? "डेटा प्रोसेस करने में समस्या आई। पुनः प्रयास करें।"
              : "An error occurred while loading this section. Please retry."}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700 active:scale-95 transition"
          >
            {this.props.hi ? "फिर से लोड करें" : "Retry"}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const TAB_TITLE: Record<Exclude<CropTabId, "overview" | "harvest">, FarmerUiKey> = {
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
  market: "cropTabMarket",
  faq: "cropTabFaq",
  expert: "cropTabExpert",
};

interface Props {
  crop: Crop;
  tab: Exclude<CropTabId, "overview">;
}

export default function CropCarePageClient({ crop, tab }: Props) {
  const { t, locale } = useLocale();
  const detail = useMemo(() => enrichCropDetail(crop), [crop]);
  const hindiName = getCropHindiName(crop.slug);
  const cropLabel = locale === "hi" && hindiName ? hindiName : crop.name;
  const title =
    tab === "harvest"
      ? cropHarvestLabel(crop, locale === "hi")
      : tab === "pests"
        ? locale === "hi"
          ? `${cropLabel} के कीट`
          : `${cropLabel} pests`
        : tab === "diseases"
          ? locale === "hi"
            ? `${cropLabel} के रोग`
            : `${cropLabel} diseases`
          : t(TAB_TITLE[tab]);
  const timingHint =
    detail.establishment === "transplant" ? t("cropDatHint") : t("cropDasHint");

  const isThreatTab = tab === "pests" || tab === "diseases";
  const parentStage = TAB_TO_STAGE[tab] || "overview";
  const parentCropHref = `/crops/${crop.slug}?stage=${parentStage}`;

  return (
    <div className="crop-premium-page relative min-h-screen">
      <AppShell
        className="relative z-10 !bg-transparent"
        backHref={parentCropHref}
        breadcrumbs={[
          { label: locale === "hi" ? "फसलें" : "Crops", href: "/crops" },
          { label: cropLabel, href: parentCropHref },
          { label: title },
        ]}
      >
        {crop.isStub ? <StubCropNotice hi={locale === "hi"} /> : null}
        {isThreatTab ? (
          <CropThreatPageHero
            crop={crop}
            cropLabel={cropLabel}
            title={title}
            kind={tab}
            hi={locale === "hi"}
          />
        ) : tab === "varieties" || tab === "fertilizer" ? (
          <h1 className="sr-only">{title}</h1>
        ) : (
          <div className="mb-3">
            <h1 className="text-[22px] font-black leading-tight tracking-tight text-[#0B3D28]">
              {title}
            </h1>
          </div>
        )}

        <div className="min-w-0">
          <SectionErrorBoundary key={tab} title={title} hi={locale === "hi"}>
            {tab === "growth" && (
              <div className="space-y-4">
                <AnimatedGrowthTimeline
                  stages={detail.growthStages}
                  cropSlug={crop.slug}
                  cropName={cropLabel}
                />
              </div>
            )}
            {tab === "field-prep" && <CropFieldPrepSection crop={crop} />}
            {tab === "fertilizer" && <CropFertilizerSection crop={crop} />}
            {tab === "pests" && <CropPestsSection crop={crop} />}
            {tab === "diseases" && <CropDiseasesSection crop={crop} />}
            {tab === "nutrients" && <CropNutrientsSection crop={crop} />}
            {tab === "irrigation" && (
              <CropIrrigationSection crop={crop} detail={detail} timingHint={timingHint} />
            )}
            {tab === "weeds" && <CropWeedSection crop={crop} />}
            {tab === "calendar" && <CropCalendarSection crop={crop} detail={detail} />}
            {tab === "varieties" && <CropVarietiesSection crop={crop} />}
            {tab === "mistakes" && <CropMistakesSection crop={crop} />}
            {tab === "harvest" && <CropHarvestSection crop={crop} />}
            {tab === "market" && <CropMarketSection crop={crop} />}
            {tab === "faq" && <CropFaqSection crop={crop} />}
            {tab === "expert" && <CropExpertSection crop={crop} />}
          </SectionErrorBoundary>
        </div>
      </AppShell>
    </div>
  );
}
