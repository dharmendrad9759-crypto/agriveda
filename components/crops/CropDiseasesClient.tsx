"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell, { ShellCtaBanner, ShellTabBar } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import RiskBadge from "@/components/shell/RiskBadge";
import CropSubNav from "@/components/crops/CropSubNav";
import { GaugeChart } from "@/components/shell/charts";
import { PADDY_DISEASES, BLAST_DETAIL } from "@/data/mock/crop-diseases";
import type { Crop } from "@/types/crop";
import { ShieldAlert, AlertTriangle, Eye, Calendar } from "lucide-react";

export default function CropDiseasesClient({ crop }: { crop: Crop }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("blast");
  const [mgmtTab, setMgmtTab] = useState<"cultural" | "mechanical" | "biological" | "chemical">("cultural");

  const diseases = PADDY_DISEASES.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );
  const detail = selected === "blast" ? BLAST_DETAIL : BLAST_DETAIL;

  return (
    <AppShell
      title={`${crop.name} Diseases`}
      subtitle="Identify, prevent and manage crop diseases"
      breadcrumbs={[
        { label: "Crops", href: "/crops" },
        { label: crop.name, href: `/crops/${crop.slug}` },
        { label: "Diseases" },
      ]}
    >
      <CropSubNav slug={crop.slug} cropName={crop.name} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={ShieldAlert} label="Total Diseases" value="18 In Paddy" />
        <StatCard icon={AlertTriangle} iconColor="text-red-400" label="High Risk" value="3 Active Now" />
        <StatCard icon={Eye} iconColor="text-amber-400" label="Monitor" value="5 Keep Checking" />
        <StatCard icon={Calendar} label="Last Updated" value="07 May, 2024" sub="09:30 AM" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-1">
          <DarkCard>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search disease..."
                className="w-full rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] py-2 pl-9 pr-3 text-sm text-[var(--av-text-primary)] outline-none"
              />
            </div>
          </DarkCard>
          {diseases.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelected(d.id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                selected === d.id ? "border-[#10b981] bg-[var(--av-accent)]/10" : "border-[var(--av-border)] bg-[var(--av-surface)] hover:border-[#10b981]/30"
              }`}
            >
              <span className="text-2xl">🦠</span>
              <div>
                <p className="text-xs font-bold text-[var(--av-text-primary)]">{d.name}</p>
                <RiskBadge level={d.risk} />
                <p className="mt-1 text-[10px] italic text-[var(--av-text-muted)]">{d.scientific}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-4 lg:col-span-2">
          <DarkCard hover>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-[var(--av-text-primary)]">{detail.name}</h2>
                <p className="text-xs italic text-[var(--av-text-muted)]">{detail.scientific}</p>
                <RiskBadge level="high" />
              </div>
            </div>
            <p className="mt-3 text-sm text-[var(--av-text-secondary)]">{detail.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {detail.affects.map((a) => (
                <span key={a} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-2 py-1 text-[10px] text-[var(--av-text-secondary)]">Affects: {a}</span>
              ))}
            </div>
          </DarkCard>

          <DarkCard hover delay={1}>
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Symptoms</h3>
            <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide">
              {detail.symptoms.map((s) => (
                <div key={s.name} className="w-36 shrink-0 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2">
                  <div className="flex h-16 items-center justify-center text-2xl">🍃</div>
                  <p className="mt-1 text-[10px] font-bold text-[var(--av-text-primary)]">{s.name}</p>
                  <p className="text-[9px] text-[var(--av-text-muted)]">{s.desc}</p>
                </div>
              ))}
            </div>
          </DarkCard>

          <div className="grid gap-4 sm:grid-cols-2">
            <DarkCard hover delay={2}>
              <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Favorable Conditions</h3>
              <ul className="mt-2 space-y-1 text-xs text-[var(--av-text-secondary)]">
                {detail.conditions.map((c) => (
                  <li key={c.label}>{c.label}: {c.value}</li>
                ))}
              </ul>
            </DarkCard>
            <DarkCard hover delay={3}>
              <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Disease Forecast</h3>
              <GaugeChart value={80} label="High Risk (5 days)" />
            </DarkCard>
          </div>

          <DarkCard delay={4}>
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Management Strategies</h3>
            <ShellTabBar
              tabs={[
                { id: "cultural" as const, label: "Cultural" },
                { id: "mechanical" as const, label: "Mechanical" },
                { id: "biological" as const, label: "Biological" },
                { id: "chemical" as const, label: "Chemical" },
              ]}
              active={mgmtTab}
              onChange={setMgmtTab}
            />
            {mgmtTab === "cultural" && (
              <ul className="space-y-1">
                {detail.cultural.map((c) => (
                  <li key={c} className="flex gap-2 text-xs text-[var(--av-text-secondary)]"><span className="text-[var(--av-accent)]">✓</span>{c}</li>
                ))}
              </ul>
            )}
            {mgmtTab !== "cultural" && (
              <p className="text-xs text-[var(--av-text-muted)]">See full {mgmtTab} control guide in crop protection section.</p>
            )}
          </DarkCard>

          <DarkCard delay={5}>
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Recommended Products</h3>
            <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide">
              {detail.products.map((p) => (
                <div key={p.name} className="w-40 shrink-0 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
                  <div className="flex h-12 items-center justify-center text-2xl">🧴</div>
                  <p className="mt-2 text-[10px] font-bold text-[var(--av-text-primary)]">{p.name}</p>
                  <p className="text-[9px] text-[var(--av-text-muted)]">{p.dose}</p>
                  <p className="text-[9px] text-[var(--av-accent)]">{p.group}</p>
                </div>
              ))}
            </div>
          </DarkCard>

          <DarkCard delay={6}>
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Expert Tips</h3>
            <p className="mt-2 text-sm italic text-[var(--av-text-secondary)]">&ldquo;{detail.expert.tip}&rdquo;</p>
            <p className="mt-2 text-xs font-semibold text-[var(--av-accent)]">{detail.expert.name}</p>
            <p className="text-[10px] text-[var(--av-text-muted)]">{detail.expert.role}</p>
          </DarkCard>
        </div>
      </div>

      <ShellCtaBanner
        title="Need Help?"
        description="Ask our AI Doctor for disease diagnosis and treatment plans."
        buttonLabel="Ask AI Doctor"
        href="/ai-doctor"
      />
    </AppShell>
  );
}
