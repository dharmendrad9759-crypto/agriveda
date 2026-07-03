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
import CropIntelTabs from "@/components/crop/CropIntelTabs";
import ExpertAdviceCard from "@/components/query/ExpertAdviceCard";
import { getCropDashboard } from "@/data/crop-dashboard";
import { useCropManagement } from "@/lib/useCropManagement";
import { useMyCrops } from "@/hooks/useMyCrops";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CropDetailsPage({ params }: Props) {
  const { slug } = use(params);
  const crop = getCropDashboard(slug);
  const profile = useCropManagement(slug);
  const { crops, hydrated } = useMyCrops();

  if (!crop) {
    notFound();
  }

  return (
    <div className="agriveda-page relative pb-28">
      <PageBackground />
      <PageHeader
        title={crop.name}
        subtitle={`Stage: ${crop.currentStage} · DAS tracking active`}
        backHref="/"
      />

      <div className="relative border-b border-emerald-500/10 bg-black/20 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-2.5 overflow-x-auto px-4 py-3 scrollbar-hide">
          {hydrated &&
            crops.map((c) => (
              <Link
                key={c.slug}
                href={`/crop-details/${c.slug}`}
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-xl transition-all ${
                  c.slug === slug
                    ? "border border-emerald-400/50 bg-emerald-500/15 shadow-[0_0_16px_rgba(0,255,136,0.25)] scale-110"
                    : "border border-white/8 bg-black/30 hover:border-emerald-500/30"
                }`}
              >
                {c.emoji}
              </Link>
            ))}
          <Link
            href="/"
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 transition-transform hover:scale-105 hover:shadow-[0_0_12px_rgba(0,255,136,0.2)]"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="relative mx-auto max-w-lg space-y-7 px-4 py-6">
        <GlassCard neon className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-emerald-500/20 bg-emerald-500/10 text-4xl shadow-[0_0_16px_rgba(0,255,136,0.15)]">
              {crop.emoji}
            </div>
            <div>
              <h1 className="text-xl font-black text-white">{crop.name}</h1>
              <p className="mt-0.5 text-sm font-bold text-emerald-400">
                {crop.currentStage} · Active monitoring
              </p>
              {profile && (
                <p className="mt-0.5 text-[11px] italic text-slate-500">{profile.scientificName}</p>
              )}
            </div>
          </div>
        </GlassCard>

        <section>
          <SectionHeading title="Crop growth stages." subtitle="Days After Sowing (DAS)" />
          <CropTimeline stages={crop.growthStages} />
        </section>

        <section>
          <SectionHeading
            title="Pests and diseases."
            subtitle={`Stage: ${crop.currentStage}`}
            action={
              <Link href={`/pest-diseases?crop=${slug}`} className="text-sm font-bold text-emerald-400">
                View all
              </Link>
            }
          />
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {crop.pestsAndDiseases.map((pest) => (
              <Link key={pest.id} href={`/pest-diseases?crop=${slug}`}>
                <GlassCard hover className="w-32 flex-shrink-0 overflow-hidden p-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pest.image} alt={pest.name} className="h-24 w-full object-cover opacity-90" />
                  <p className="px-2 py-2.5 text-center text-xs font-bold text-emerald-300">{pest.name}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>

        {profile && (
          <section>
            <SectionHeading
              title="Agronomic intelligence."
              subtitle="Scientific protocols · Tap tabs to explore"
            />
            <CropIntelTabs profile={profile} />
          </section>
        )}

        <section>
          <SectionHeading title="Videos." />
          <GlassCard className="flex flex-col items-center px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
              <AlertCircle className="h-7 w-7 text-amber-400" />
            </div>
            <p className="mt-4 text-base font-extrabold text-white">No data available.</p>
            <p className="mt-1 text-sm text-slate-500">Video guides deploying soon.</p>
          </GlassCard>
        </section>

        <section>
          <SectionHeading
            title="Expert advice."
            action={
              <Link href="/community" className="text-sm font-bold text-emerald-400">
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
              <p className="text-sm text-slate-500">No expert advice yet for this crop.</p>
            </GlassCard>
          )}
          <Link
            href="/ask-query"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 py-3.5 text-sm font-black text-emerald-400 transition-all hover:shadow-[0_0_16px_rgba(0,255,136,0.15)]"
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
