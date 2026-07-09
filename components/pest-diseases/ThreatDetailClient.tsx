"use client";

import { useState, useEffect } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { Bug, FlaskConical, Leaf, ShieldAlert, Sparkles } from "lucide-react";
import type { EnrichedThreat } from "@/types/pest-disease-ui";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/types/pest-disease-ui";
import ThreatImage from "@/components/ui/ThreatImage";
import FarmerPhotoUpload from "@/components/pest-diseases/FarmerPhotoUpload";
import StageWiseSprayCard from "@/components/pest-diseases/StageWiseSprayCard";
import { readStorage } from "@/lib/storage";
import EtlGuideCard from "@/components/shell/EtlGuideCard";
import { AV } from "@/lib/design/tokens";

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

  const stageGuide = threat.stageSprays?.length
    ? {
        stages: threat.stageSprays,
        rotationNotes: threat.rotationNotes,
        extraNotes: threat.stageExtraNotes,
        continuousHarvest: threat.continuousHarvest,
      }
    : null;

  const backHref =
    threat.type === "weed"
      ? `/pest-diseases?type=weed&crop=${threat.cropSlug}`
      : `/pest-diseases?crop=${threat.cropSlug}`;

  return (
    <AppShell
      title={threat.name}
      subtitle={`${threat.cropName} · ${threat.type}`}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: threat.type === "weed" ? "Weeds" : "Pests & Diseases", href: backHref },
        { label: threat.name },
      ]}
    >
      <div className="overflow-hidden rounded-xl border border-[var(--av-border)]">
        {userPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={userPhoto} alt={threat.name} className="h-56 w-full object-cover lg:h-72" />
        ) : (
          <ThreatImage
            src={threat.image}
            alt={threat.name}
            category={threat.category}
            className="h-56 w-full lg:h-72"
          />
        )}
        {userPhoto && (
          <p className="bg-[var(--av-accent-soft)] px-3 py-1.5 text-center text-[10px] font-semibold text-[var(--av-accent)]">
            Your uploaded field photo
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`av-chip ${CATEGORY_COLORS[threat.category]}`}>
          {CATEGORY_LABELS[threat.category]}
        </span>
        <span className="av-chip">Stage: {threat.stage}</span>
        {threat.iracGroup && (
          <span className="av-chip border-red-500/30 bg-red-500/10 text-red-600">
            {threat.iracGroup}
          </span>
        )}
        {threat.fracGroup && threat.fracGroup !== "—" && (
          <span className="av-chip border-violet-500/30 bg-violet-500/10 text-violet-600">
            {threat.fracGroup}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <TypeIcon className="h-5 w-5 text-[var(--av-accent)]" />
        <div>
          <h1 className={AV.pageTitle}>{threat.name}</h1>
          <p className={`italic ${AV.micro}`}>{threat.scientificName}</p>
        </div>
      </div>

      <DarkCard className="mt-4" delay={0}>
        <h2 className={`flex items-center gap-2 ${AV.sectionTitle}`}>
          <FlaskConical className="h-4 w-4 text-[var(--av-accent)]" />
          Scientific description
        </h2>
        <p className={`mt-2 leading-relaxed ${AV.body}`}>{threat.description}</p>
      </DarkCard>

      <DarkCard className="mt-4" delay={1}>
        <h2 className={AV.sectionTitle}>Symptoms to identify</h2>
        <ul className="mt-3 space-y-2">
          {threat.symptoms.map((s, i) => (
            <li key={i} className={`flex gap-2 ${AV.body}`}>
              <span className="font-bold text-[var(--av-accent)]">•</span>
              {s}
            </li>
          ))}
        </ul>
      </DarkCard>

      {(threat.etl || threat.type === "pest") && (
        <div className="mt-4">
          <EtlGuideCard etl={threat.etl} pestName={threat.name} compact />
        </div>
      )}

      {stageGuide && (
        <DarkCard className="mt-4 border-violet-500/20" delay={2}>
          <h2 className={AV.sectionTitle}>Stage-wise spray guide</h2>
          <p className={AV.micro}>Early → Advanced escalation — CIB&RC label se verify karein</p>
          <div className="mt-3">
            <StageWiseSprayCard
              stages={stageGuide.stages}
              rotationNotes={stageGuide.rotationNotes}
              extraNotes={stageGuide.extraNotes}
              continuousHarvest={stageGuide.continuousHarvest}
            />
          </div>
        </DarkCard>
      )}

      <DarkCard className="mt-4" delay={3}>
        <h2 className={AV.sectionTitle}>Remediation — actionable steps</h2>
        <ul className="mt-3 space-y-2.5">
          {threat.remediation.map((r, i) => (
            <li key={i} className={`flex gap-2 ${AV.body}`}>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--av-accent)] text-[10px] font-bold text-white">
                {i + 1}
              </span>
              {r}
            </li>
          ))}
        </ul>
        {threat.activeIngredient && (
          <div className="av-card-inset mt-4 p-3">
            <p className={AV.label}>Recommended active ingredient</p>
            <p className="mt-1 text-sm font-semibold text-[var(--av-accent)]">
              {threat.activeIngredient}
            </p>
          </div>
        )}
      </DarkCard>

      <div className="mt-4">
        <FarmerPhotoUpload
          storageKey={storageKey}
          currentUrl={userPhoto}
          onUpload={setUserPhoto}
        />
      </div>

      <AppLink href="/ai-doctor" className={`mt-4 inline-flex gap-2 ${AV.btnSecondarySm}`}>
        <Sparkles className="h-4 w-4" />
        AI Doctor से confirm करें
      </AppLink>
    </AppShell>
  );
}
