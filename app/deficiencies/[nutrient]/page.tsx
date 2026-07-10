"use client";

import { use } from "react";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import { getNutrientDeficiency } from "@/data/deficiencies";
import NutrientDetailExperience from "@/components/deficiency/premium/NutrientDetailExperience";
import { AV } from "@/lib/design/tokens";

interface Props {
  params: Promise<{ nutrient: string }>;
}

function NutrientDetailSkeleton() {
  return (
    <div className="mx-auto max-w-lg animate-pulse space-y-4 px-4 py-6">
      <div className="h-64 rounded-[28px] bg-white/5" />
      <div className="h-12 rounded-2xl bg-white/5" />
      <div className="h-40 rounded-2xl bg-white/5" />
      <div className="h-40 rounded-2xl bg-white/5" />
    </div>
  );
}

export default function NutrientDetailPage({ params }: Props) {
  const { nutrient: slug } = use(params);
  const nutrient = getNutrientDeficiency(slug);

  if (!nutrient) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <DarkCard className="text-center">
          <p className="text-[var(--av-text-primary)]">यह पोषक तत्व नहीं मिला।</p>
          <AppLink href="/deficiencies" className={`mt-4 inline-flex ${AV.btnPrimarySm}`}>
            वापस जाएँ
          </AppLink>
        </DarkCard>
      </div>
    );
  }

  return <NutrientDetailExperience nutrient={nutrient} />;
}

export { NutrientDetailSkeleton };
