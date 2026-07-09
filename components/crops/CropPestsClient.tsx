"use client";

import { useState } from "react";
import { Search, Shield } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell, { ShellCtaBanner, ShellTabBar } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import RiskBadge from "@/components/shell/RiskBadge";
import CropSubNav from "@/components/crops/CropSubNav";
import { PADDY_PESTS, IPM_TABS } from "@/data/mock/crop-pests";
import type { Crop } from "@/types/crop";
import { Bug, Eye, ShieldCheck, Calendar } from "lucide-react";

type IpmTab = keyof typeof IPM_TABS;

export default function CropPestsClient({ crop }: { crop: Crop }) {
  const [search, setSearch] = useState("");
  const [ipmTab, setIpmTab] = useState<IpmTab>("prevention");

  const pests = PADDY_PESTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.scientific.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell
      title={`${crop.name} Pests`}
      subtitle="Identify, manage and protect your crop"
      breadcrumbs={[
        { label: "Crops", href: "/crops" },
        { label: crop.name, href: `/crops/${crop.slug}` },
        { label: "Pests" },
      ]}
    >
      <CropSubNav slug={crop.slug} cropName={crop.name} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Bug} iconColor="text-red-400" label="Top Risk Pest" value="Stem Borer — High Risk" />
        <StatCard icon={Eye} iconColor="text-amber-400" label="Monitoring" value="4 Active Pests" sub="Monitor Regularly" />
        <StatCard icon={ShieldCheck} label="Safe Threshold" value="Follow ETL" sub="For Better Control" />
        <StatCard icon={Calendar} label="Last Updated" value="07 May, 2024" sub="09:30 AM" />
      </div>

      <DarkCard className="mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pest..."
            className="w-full rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] py-2.5 pl-10 pr-3 text-sm text-[var(--av-text-primary)] outline-none focus:border-[#10b981]"
          />
        </div>
      </DarkCard>

      <div className="mt-4 space-y-3">
        {pests.map((pest, i) => (
          <DarkCard key={pest.id} hover delay={i}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-[var(--av-surface-inset)] text-3xl">🐛</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{pest.name}</h3>
                  <RiskBadge level={pest.risk} />
                </div>
                <p className="text-[10px] italic text-[var(--av-text-muted)]">{pest.scientific}</p>
                <p className="mt-2 text-xs text-[var(--av-text-secondary)]">{pest.desc}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-[var(--av-text-muted)]">
                  <span>Damage: {pest.damage}</span>
                  <span>Spread: {pest.spread}</span>
                  <span>Loss: {pest.loss}</span>
                </div>
              </div>
              <div className="shrink-0 space-y-2 text-[10px] text-[var(--av-text-secondary)] lg:text-right">
                <p>Attack: {pest.attackStage}</p>
                <p>Monitor: {pest.monitoring}</p>
                <AppLink href={`/pest-diseases/${crop.slug}/pest/${pest.id}`} className="inline-flex min-h-[40px] items-center rounded-lg bg-[var(--av-accent)] px-4 py-2 text-xs font-bold text-white">
                  Control & Solution
                </AppLink>
              </div>
            </div>
          </DarkCard>
        ))}
      </div>

      <DarkCard className="mt-6" delay={2}>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[var(--av-accent)]" />
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Integrated Pest Management (IPM)</h3>
        </div>
        <ShellTabBar
          tabs={(Object.keys(IPM_TABS) as IpmTab[]).map((k) => ({
            id: k,
            label: k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, " $1"),
          }))}
          active={ipmTab}
          onChange={setIpmTab}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          {IPM_TABS[ipmTab].map((tip) => (
            <p key={tip} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
              <span className="text-[var(--av-accent)]">•</span> {tip}
            </p>
          ))}
        </div>
      </DarkCard>

      <ShellCtaBanner
        title="Need Help?"
        description="Ask our AI Doctor for personalized pest management recommendations."
        buttonLabel="Ask AI Doctor"
        href="/ai-doctor"
      />
    </AppShell>
  );
}
