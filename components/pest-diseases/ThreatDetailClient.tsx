"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bug, FlaskConical, Leaf, ShieldAlert, Sparkles } from "lucide-react";
import type { EnrichedThreat } from "@/types/pest-disease-ui";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/types/pest-disease-ui";
import PageBackground from "@/components/ui/PageBackground";
import BottomNav from "@/components/layout/BottomNav";
import GlassCard from "@/components/ui/GlassCard";
import FarmerPhotoUpload from "@/components/pest-diseases/FarmerPhotoUpload";
import { readStorage } from "@/lib/storage";

interface ThreatDetailClientProps {
  threat: EnrichedThreat;
}

export default function ThreatDetailClient({ threat }: ThreatDetailClientProps) {
  const storageKey = `agriveda-threat-photo-${threat.cropSlug}-${threat.type}-${threat.id}`;
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  useEffect(() => {
    setUserPhoto(readStorage<string | null>(storageKey, null));
  }, [storageKey]);

  const TypeIcon =
    threat.type === "pest" ? Bug : threat.type === "disease" ? ShieldAlert : Leaf;

  return (
    <div className="agriveda-page relative min-h-screen pb-28">
      <PageBackground />

      <header className="sticky top-0 z-40 border-b border-emerald-500/10 bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
          <Link
            href={`/pest-diseases?crop=${threat.cropSlug}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold theme-text-primary">{threat.name}</p>
            <p className="text-[11px] theme-text-muted">
              {threat.cropName} • {threat.type}
            </p>
          </div>
        </div>
      </header>

      <article className="relative mx-auto max-w-lg space-y-5 px-4 py-5">
        <div className="overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={userPhoto ?? threat.image}
            alt={threat.name}
            className="h-56 w-full object-cover"
          />
          {userPhoto && (
            <p className="bg-emerald-500/10 px-3 py-1.5 text-center text-[10px] font-bold text-emerald-600">
              Your uploaded field photo
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${CATEGORY_COLORS[threat.category]}`}>
            {CATEGORY_LABELS[threat.category]}
          </span>
          <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-bold theme-text-muted dark:border-white/10 dark:bg-black/20">
            Stage: {threat.stage}
          </span>
          {threat.iracGroup && (
            <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-600">
              {threat.iracGroup}
            </span>
          )}
          {threat.fracGroup && threat.fracGroup !== "—" && (
            <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-600">
              {threat.fracGroup}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <TypeIcon className="h-5 w-5 text-emerald-600" />
            <h1 className="text-xl font-black theme-text-primary">{threat.name}</h1>
          </div>
          <p className="mt-1 text-sm italic theme-text-muted">{threat.scientificName}</p>
        </div>

        <GlassCard className="p-4">
          <h2 className="flex items-center gap-2 text-sm font-extrabold theme-text-primary">
            <FlaskConical className="h-4 w-4 text-emerald-500" />
            Scientific description
          </h2>
          <p className="mt-2 text-sm leading-relaxed theme-text-muted">{threat.description}</p>
        </GlassCard>

        <GlassCard className="p-4">
          <h2 className="text-sm font-extrabold theme-text-primary">Symptoms to identify</h2>
          <ul className="mt-3 space-y-2">
            {threat.symptoms.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm theme-text-muted">
                <span className="font-bold text-emerald-600">•</span>
                {s}
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="border-emerald-500/20 bg-emerald-500/5 p-4">
          <h2 className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300">
            Remediation — actionable steps
          </h2>
          <ul className="mt-3 space-y-2.5">
            {threat.remediation.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm theme-text-primary">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                {r}
              </li>
            ))}
          </ul>
          {threat.activeIngredient && (
            <div className="mt-4 rounded-xl bg-white/80 p-3 dark:bg-black/30">
              <p className="text-[10px] font-bold uppercase tracking-wider theme-text-muted">
                Recommended active ingredient
              </p>
              <p className="mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {threat.activeIngredient}
              </p>
            </div>
          )}
          {threat.etl && (
            <p className="mt-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
              Economic Threshold Level (ETL): {threat.etl}
            </p>
          )}
        </GlassCard>

        <FarmerPhotoUpload
          storageKey={storageKey}
          currentUrl={userPhoto}
          onUpload={setUserPhoto}
        />

        <Link
          href={`/ai-doctor`}
          className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 py-3.5 text-sm font-bold text-emerald-700 dark:text-emerald-400"
        >
          <Sparkles className="h-4 w-4" />
          AI Doctor से confirm करें
        </Link>
      </article>

      <BottomNav />
    </div>
  );
}
