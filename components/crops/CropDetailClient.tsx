"use client";

import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import CropPageTabs from "@/components/crops/CropPageTabs";
import CropGeneralInfoCard from "@/components/crops/premium/CropGeneralInfoCard";
import CropPremiumHero from "@/components/crops/premium/CropPremiumHero";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropHindiName } from "@/lib/crops/crop-display";
import type { Crop } from "@/types/crop";

interface Props {
  crop: Crop;
}

export default function CropDetailClient({ crop }: Props) {
  const { t, locale } = useLocale();
  const hindiName = getCropHindiName(crop.slug);

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
        <CropPremiumHero crop={crop} />

        <CropGeneralInfoCard crop={crop} />

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
