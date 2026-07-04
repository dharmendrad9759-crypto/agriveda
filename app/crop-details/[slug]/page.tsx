"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, ChevronRight, ArrowLeft } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import PageBackground from "@/components/ui/PageBackground";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import CropTimeline from "@/components/crop/CropTimeline";
import CropQuickFacts from "@/components/crop/CropQuickFacts";
import CropCategoryGuide from "@/components/crop/CropCategoryGuide";
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

      <header className="sticky top-0 z-40 border-b border-emerald-500/10 bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 text-emerald-600"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 truncate text-base font-extrabold theme-text-primary">{crop.name}</h1>
        </div>
      </header>

      <div className="relative border-b border-emerald-500/10 bg-black/10 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-2.5 overflow-x-auto px-4 py-3 scrollbar-hide">
          {hydrated &&
            crops.map((c) => (
              <Link
                key={c.slug}
                href={`/crop-details/${c.slug}`}
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-xl transition-all ${
                  c.slug === slug
                    ? "scale-110 border border-emerald-400/50 bg-emerald-500/15"
                    : "border border-white/8 bg-black/30"
                }`}
              >
                {c.emoji}
              </Link>
            ))}
          <Link
            href="/select-crops"
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="relative mx-auto max-w-lg space-y-6 px-4 py-5">
        <GlassCard className="flex items-center gap-4 p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-3xl">
            {crop.emoji}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-black theme-text-primary">{crop.name}</h1>
            {profile && (
              <p className="text-[11px] italic theme-text-muted">{profile.scientificName}</p>
            )}
            <p className="mt-0.5 text-xs font-bold text-emerald-600">Now: {crop.currentStage}</p>
          </div>
        </GlassCard>

        <section>
          <SectionHeading title="Growth stages" subtitle="Days after sowing" />
          <CropTimeline
            stages={crop.growthStages}
            labels={{ current: "Now", done: "Done", upcoming: "Next" }}
          />
        </section>

        {profile && (
          <section>
            <SectionHeading title="At a glance" subtitle="Key facts for this crop" />
            <CropQuickFacts profile={profile} />
          </section>
        )}

        <section>
          <SectionHeading
            title="Pests & diseases"
            action={
              <Link href={`/pest-diseases?crop=${slug}`} className="text-sm font-bold text-emerald-500">
                See all
              </Link>
            }
          />
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {crop.pestsAndDiseases.map((pest) => {
              const threatType = pest.id.startsWith("d")
                ? "disease"
                : pest.id.startsWith("w")
                  ? "weed"
                  : "pest";
              const detailHref = /^[pdw]\d+$/.test(pest.id)
                ? `/pest-diseases/${slug}/${threatType}/${pest.id}`
                : `/pest-diseases?crop=${slug}`;
              return (
                <Link key={pest.id} href={detailHref}>
                  <GlassCard hover className="w-28 flex-shrink-0 overflow-hidden p-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pest.image} alt={pest.name} className="h-20 w-full object-cover" />
                    <p className="px-2 py-2 text-center text-[11px] font-bold theme-text-primary">
                      {pest.name}
                    </p>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </section>

        {profile && (
          <section>
            <SectionHeading title="Crop guide" subtitle="Open one topic at a time" />
            <CropCategoryGuide cropSlug={slug} />
          </section>
        )}

        <section>
          <SectionHeading
            title="Expert tips"
            action={
              <Link href="/community" className="text-sm font-bold text-emerald-500">
                See all
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
            <GlassCard className="p-4 text-center text-sm theme-text-muted">
              No tips yet for this crop.
            </GlassCard>
          )}
          <Link
            href="/ask-query"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006432] py-3.5 text-sm font-black text-white"
          >
            Ask expert
            <ChevronRight className="h-4 w-4" />
          </Link>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
