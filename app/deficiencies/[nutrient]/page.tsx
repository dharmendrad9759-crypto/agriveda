"use client";

import { use } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { deficiencies } from "@/data/deficiencies";
import CropAccordion from "@/components/deficiency/CropAccordion";
import { AV } from "@/lib/design/tokens";

interface Props {
  params: Promise<{ nutrient: string }>;
}

function BulletList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item) => (
        <li key={item} className={`flex gap-2 ${AV.body}`}>
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--av-accent)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <DarkCard>
      <h2 className={AV.sectionTitle}>{title}</h2>
      <BulletList items={items} />
    </DarkCard>
  );
}

export default function NutrientDetailPage({ params }: Props) {
  const { nutrient: slug } = use(params);
  const nutrient = deficiencies.find((item) => item.slug === slug);

  if (!nutrient) {
    return (
      <AppShell title="Not found" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Deficiencies", href: "/deficiencies" }]}>
        <DarkCard className="text-center">
          <p className="text-[var(--av-text-primary)]">Nutrient not found.</p>
          <AppLink href="/deficiencies" className={`mt-4 inline-flex ${AV.btnPrimarySm}`}>
            Back to list
          </AppLink>
        </DarkCard>
      </AppShell>
    );
  }

  const symptoms = Array.from(
    new Set([...(nutrient.generalSymptoms || []), ...(nutrient.visualSymptoms || [])])
  );

  return (
    <AppShell
      title={`${nutrient.icon} ${nutrient.name}`}
      subtitle={`${nutrient.symbol} · ${nutrient.role}`}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Deficiencies", href: "/deficiencies" },
        { label: nutrient.name },
      ]}
    >
      <div className="space-y-4">
        <DarkCard>
          <p className={`leading-relaxed ${AV.body}`}>{nutrient.summary}</p>
        </DarkCard>

        <Section title="Symptoms" items={symptoms} />
        <Section title="Why it happens" items={nutrient.whyItHappens} />
        <Section title="How to confirm" items={nutrient.confirmation} />
        <Section title="Prevention" items={nutrient.prevention} />

        <DarkCard>
          <h2 className={AV.sectionTitle}>How to fix</h2>
          <div className="mt-3 space-y-3">
            {nutrient.corrections.map((item) => (
              <div key={item.title} className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
                <p className="text-xs font-bold text-[var(--av-accent)]">{item.title}</p>
                <BulletList items={item.details} />
              </div>
            ))}
          </div>
          {nutrient.foliar && (
            <p className={`mt-3 ${AV.micro}`}>
              <span className="font-bold text-[var(--av-text-primary)]">Foliar: </span>
              {nutrient.foliar}
            </p>
          )}
          {nutrient.soilApplication && (
            <p className={`mt-2 ${AV.micro}`}>
              <span className="font-bold text-[var(--av-text-primary)]">Soil: </span>
              {nutrient.soilApplication}
            </p>
          )}
        </DarkCard>

        {nutrient.cropSpecificData.length > 0 && (
          <DarkCard>
            <h2 className={`mb-3 ${AV.sectionTitle}`}>Crop-wise notes</h2>
            <CropAccordion crops={nutrient.cropSpecificData} />
          </DarkCard>
        )}
      </div>
    </AppShell>
  );
}
