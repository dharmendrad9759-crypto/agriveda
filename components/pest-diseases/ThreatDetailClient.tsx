"use client";

import { useEffect, useMemo, useState } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import RiskBadge from "@/components/shell/RiskBadge";
import {
  Bug,
  Leaf,
  ShieldAlert,
  Sparkles,
  Shield,
  Sprout,
  Wrench,
  Eye,
  FlaskConical,
} from "lucide-react";
import type { EnrichedThreat } from "@/types/pest-disease-ui";
import { CATEGORY_LABELS } from "@/types/pest-disease-ui";
import ThreatImage from "@/components/ui/ThreatImage";
import FarmerPhotoUpload from "@/components/pest-diseases/FarmerPhotoUpload";
import StageWiseSprayCard from "@/components/pest-diseases/StageWiseSprayCard";
import { readStorage } from "@/lib/storage";
import EtlGuideCard from "@/components/shell/EtlGuideCard";
import { AV } from "@/lib/design/tokens";
import { getCropHindiName } from "@/lib/crops/crop-display";

type Tab = "management" | "identify" | "symptoms" | "chemical";

function splitIpm(remediation: string[]) {
  const cultural: string[] = [];
  const mechanical: string[] = [];
  const biological: string[] = [];
  const leftover: string[] = [];

  for (const r of remediation) {
    if (/biological|parasitoid|predator|trichoderma|npv|pheromone|natural enem/i.test(r)) {
      biological.push(r);
    } else if (/mechanical|hand weed|trap|remove|plough|hoe|destroy|rogue/i.test(r)) {
      mechanical.push(r);
    } else if (
      /cultural|rotation|water|drain|sanitize|sowing|spacing|resistant|field hygiene|stale seed/i.test(r)
    ) {
      cultural.push(r);
    } else if (/spray|insecticide|fungicide|herbicide|@\s*\d|ml\/|g\/|kg\/|EC|WP|SC/i.test(r)) {
      leftover.push(r); // chemical-ish → show under chemical if no stage sprays
    } else {
      cultural.push(r);
    }
  }

  return { cultural, mechanical, biological, chemicalHints: leftover };
}

