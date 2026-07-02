"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, AlertCircle, ChevronRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import PageBackground from "@/components/ui/PageBackground";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import CropTimeline from "@/components/crop/CropTimeline";
import AgronomicAccordion from "@/components/crop/AgronomicAccordion";
import ExpertAdviceCard from "@/components/query/ExpertAdviceCard";
import { getCropDashboard } from "@/data/crop-dashboard";
import { useMyCrops } from "@/hooks/useMyCrops";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CropDetailsPage({ params }: Props) {
  const { slug } = use(params);
  const crop = getCropDashboard(slug);
  const { crops, hydrated } = useMyCrops();

  if (!crop) {
    notFound();
  }

  const agronomicSections = [
    crop.sowingGuide,
    crop.fertilizerSchedule,
    crop.irrigationManagement,
    crop.nutrientDeficiency,
    crop.harvestingYield,
    crop.marketInformation,
  ];

  return (
    <div className="agriveda-page relative pb-28">
      <PageBackground />
      <PageHeader title={crop.name} subtitle={`Current stage: ${crop.currentStage}`} backHref="/" />

      {/* Crop selector strip */}
      <div className="relative border-b border-white/40 bg-white/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-2.5 overflow-x-auto px-4 py-3 scrollbar-hide">
          {hydrated &&
            crops.map((c) => (
              <Link
                key={c.slug}
                href={`/crop-details/${c.slug}`}
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-xl transition-all ${
                  c.slug === slug
                    ? "agriveda-glass-strong scale-110 ring-2 ring-emerald-500 shadow-md"
                    : "bg-white/60 hover:bg-white/80"
                }`}
              >
                {c.emoji}
              </Link>
            ))}
          <Link
            href="/"
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-md transition-transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="relative mx-auto max-w-lg space-y-7 px-4 py-6">
        {/* Hero card */}
        <GlassCard strong className="overflow-hidden p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-100 to-green-50 text-4xl shadow-inner">
              {crop.emoji}
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">{crop.name}</h1>
              <p className="mt-0.5 text-sm font-semibold text-emerald-700">
                Stage: {crop.currentStage}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Growth stages — DAS */}
        <section>
          <SectionHeading
            title="Crop growth stages."
            subtitle="Days After Sowing (DAS)"
          />
          <CropTimeline stages={crop.growthStages} />
        </section>

        {/* Pests and diseases */}
        <section>
          <SectionHeading
            title="Pests and diseases."
            subtitle={`Showing results for ${crop.currentStage} stage`}
            action={
              <Link href={`/crops/${slug}`} className="text-sm font-bold text-emerald-600">
                View all
              </Link>
            }
          />
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {crop.pestsAndDiseases.map((pest) => (
              <GlassCard key={pest.id} hover className="w-32 flex-shrink-0 overflow-hidden p-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pest.image} alt={pest.name} className="h-24 w-full object-cover" />
                <p className="px-2 py-2.5 text-center text-xs font-bold text-slate-800">
                  {pest.name}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Agronomic best practices — accordions */}
        <section>
          <SectionHeading
            title="Best practices."
            subtitle="Tap each section for detailed guidance"
          />
          <AgronomicAccordion sections={agronomicSections} />
        </section>

        {/* Videos placeholder */}
        <section>
          <SectionHeading title="Videos." />
          <GlassCard strong className="flex flex-col items-center px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50">
              <AlertCircle className="h-7 w-7 text-orange-500" />
            </div>
            <p className="mt-4 text-base font-extrabold text-slate-900">No data available.</p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Video guides for this crop will appear here soon.
            </p>
          </GlassCard>
        </section>

        {/* Expert advice */}
        <section>
          <SectionHeading
            title="Expert advice."
            action={
              <Link href="/community" className="text-sm font-bold text-emerald-600">
                View all
              </Link>
            }
          />
          {crop.expertAdvice.length > 0 ? (
            <div className="space-y-3">
              {crop.expertAdvice.map((advice) => (
                <ExpertAdviceCard key={advice.id} advice={advice} />
              ))}
            </div>
          ) : (
            <GlassCard className="p-6 text-center">
              <p className="text-sm font-medium text-slate-500">
                No expert advice yet for this crop.
              </p>
            </GlassCard>
          )}
          <Link
            href="/ask-query"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-emerald-500/30 bg-white/60 py-3.5 text-sm font-bold text-emerald-700 backdrop-blur-sm transition-colors hover:bg-emerald-50"
          >
            Ask query
            <ChevronRight className="h-4 w-4" />
          </Link>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
