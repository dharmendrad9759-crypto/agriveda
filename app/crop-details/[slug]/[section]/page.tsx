"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import PageBackground from "@/components/ui/PageBackground";
import { useCropManagement } from "@/lib/useCropManagement";
import {
  CROP_SECTION_IDS,
  CROP_SECTION_META,
} from "@/components/crop/CropCategoryGuide";
import CropManagementSowingTime from "@/components/crop-management/CropManagementSowingTime";
import CropManagementFertilizerSchedule from "@/components/crop-management/CropManagementFertilizerSchedule";
import CropManagementIrrigation from "@/components/crop-management/CropManagementIrrigation";
import { CropManagementCropProtection } from "@/components/crop-management/CropManagementPestManagement";
import CropManagementNutrientDeficiencies from "@/components/crop-management/CropManagementNutrientDeficiencies";
import CropManagementHarvesting from "@/components/crop-management/CropManagementHarvesting";
import CropManagementMarketInformation from "@/components/crop-management/CropManagementMarketInformation";
import CropManagementWeedManagement from "@/components/crop-management/CropManagementWeedManagement";

interface Props {
  params: Promise<{ slug: string; section: string }>;
}

export default function CropSectionPage({ params }: Props) {
  const { slug, section } = use(params);
  const profile = useCropManagement(slug);
  const meta = CROP_SECTION_META[section];

  if (!profile || !meta || !CROP_SECTION_IDS.includes(section)) {
    notFound();
  }

  return (
    <div className="agriveda-page relative min-h-screen pb-28">
      <PageBackground />

      <header className="sticky top-0 z-40 border-b border-emerald-500/10 bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link
            href={`/crop-details/${slug}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 text-emerald-600"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-base font-extrabold theme-text-primary">{meta.title}</h1>
            <p className="truncate text-[11px] theme-text-muted">
              {profile.name} · {meta.subtitle}
            </p>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-lg px-4 py-5">
        {section === "sowing" && <CropManagementSowingTime profile={profile} />}
        {section === "fertilizer" && <CropManagementFertilizerSchedule profile={profile} />}
        {section === "irrigation" && <CropManagementIrrigation profile={profile} />}
        {section === "protection" && <CropManagementCropProtection profile={profile} />}
        {section === "weeds" && <CropManagementWeedManagement profile={profile} />}
        {section === "nutrition" && <CropManagementNutrientDeficiencies profile={profile} />}
        {section === "harvest" && <CropManagementHarvesting profile={profile} />}
        {section === "market" && <CropManagementMarketInformation profile={profile} />}
      </div>

      <BottomNav />
    </div>
  );
}
