"use client";

import { use } from "react";
import AppLink from "@/components/ui/AppLink";
import SchemeGuideWizard from "@/components/schemes/SchemeGuideWizard";
import { getSchemeGuide } from "@/data/schemes/schemeGuides";
import { AV } from "@/lib/design/tokens";

export default function SchemeGuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const guide = getSchemeGuide(id);

  if (!guide) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-center">
        <p className="font-display text-lg font-bold text-[var(--av-text-primary)]">
          गाइड नहीं मिली
        </p>
        <p className="mt-2 text-sm text-[var(--av-text-muted)]">
          KCC, PM-KISAN, फसल बीमा, यंत्र या मिट्टी कार्ड चुनें।
        </p>
        <AppLink href="/schemes" className={`mt-5 inline-flex ${AV.btnPrimarySm}`}>
          योजना सूची
        </AppLink>
      </div>
    );
  }

  return <SchemeGuideWizard guide={guide} />;
}
