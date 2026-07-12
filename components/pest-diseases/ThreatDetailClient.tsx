"use client";

import { useState } from "react";
import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import RiskBadge from "@/components/shell/RiskBadge";
import { GaugeChart } from "@/components/shell/charts";
import {
  Bug,
  Leaf,
  ShieldAlert,
  Sparkles,
  Share2,
  BookmarkPlus,
  Shield,
  Sprout,
  Wrench,
  Eye,
  Clock,
  Droplets,
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
import { useEffect } from "react";

const DETAIL_TABS = ["Management", "Identification", "Symptoms", "Monitoring", "ETL", "Life Cycle", "Notes"] as const;

const IDENT_IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=160&h=120&fit=crop",
  "https://images.unsplash.com/photo-1592840067980-057d97d26f4a?w=160&h=120&fit=crop",
  "https://images.unsplash.com/photo-1536304575081-ff8c827fd69f?w=160&h=120&fit=crop",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=160&h=120&fit=crop",
];

interface ThreatDetailClientProps {
  threat: EnrichedThreat;
}

export default function ThreatDetailClient({ threat }: ThreatDetailClientProps) {
  const storageKey = `agriveda-threat-photo-${threat.cropSlug}-${threat.type}-${threat.id}`;
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof DETAIL_TABS)[number]>("Management");

  useEffect(() => {
    setUserPhoto(readStorage<string | null>(storageKey, null));
  }, [storageKey]);

  const TypeIcon = threat.type === "pest" ? Bug : threat.type === "disease" ? ShieldAlert : Leaf;
  const hindi = getCropHindiName(threat.cropSlug);
  const riskLevel = threat.category === "insect" ? "high" : "medium";

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

  const ipmSections = [
    { title: "Preventive Measures", icon: Shield, items: threat.remediation.filter((r) => /prevent|monitor|scout/i.test(r)).slice(0, 3) },
    { title: "Cultural Control", icon: Sprout, items: threat.remediation.filter((r) => /cultural|field|water|drain/i.test(r)).slice(0, 3) },
    { title: "Biological Control", icon: Leaf, items: threat.remediation.filter((r) => /biological|natural|parasitoid|predator/i.test(r)).slice(0, 3) },
    { title: "Mechanical Control", icon: Wrench, items: threat.remediation.filter((r) => /mechanical|hand|trap|remove/i.test(r)).slice(0, 2) },
  ].map((s) => ({
    ...s,
    items: s.items.length ? s.items : threat.remediation.slice(0, 2),
  }));

  return (
    <AppShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Pests", href: backHref },
        { label: `${threat.name} in ${threat.cropName}` },
      ]}
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <TypeIcon className="h-6 w-6 text-[var(--av-accent)]" />
            <h1 className={AV.pageTitle}>{threat.name}</h1>
            <RiskBadge level={riskLevel} label="High Risk" />
          </div>
          <p className={`mt-1 italic ${AV.micro}`}>{threat.scientificName}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className={`inline-flex items-center gap-1.5 ${AV.btnSecondarySm}`}>
            <BookmarkPlus className="h-3.5 w-3.5" />
            Add to My List
          </button>
          <button type="button" className={`inline-flex items-center gap-1.5 ${AV.btnSecondarySm}`}>
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        </div>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {[
          { label: "Also Known As", value: threat.name.includes("Borer") ? "Yellow Stem Borer" : threat.name },
          { label: "Affects Crop", value: `${threat.cropName}${hindi ? ` (${hindi})` : ""}` },
          { label: "Order", value: threat.type === "pest" ? "Lepidoptera" : CATEGORY_LABELS[threat.category] },
          { label: "Nature", value: threat.type === "pest" ? "Insect Pest" : "Plant Disease" },
        ].map((stat) => (
          <div key={stat.label} className="av-card-inset p-3 text-center">
            <p className={AV.label}>{stat.label}</p>
            <p className="mt-1 text-xs font-bold text-[var(--av-text-primary)]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <DarkCard className="lg:col-span-8" hover>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="overflow-hidden rounded-xl">
              {userPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userPhoto} alt={threat.name} className="h-40 w-full object-cover" />
              ) : (
                <ThreatImage src={threat.image} alt={threat.name} category={threat.category} className="h-40 w-full" />
              )}
            </div>
            <div className="space-y-2 text-xs text-[var(--av-text-secondary)]">
              <p><span className="font-bold text-[var(--av-text-primary)]">Life Cycle:</span> Egg → Larva → Pupa → Adult</p>
              <p><span className="font-bold text-[var(--av-text-primary)]">Favorable Conditions:</span> Humid, warm, dense canopy</p>
              <p><span className="font-bold text-[var(--av-text-primary)]">Larval Duration:</span> 18–25 days</p>
            </div>
            <div className="space-y-2 text-xs text-[var(--av-text-secondary)]">
              <p><span className="font-bold text-[var(--av-text-primary)]">Damage Stage:</span> {threat.stage}</p>
              <p><span className="font-bold text-[var(--av-text-primary)]">Generations:</span> 3–4 per season</p>
              <p><span className="font-bold text-[var(--av-text-primary)]">Attack Period:</span> Tillering to heading</p>
            </div>
          </div>
        </DarkCard>

        <DarkCard className="lg:col-span-4" hover delay={1}>
          <p className="text-xs font-bold text-[var(--av-text-primary)]">Risk Status</p>
          <GaugeChart value={riskLevel === "high" ? 82 : 55} label={riskLevel === "high" ? "High Risk" : "Medium Risk"} />
          <p className={`mt-2 text-center ${AV.micro}`}>
            Scout field regularly — early action prevents yield loss
          </p>
        </DarkCard>
      </div>

      <div className="mt-4 flex gap-1 overflow-x-auto border-b border-[var(--av-border)] pb-px scrollbar-hide">
        {DETAIL_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-3 py-2.5 text-xs font-semibold ${
              activeTab === tab
                ? "border-b-2 border-[var(--av-accent)] text-[var(--av-accent)]"
                : "text-[var(--av-text-muted)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DarkCard hover>
          <h2 className={`flex items-center gap-2 ${AV.sectionTitle}`}>
            <Shield className="h-4 w-4 text-[var(--av-accent)]" />
            Integrated Pest Management (IPM)
          </h2>
          <div className="mt-3 space-y-3">
            {ipmSections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="av-card-inset p-3">
                  <p className="flex items-center gap-2 text-xs font-bold text-[var(--av-text-primary)]">
                    <Icon className="h-3.5 w-3.5 text-[var(--av-accent)]" />
                    {section.title}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {section.items.map((item, i) => (
                      <li key={i} className={`flex gap-2 ${AV.micro}`}>
                        <span className="text-[var(--av-accent)]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </DarkCard>

        <div className="space-y-4">
          {stageGuide ? (
            <DarkCard className="border-violet-500/20" hover>
              <h2 className={AV.sectionTitle}>Chemical Control</h2>
              <p className={AV.micro}>Early → Hard escalation — verify CIB&RC label</p>
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
            <DarkCard hover>
              <h2 className={AV.sectionTitle}>Remediation</h2>
              <ul className="mt-3 space-y-2">
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
                  <p className="mt-1 text-sm font-semibold text-[var(--av-accent)]">{threat.activeIngredient}</p>
                </div>
              )}
            </DarkCard>
          )}
        </div>
      </div>

      {threat.rotationNotes && (
        <DarkCard className="mt-4 border-indigo-200 bg-indigo-50/50 dark:border-indigo-500/20 dark:bg-indigo-500/5">
          <h3 className="text-xs font-bold text-[var(--av-text-primary)]">Next Spray Guidance</h3>
          <p className="mt-2 text-sm text-[var(--av-text-secondary)]">{threat.rotationNotes}</p>
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[10px] font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
            Always rotate insecticides with different IRAC groups to delay resistance development.
          </p>
        </DarkCard>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-5">
        {[
          { icon: Clock, label: "PHI", value: "21 Days" },
          { icon: Eye, label: "REI", value: "24 Hours" },
          { icon: Droplets, label: "Best Time", value: "Morning / Evening" },
          { icon: Droplets, label: "Rainfastness", value: "6 Hours" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="av-card-inset flex items-center gap-2 p-2.5">
              <Icon className="h-4 w-4 text-[var(--av-accent)]" />
              <div>
                <p className={AV.label}>{s.label}</p>
                <p className="text-xs font-bold text-[var(--av-text-primary)]">{s.value}</p>
              </div>
            </div>
          );
        })}
        <div className="col-span-2 flex items-center rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-semibold text-amber-800 lg:col-span-1 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          Avoid spray during heavy rain
        </div>
      </div>

      {(threat.etl || threat.type === "pest") && (
        <div className="mt-4">
          <EtlGuideCard etl={threat.etl} pestName={threat.name} compact />
        </div>
      )}

      <DarkCard className="mt-4" hover>
        <h2 className={`flex items-center gap-2 ${AV.sectionTitle}`}>
          <Eye className="h-4 w-4" />
          Identification Guide
        </h2>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {["Adult Moth", "Egg Mass", "Larva", "Dead Heart", "White Ear Head", "Pupal Stage"].map((label, i) => (
            <div key={label} className="shrink-0">
              <div className="relative h-20 w-28 overflow-hidden rounded-lg">
                <Image src={IDENT_IMAGES[i % IDENT_IMAGES.length]} alt={label} fill className="object-cover" sizes="112px" />
              </div>
              <p className="mt-1 text-center text-[9px] font-semibold text-[var(--av-text-muted)]">{label}</p>
            </div>
          ))}
        </div>
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

      <div className="mt-4">
        <FarmerPhotoUpload storageKey={storageKey} currentUrl={userPhoto} onUpload={setUserPhoto} />
      </div>

      <AppLink href="/ai-doctor" className={`mt-4 inline-flex gap-2 ${AV.btnSecondarySm}`}>
        <Sparkles className="h-4 w-4" />
        AI Doctor से confirm करें
      </AppLink>
    </AppShell>
  );
}