export default function ThreatDetailClient({ threat }: { threat: EnrichedThreat }) {
  const storageKey = `agriveda-threat-photo-${threat.cropSlug}-${threat.type}-${threat.id}`;
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("management");

  useEffect(() => {
    setUserPhoto(readStorage<string | null>(storageKey, null));
  }, [storageKey]);

  const TypeIcon = threat.type === "pest" ? Bug : threat.type === "disease" ? ShieldAlert : Leaf;
  const hindi = getCropHindiName(threat.cropSlug);
  const riskLevel = threat.category === "insect" ? "high" : "medium";
  const ipm = useMemo(() => splitIpm(threat.remediation), [threat.remediation]);

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

  const tabs: { id: Tab; label: string }[] = [
    { id: "management", label: "IPM Control" },
    { id: "identify", label: "Identify" },
    { id: "symptoms", label: "Symptoms" },
    { id: "chemical", label: "Chemical + Dose" },
  ];

  return (
    <AppShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Pests", href: backHref },
        { label: threat.name },
      ]}
    >
      <header className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <TypeIcon className="h-5 w-5 text-[var(--av-accent)]" />
          <h1 className={AV.pageTitle}>{threat.name}</h1>
          <RiskBadge level={riskLevel} label={riskLevel === "high" ? "High Risk" : "Medium"} />
        </div>
        <p className={`italic ${AV.micro}`}>{threat.scientificName}</p>
        <p className="text-xs text-[var(--av-text-muted)]">
          {threat.cropName}
          {hindi ? ` (${hindi})` : ""} · {CATEGORY_LABELS[threat.category]} · {threat.stage}
        </p>
      </header>

      {/* Official photo — separate from farmer upload */}
      <DarkCard className="mt-3 !p-2">
        <figure className="overflow-hidden rounded-xl">
          <ThreatImage
            src={threat.image}
            alt={threat.name}
            category={threat.category}
            className="h-44 w-full sm:h-52"
          />
          <figcaption className="border-t border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2">
            <p className="text-xs font-bold text-[var(--av-text-primary)]">{threat.name}</p>
            <p className="text-[10px] text-[var(--av-text-muted)]">Reference photo · {threat.scientificName}</p>
          </figcaption>
        </figure>
      </DarkCard>

      <div className="mt-3">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--av-text-muted)]">
          Your field photo (optional)
        </p>
        <FarmerPhotoUpload storageKey={storageKey} currentUrl={userPhoto} onUpload={setUserPhoto} compact />
      </div>

      <div className="mt-3 flex gap-1 overflow-x-auto border-b border-[var(--av-border)] scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 px-3 py-2.5 text-xs font-bold ${
              tab === t.id
                ? "border-b-2 border-[var(--av-accent)] text-[var(--av-accent)]"
                : "text-[var(--av-text-muted)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {tab === "management" && (
          <>
            {(
              [
                { title: "Cultural Control", icon: Sprout, items: ipm.cultural },
                { title: "Mechanical Control", icon: Wrench, items: ipm.mechanical },
                { title: "Biological Control", icon: Leaf, items: ipm.biological },
              ] as const
            ).map(({ title, icon: Icon, items }) => (
              <DarkCard key={title} className="!p-3">
                <p className="flex items-center gap-1.5 text-xs font-bold text-[var(--av-text-primary)]">
                  <Icon className="h-3.5 w-3.5 text-[var(--av-accent)]" />
                  {title}
                </p>
                {items.length ? (
                  <ul className="mt-2 space-y-1.5">
                    {items.map((item, i) => (
                      <li key={i} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
                        <span className="text-[var(--av-accent)]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-[11px] text-[var(--av-text-muted)]">
                    No specific {title.toLowerCase()} listed — follow field hygiene and scout weekly.
                  </p>
                )}
              </DarkCard>
            ))}
            <DarkCard className="!p-3 border-emerald-500/20">
              <p className="flex items-center gap-1.5 text-xs font-bold">
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
                Preventive
              </p>
              <p className="mt-1 text-xs text-[var(--av-text-secondary)]">{threat.description}</p>
            </DarkCard>
            {(threat.etl || threat.type === "pest") && (
              <EtlGuideCard etl={threat.etl} pestName={threat.name} compact />
            )}
          </>
        )}

        {tab === "identify" && (
          <DarkCard className="!p-3">
            <h2 className={`flex items-center gap-2 ${AV.sectionTitle}`}>
              <Eye className="h-4 w-4" /> How to identify
            </h2>
            <ul className="mt-2 space-y-2">
              {threat.symptoms.slice(0, 4).map((s, i) => (
                <li key={i} className="rounded-lg bg-[var(--av-surface-inset)] px-3 py-2 text-xs text-[var(--av-text-secondary)]">
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[10px] text-[var(--av-text-muted)]">
              Damage stage: <span className="font-semibold text-[var(--av-text-primary)]">{threat.stage}</span>
            </p>
          </DarkCard>
        )}

        {tab === "symptoms" && (
          <DarkCard className="!p-3">
            <h2 className={AV.sectionTitle}>Symptoms to watch</h2>
            <ul className="mt-3 space-y-2">
              {threat.symptoms.map((s, i) => (
                <li key={i} className={`flex gap-2 ${AV.body}`}>
                  <span className="font-bold text-[var(--av-accent)]">{i + 1}.</span>
                  {s}
                </li>
              ))}
            </ul>
          </DarkCard>
        )}

        {tab === "chemical" && (
          <>
            {stageGuide ? (
              <DarkCard className="border-violet-500/20 !p-3">
                <h2 className={`flex items-center gap-2 ${AV.sectionTitle}`}>
                  <FlaskConical className="h-4 w-4" /> Chemical Control — Dose by stage
                </h2>
                <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
                  Follow CIB&RC label. Always rotate MoA groups.
                </p>
                <div className="mt-3">
                  <StageWiseSprayCard
                    stages={stageGuide.stages}
                    rotationNotes={stageGuide.rotationNotes}
                    extraNotes={stageGuide.extraNotes}
                    continuousHarvest={stageGuide.continuousHarvest}
                  />
                </div>
              </DarkCard>
            ) : (
              <DarkCard className="!p-3">
                <h2 className={`flex items-center gap-2 ${AV.sectionTitle}`}>
                  <FlaskConical className="h-4 w-4" /> Chemical Control
                </h2>
                {threat.activeIngredient && (
                  <div className="mt-2 rounded-xl border border-violet-500/20 bg-violet-500/5 px-3 py-2">
                    <p className="text-[10px] font-bold uppercase text-violet-600">Recommended AI / Dose</p>
                    <p className="mt-0.5 text-sm font-semibold text-[var(--av-text-primary)]">
                      {threat.activeIngredient}
                    </p>
                  </div>
                )}
                <ul className="mt-3 space-y-2">
                  {(ipm.chemicalHints.length ? ipm.chemicalHints : threat.remediation.slice(0, 3)).map((r, i) => (
                    <li key={i} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--av-accent)] text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
                {(threat.iracGroup || threat.fracGroup) && (
                  <p className="mt-2 text-[10px] text-[var(--av-text-muted)]">
                    {threat.iracGroup && <>IRAC: {threat.iracGroup} · </>}
                    {threat.fracGroup && <>FRAC: {threat.fracGroup}</>}
                  </p>
                )}
              </DarkCard>
            )}
            {threat.rotationNotes && (
              <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-800 dark:text-amber-200">
                {threat.rotationNotes}
              </p>
            )}
          </>
        )}
      </div>

      <AppLink href="/ai-doctor" className={`mt-4 inline-flex gap-2 ${AV.btnSecondarySm}`}>
        <Sparkles className="h-4 w-4" />
        Confirm with AI Doctor
      </AppLink>
    </AppShell>
  );
}
