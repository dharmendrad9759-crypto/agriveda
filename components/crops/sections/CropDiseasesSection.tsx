"use client";

import { useMemo, useState } from "react";
import { Search, ShieldAlert, AlertTriangle, Eye, Calendar } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import RiskBadge from "@/components/shell/RiskBadge";
import { ShellTabBar } from "@/components/shell/AppShell";
import { getIpmDiseaseListForCrop } from "@/lib/crops/ipmDataBridge";
import { getCropFieldGuideDiseaseListForCrop } from "@/lib/crops/cropFieldGuideBridge";
import { getEnrichedCropThreats } from "@/lib/pest-disease-catalog";
import type { Crop } from "@/types/crop";
import { AV } from "@/lib/design/tokens";

type MgmtTab = "prevention" | "monitoring" | "cultural" | "biological" | "chemical";

const MGMT_LABELS: Record<MgmtTab, string> = {
  prevention: "Prevention",
  monitoring: "Monitoring",
  cultural: "Cultural",
  biological: "Biological",
  chemical: "Chemical",
};

export default function CropDiseasesSection({ crop }: { crop: Crop }) {
  const [search, setSearch] = useState("");
  const [mgmtTab, setMgmtTab] = useState<MgmtTab>("prevention");

  const ipmDiseases = useMemo(() => getIpmDiseaseListForCrop(crop.slug), [crop.slug]);
  const fieldGuideDiseases = useMemo(() => getCropFieldGuideDiseaseListForCrop(crop.slug), [crop.slug]);
  const catalogDiseases = useMemo(
    () => getEnrichedCropThreats(crop.slug).filter((t) => t.type === "disease"),
    [crop.slug]
  );

  const diseases = fieldGuideDiseases.length
    ? fieldGuideDiseases
    : ipmDiseases.length
      ? ipmDiseases
      : catalogDiseases.map((d) => ({
        id: d.id,
        name: d.name,
        scientific: d.pathogen ?? d.scientificName,
        risk: d.category === "viral" ? ("high" as const) : ("medium" as const),
        type: d.category,
        desc: d.description,
        conditions: d.symptoms[0],
        ipm: {
          prevention: d.remediation.filter((r) => r.startsWith("Prevention")),
          monitoring: [],
          cultural: d.remediation.filter((r) => r.startsWith("Cultural")),
          biological: [],
          chemical: [],
        },
        fracNote: d.fracGroup,
      }));

  const filtered = diseases.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
  const [selected, setSelected] = useState(filtered[0]?.id ?? "");
  const detail = filtered.find((d) => d.id === selected) ?? filtered[0];

  const mgmtTips = useMemo(() => {
    if (!detail?.ipm) return [] as string[];
    const raw = detail.ipm[mgmtTab];
    if (!raw?.length) return [];
    if (mgmtTab === "chemical") {
      return (raw as { technical: string; dose: string; note?: string }[]).map(
        (c) => `${c.technical} @ ${c.dose}${c.note ? ` — ${c.note}` : ""}`
      );
    }
    return (raw as string[]).map((t) =>
      t.replace(/^(Prevention|Monitoring|Cultural|Biological|Chemical):\s*/i, "")
    );
  }, [detail, mgmtTab]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={ShieldAlert} label="Diseases" value={`${diseases.length} listed`} />
        <StatCard icon={AlertTriangle} iconColor="text-red-500" label="Viral alert" value="Vector control only" />
        <StatCard icon={Eye} iconColor="text-amber-500" label="Source" value={ipmDiseases.length ? "IDM JSON" : "Catalog"} />
        <StatCard icon={Calendar} label="FRAC rotate" value="Group rotation" sub="No repeat systemic" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-1">
          <DarkCard>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search disease..."
                className="av-input py-2 pl-9"
              />
            </div>
          </DarkCard>
          {filtered.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelected(d.id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                selected === d.id
                  ? "border-[var(--av-accent)] bg-[var(--av-accent-soft)]"
                  : "border-[var(--av-border)] bg-[var(--av-surface)] hover:border-[var(--av-accent)]/30"
              }`}
            >
              <ShieldAlert className="h-6 w-6 shrink-0 text-[var(--av-accent)]" />
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-[var(--av-text-primary)]">{d.name}</p>
                <RiskBadge level={d.risk} />
                <p className="mt-1 truncate text-[10px] italic text-[var(--av-text-muted)]">{d.scientific}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-4 lg:col-span-2">
          {detail ? (
            <>
              <DarkCard hover>
                <h2 className="text-lg font-bold text-[var(--av-text-primary)]">{detail.name}</h2>
                <p className="text-xs italic text-[var(--av-text-muted)]">{detail.scientific}</p>
                <RiskBadge level={detail.risk} />
                <p className="mt-3 text-sm text-[var(--av-text-secondary)]">{detail.desc}</p>
                {detail.conditions && (
                  <p className="mt-2 text-xs text-amber-400">Favourable: {detail.conditions}</p>
                )}
                {detail.fracNote && (
                  <p className="mt-1 text-[10px] text-violet-400">FRAC: {detail.fracNote}</p>
                )}
                <AppLink
                  href={`/pest-diseases/${crop.slug}/disease/${detail.id}`}
                  className={`mt-3 inline-flex ${AV.btnPrimarySm}`}
                >
                  Full disease detail →
                </AppLink>
              </DarkCard>

              <DarkCard delay={4}>
                <h3 className="text-sm font-bold text-[var(--av-text-primary)]">IDM Management Ladder</h3>
                <ShellTabBar
                  tabs={(Object.keys(MGMT_LABELS) as MgmtTab[]).map((id) => ({
                    id,
                    label: MGMT_LABELS[id],
                  }))}
                  active={mgmtTab}
                  onChange={setMgmtTab}
                />
                <ul className="space-y-1">
                  {mgmtTips.length ? (
                    mgmtTips.map((c) => (
                      <li key={c} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
                        <span className="text-[var(--av-accent)]">✓</span>
                        {c}
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-[var(--av-text-muted)]">
                      See full detail page for {MGMT_LABELS[mgmtTab]} steps.
                    </li>
                  )}
                </ul>
              </DarkCard>
            </>
          ) : (
            <DarkCard className="text-center">
              <p className="text-sm text-[var(--av-text-muted)]">No disease data for this crop yet.</p>
            </DarkCard>
          )}
        </div>
      </div>
    </div>
  );
}
