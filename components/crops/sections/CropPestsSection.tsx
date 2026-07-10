"use client";

import { useMemo, useState } from "react";
import { Search, Shield, Bug, Eye, ShieldCheck, Calendar } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import RiskBadge from "@/components/shell/RiskBadge";
import EtlGuideCard from "@/components/shell/EtlGuideCard";
import { ShellTabBar } from "@/components/shell/AppShell";
import { getIpmPestListForCrop } from "@/lib/crops/ipmDataBridge";
import { getEnrichedCropThreats } from "@/lib/pest-disease-catalog";
import type { Crop } from "@/types/crop";
import { AV } from "@/lib/design/tokens";

type IpmTab = "prevention" | "monitoring" | "cultural" | "biological" | "chemical";

const IPM_TAB_LABELS: Record<IpmTab, string> = {
  prevention: "Prevention",
  monitoring: "Monitoring",
  cultural: "Cultural",
  biological: "Biological",
  chemical: "Chemical",
};

export default function CropPestsSection({ crop }: { crop: Crop }) {
  const [search, setSearch] = useState("");
  const [ipmTab, setIpmTab] = useState<IpmTab>("prevention");
  const [selectedPestId, setSelectedPestId] = useState<string | null>(null);

  const ipmPests = useMemo(() => getIpmPestListForCrop(crop.slug), [crop.slug]);
  const catalogPests = useMemo(() => getEnrichedCropThreats(crop.slug).filter((t) => t.type === "pest"), [crop.slug]);

  const pests = ipmPests.length
    ? ipmPests
    : catalogPests.map((p) => ({
        id: p.id,
        name: p.name,
        scientific: p.scientificName,
        desc: p.description,
        damage: p.symptoms[0]?.slice(0, 60) ?? "—",
        spread: p.iracGroup ?? "—",
        loss: "Yield loss if untreated",
        etl: p.etl,
        attackStage: p.stage,
        monitoring: "Weekly scout",
        risk: "high" as const,
        ipm: {
          prevention: p.remediation.filter((r) => r.startsWith("Prevention")),
          monitoring: p.remediation.filter((r) => r.startsWith("Monitoring")),
          cultural: p.remediation.filter((r) => r.startsWith("Cultural")),
          biological: p.remediation.filter((r) => r.startsWith("Biological")),
          chemical: [],
        },
      }));

  const filtered = pests.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.scientific.toLowerCase().includes(search.toLowerCase())
  );

  const activePest = filtered.find((p) => p.id === selectedPestId) ?? filtered[0];
  const ipmTips = useMemo(() => {
    if (!activePest?.ipm) return [] as string[];
    const raw = activePest.ipm[ipmTab];
    if (!raw?.length) return [];
    if (ipmTab === "chemical") {
      return (raw as { technical: string; dose: string; note?: string }[]).map(
        (c) => `${c.technical} @ ${c.dose}${c.note ? ` — ${c.note}` : ""}`
      );
    }
    return (raw as string[]);
  }, [activePest, ipmTab]);

  return (
    <div className="space-y-4">
      <EtlGuideCard
        etl={activePest?.etl}
        monitoring={activePest?.ipm?.monitoring?.[0]}
        pestName={activePest?.name}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Bug} iconColor="text-red-500" label="Pests listed" value={`${pests.length} major`} />
        <StatCard icon={Eye} iconColor="text-amber-500" label="Data source" value={ipmPests.length ? "ICAR IPM JSON" : "Catalog"} />
        <StatCard icon={ShieldCheck} label="ETL based" value="Spray at threshold" sub="Not calendar spray" />
        <StatCard icon={Calendar} label="IRAC rotate" value="Group rotation" sub="Resistance safe" />
      </div>

      <DarkCard>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pest..."
            className="av-input py-2.5 pl-10"
          />
        </div>
      </DarkCard>

      <div className="space-y-3">
        {filtered.map((pest, i) => (
          <DarkCard
            key={pest.id}
            hover
            delay={i}
            className={selectedPestId === pest.id ? "ring-1 ring-[var(--av-accent)]" : ""}
          >
            <button type="button" className="w-full text-left" onClick={() => setSelectedPestId(pest.id)}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--av-accent-soft)]">
                  <Bug className="h-7 w-7 text-[var(--av-accent)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{pest.name}</h3>
                    <RiskBadge level={pest.risk} />
                  </div>
                  <p className="text-[10px] italic text-[var(--av-text-muted)]">{pest.scientific}</p>
                  <p className="mt-2 text-xs text-[var(--av-text-secondary)]">{pest.desc}</p>
                  {pest.etl && (
                    <p className="mt-2 text-[10px] font-semibold text-amber-500">ETL: {pest.etl}</p>
                  )}
                </div>
                <div className="shrink-0">
                  <AppLink
                    href={`/pest-diseases/${crop.slug}/pest/${pest.id}`}
                    className={`${AV.btnPrimarySm} inline-flex`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Full IPM Detail →
                  </AppLink>
                </div>
              </div>
            </button>
          </DarkCard>
        ))}
      </div>

      {activePest && (
        <DarkCard delay={2}>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--av-accent)]" />
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
              IPM Ladder — {activePest.name}
            </h3>
          </div>
          <ShellTabBar
            tabs={(Object.keys(IPM_TAB_LABELS) as IpmTab[]).map((k) => ({
              id: k,
              label: IPM_TAB_LABELS[k],
            }))}
            active={ipmTab}
            onChange={setIpmTab}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            {ipmTips.length ? (
              ipmTips.map((tip) => (
                <p key={tip} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
                  <span className="text-[var(--av-accent)]">•</span> {tip}
                </p>
              ))
            ) : (
              <p className="text-xs text-[var(--av-text-muted)]">No {IPM_TAB_LABELS[ipmTab]} steps for this pest.</p>
            )}
          </div>
        </DarkCard>
      )}
    </div>
  );
}
