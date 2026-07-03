"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { deficiencies } from "@/data/deficiencies";
import DeficiencyHero from "@/components/deficiency/DeficiencyHero";
import InfoSection from "@/components/deficiency/InfoSection";
import CropAccordion from "@/components/deficiency/CropAccordion";
import { Leaf, Microscope, Droplets, ShieldCheck, Sparkles } from "lucide-react";
import { use } from "react";

interface Props {
  params: Promise<{ nutrient: string }>;
}

export default function NutrientDetailPage({ params }: Props) {
  const { nutrient: slug } = use(params);
  const nutrient = deficiencies.find((item) => item.slug === slug);

  if (!nutrient) {
    return (
      <main className="min-h-screen px-4 py-10 text-center">
        <p className="text-white">Nutrient not found.</p>
        <Link href="/deficiencies" className="mt-4 inline-block text-emerald-400">
          Back to deficiencies
        </Link>
      </main>
    );
  }

  const roleItems = nutrient.quickFacts.length > 0 ? nutrient.quickFacts : nutrient.generalSymptoms;
  const symptomItems = Array.from(new Set([...(nutrient.generalSymptoms || []), ...(nutrient.visualSymptoms || [])]));

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <Link
          href="/deficiencies"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all nutrients
        </Link>

        <DeficiencyHero nutrient={nutrient} />

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <InfoSection
              title="Plant role & importance"
              description="Why this nutrient matters for growth, metabolism, and crop performance"
              items={roleItems}
              icon={<Leaf className="h-5 w-5 text-emerald-400" />}
            />
            <InfoSection
              title="Visible deficiency symptoms"
              description="Early signs, severe patterns, and field-level impact"
              items={symptomItems}
              icon={<Microscope className="h-5 w-5 text-sky-400" />}
            />
            <InfoSection
              title="Key causes of deficiency"
              description="The common agronomic and soil-driven reasons behind the problem"
              items={nutrient.whyItHappens}
              icon={<Droplets className="h-5 w-5 text-cyan-400" />}
            />
          </div>

          <div className="space-y-6">
            <InfoSection
              title="Field diagnosis"
              description="How to distinguish deficiency from disease, herbicide injury, or water stress"
              items={nutrient.confirmation}
              icon={<ShieldCheck className="h-5 w-5 text-purple-400" />}
            />
            <section className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_10px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <h2 className="text-xl font-semibold text-white">Corrective measures</h2>
              </div>
              <div className="mt-5 space-y-4">
                {nutrient.corrections.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm font-semibold text-emerald-300">{item.title}</p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-300">
                      {item.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <section className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_10px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Crop-wise guide</p>
              <h2 className="text-2xl font-semibold text-white">Supported crop intelligence</h2>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200">
              {nutrient.cropSpecificData.length} crop profiles
            </div>
          </div>
          <CropAccordion crops={nutrient.cropSpecificData} />
        </section>
      </div>
    </main>
  );
}
