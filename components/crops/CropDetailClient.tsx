"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import CropPageTabs from "@/components/crops/CropPageTabs";
import CropPremiumHero from "@/components/crops/premium/CropPremiumHero";
import CropOverviewSection from "@/components/crops/sections/CropOverviewSection";
import { enrichCropDetail } from "@/lib/cropDetailEnrichment";
import { cropCareHref } from "@/lib/crops/crop-care-href";
import type { CropTabId } from "@/lib/crops/crop-tabs";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropHindiName } from "@/lib/crops/crop-display";
import type { Crop } from "@/types/crop";

interface Props {
  crop: Crop;
}

export default function CropDetailClient({ crop }: Props) {
  const router = useRouter();
  const { t, locale } = useLocale();
  const detail = useMemo(() => enrichCropDetail(crop), [crop]);
  const hindiName = getCropHindiName(crop.slug);

  const onTabChange = useCallback(
    (tab: CropTabId) => {
      router.push(cropCareHref(crop.slug, tab));
    },
    [crop.slug, router]
  );

  return (
    <div className="crop-premium-page relative min-h-screen">
      <AppShell
        className="relative z-10 !bg-transparent"
        backHref="/crops"
        breadcrumbs={[
          { label: locale === "hi" ? "फसलें" : "Crops", href: "/crops" },
          { label: locale === "hi" && hindiName ? hindiName : crop.name },
        ]}
      >
        <CropPremiumHero crop={crop} detail={detail} />

        <div className="mb-3">
          <CropOverviewSection crop={crop} detail={detail} onTabChange={onTabChange} />
        </div>

        <CropPageTabs crop={crop} />

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
