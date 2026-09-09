"use client";

import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
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
import CropFieldPrepSection from "@/components/crops/sections/CropFieldPrepSection";
import CropMarketSection from "@/components/crops/sections/CropMarketSection";
import CropFaqSection from "@/components/crops/sections/CropFaqSection";
import CropExpertSection from "@/components/crops/sections/CropExpertSection";
import CropThreatPageHero from "@/components/crops/CropThreatPageHero";
import { enrichCropDetail } from "@/lib/cropDetailEnrichment";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { cropHarvestLabel } from "@/lib/crops/harvestLabel";
import type { CropTabId } from "@/lib/crops/crop-tabs";
import type { FarmerUiKey } from "@/lib/i18n/farmer-ui";
import type { Crop } from "@/types/crop";
import { useMemo } from "react";

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

  return (
    <div className="crop-premium-page relative min-h-screen">
      <AppShell
        className="relative z-10 !bg-transparent"
        backHref={`/crops/${crop.slug}`}
        breadcrumbs={[
          { label: locale === "hi" ? "फसलें" : "Crops", href: "/crops" },
          { label: cropLabel, href: `/crops/${crop.slug}` },
          { label: title },
        ]}
      >
        {isThreatTab ? (
          <CropThreatPageHero
            crop={crop}
            cropLabel={cropLabel}
            title={title}
            kind={tab}
            hi={locale === "hi"}
          />
        ) : (
          <div className="mb-3">
            <h1 className="text-[22px] font-black leading-tight tracking-tight text-[#0B3D28]">
              {title}
            </h1>
          </div>
        )}

        <div className="min-w-0">
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
          {tab === "harvest" && <CropHarvestSection crop={crop} />}
          {tab === "market" && <CropMarketSection crop={crop} />}
          {tab === "faq" && <CropFaqSection crop={crop} />}
          {tab === "expert" && <CropExpertSection crop={crop} />}
        </div>

        <ShellCtaBanner
          title={t("cropNeedAdvice")}
          description={t("cropNeedAdviceDesc")}
          buttonLabel={t("cropOpenAiDoctor")}
          href="/ai-doctor"
        />
      </AppShell>
    </div>
  );
}
