"use client";

import { use } from "react";
import AppLink from "@/components/ui/AppLink";
import { getNutrientDeficiency } from "@/data/deficiencies";
import NutrientDetailExperience from "@/components/deficiency/premium/NutrientDetailExperience";
import { AV } from "@/lib/design/tokens";

interface Props {
  params: Promise<{ nutrient: string }>;
  searchParams: Promise<{ crop?: string }>;
}

function NutrientDetailSkeleton() {
  return (
    <div className="relative mx-auto max-w-lg animate-pulse space-y-4 px-4 py-6">
      <div className="h-4 w-36 rounded-md bg-emerald-500/10" />
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-emerald-500/15" />
        <div className="flex-1 space-y-2">
          <div className="h-7 w-2/3 rounded-lg bg-emerald-500/12" />
          <div className="h-3 w-24 rounded bg-emerald-500/10" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-16 rounded-xl bg-emerald-500/10" />
        <div className="h-9 w-20 rounded-xl bg-emerald-500/10" />
        <div className="h-9 w-16 rounded-xl bg-emerald-500/10" />
      </div>
      <div className="h-32 rounded-[20px] border border-emerald-500/10 bg-emerald-500/[0.06]" />
      <div className="h-10 rounded-xl bg-emerald-500/8" />
      <div className="h-24 rounded-2xl border border-emerald-500/10 bg-[var(--av-surface)]" />
    </div>
  );
}

export default function NutrientDetailPage({ params, searchParams }: Props) {
  const { nutrient: slug } = use(params);
  const { crop: cropParam } = use(searchParams);
  const nutrient = getNutrientDeficiency(slug);

  if (!nutrient) {
    return (
      <div className="relative mx-auto max-w-lg px-4 py-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-4 h-40 bg-[radial-gradient(ellipse_at_30%_0%,rgba(16,185,129,0.14),transparent_55%)]"
        />
        <div className="relative rounded-[22px] border border-[var(--av-border)] bg-[var(--av-surface)] p-6 text-center shadow-[var(--av-shadow-sm)]">
          <p className="font-display text-lg font-bold text-[var(--av-text-primary)]">
            पोषक तत्व नहीं मिला
          </p>
          <p className="mt-2 text-sm text-[var(--av-text-muted)]">
            यह स्लग लाइब्रेरी में नहीं है — सूची से कोई और चुनें।
          </p>
          <AppLink href="/deficiencies" className={`mt-5 inline-flex ${AV.btnPrimarySm}`}>
            पोषक तत्व लाइब्रेरी
          </AppLink>
        </div>
      </div>
    );
  }

  return <NutrientDetailExperience nutrient={nutrient} initialCrop={cropParam} />;
}

export { NutrientDetailSkeleton };
