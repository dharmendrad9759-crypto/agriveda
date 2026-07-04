"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { deficiencies } from "@/data/deficiencies";
import CropAccordion from "@/components/deficiency/CropAccordion";
import PageBackground from "@/components/ui/PageBackground";
import BottomNav from "@/components/layout/BottomNav";
import GlassCard from "@/components/ui/GlassCard";
import { use } from "react";

interface Props {
  params: Promise<{ nutrient: string }>;
}

function BulletList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm theme-text-muted">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <GlassCard className="p-4">
      <h2 className="text-sm font-extrabold theme-text-primary">{title}</h2>
      <BulletList items={items} />
    </GlassCard>
  );
}

export default function NutrientDetailPage({ params }: Props) {
  const { nutrient: slug } = use(params);
  const nutrient = deficiencies.find((item) => item.slug === slug);

  if (!nutrient) {
    return (
      <main className="agriveda-page flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="theme-text-primary">Nutrient not found.</p>
          <Link href="/deficiencies" className="mt-4 inline-block text-sm font-bold text-emerald-600">
            Back
          </Link>
        </div>
      </main>
    );
  }

  const symptoms = Array.from(
    new Set([...(nutrient.generalSymptoms || []), ...(nutrient.visualSymptoms || [])])
  );

  return (
    <main className="agriveda-page relative min-h-screen pb-28">
      <PageBackground />

      <header className="sticky top-0 z-40 border-b border-emerald-500/10 bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link
            href="/deficiencies"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 text-emerald-600"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-base font-extrabold theme-text-primary">
              {nutrient.icon} {nutrient.name}
              <span className="ml-2 text-sm font-bold theme-text-muted">{nutrient.symbol}</span>
            </h1>
            <p className="truncate text-[11px] theme-text-muted">{nutrient.role}</p>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-lg space-y-3 px-4 py-5">
        <GlassCard className="p-4">
          <p className="text-sm leading-relaxed theme-text-muted">{nutrient.summary}</p>
        </GlassCard>

        <Section title="Symptoms" items={symptoms} />
        <Section title="Why it happens" items={nutrient.whyItHappens} />
        <Section title="How to confirm" items={nutrient.confirmation} />
        <Section title="Prevention" items={nutrient.prevention} />

        <GlassCard className="p-4">
          <h2 className="text-sm font-extrabold theme-text-primary">How to fix</h2>
          <div className="mt-3 space-y-3">
            {nutrient.corrections.map((item) => (
              <div key={item.title} className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3">
                <p className="text-xs font-bold text-emerald-600">{item.title}</p>
                <BulletList items={item.details} />
              </div>
            ))}
          </div>
          {nutrient.foliar && (
            <p className="mt-3 text-xs theme-text-muted">
              <span className="font-bold theme-text-primary">Foliar: </span>
              {nutrient.foliar}
            </p>
          )}
          {nutrient.soilApplication && (
            <p className="mt-2 text-xs theme-text-muted">
              <span className="font-bold theme-text-primary">Soil: </span>
              {nutrient.soilApplication}
            </p>
          )}
        </GlassCard>

        {nutrient.cropSpecificData.length > 0 && (
          <GlassCard className="p-4">
            <h2 className="mb-3 text-sm font-extrabold theme-text-primary">Crop-wise notes</h2>
            <CropAccordion crops={nutrient.cropSpecificData} />
          </GlassCard>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
