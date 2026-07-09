"use client";

import { useState } from "react";
import { Search, ShieldAlert, AlertTriangle, Eye, Calendar } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import RiskBadge from "@/components/shell/RiskBadge";
import { ShellTabBar } from "@/components/shell/AppShell";
import { GaugeChart } from "@/components/shell/charts";
import { PADDY_DISEASES, BLAST_DETAIL } from "@/data/mock/crop-diseases";
import type { Crop } from "@/types/crop";

export default function CropDiseasesSection({ crop: _crop }: { crop: Crop }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("blast");
  const [mgmtTab, setMgmtTab] = useState<"cultural" | "mechanical" | "biological" | "chemical">("cultural");

  const diseases = PADDY_DISEASES.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
  const detail = BLAST_DETAIL;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={ShieldAlert} label="Total Diseases" value="18 In Paddy" />
        <StatCard icon={AlertTriangle} iconColor="text-red-500" label="High Risk" value="3 Active Now" />
        <StatCard icon={Eye} iconColor="text-amber-500" label="Monitor" value="5 Keep Checking" />
        <StatCard icon={Calendar} label="Last Updated" value="07 May, 2024" sub="09:30 AM" />
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
          {diseases.map((d) => (
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
            <h2 className="text-lg font-bold text-[var(--av-text-primary)]">{detail.name}</h2>
            <p className="text-xs italic text-[var(--av-text-muted)]">{detail.scientific}</p>
            <RiskBadge level="high" />
            <p className="mt-3 text-sm text-[var(--av-text-secondary)]">{detail.desc}</p>
          </DarkCard>

          <DarkCard hover delay={1}>
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Symptoms</h3>
            <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide">
              {detail.symptoms.map((s) => (
                <div key={s.name} className="w-36 shrink-0 av-card-inset">
                  <p className="text-[10px] font-bold text-[var(--av-text-primary)]">{s.name}</p>
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
                  <li key={c.label}>
                    {c.label}: {c.value}
                  </li>
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
            {mgmtTab === "cultural" ? (
              <ul className="space-y-1">
                {detail.cultural.map((c) => (
                  <li key={c} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
                    <span className="text-[var(--av-accent)]">✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[var(--av-text-muted)]">See full {mgmtTab} control guide in crop protection.</p>
            )}
          </DarkCard>
        </div>
      </div>
    </div>
  );
}
