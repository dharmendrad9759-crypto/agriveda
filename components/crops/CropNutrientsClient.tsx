"use client";

import AppLink from "@/components/ui/AppLink";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import RiskBadge from "@/components/shell/RiskBadge";
import CropSubNav from "@/components/crops/CropSubNav";
import { GaugeChart } from "@/components/shell/charts";
import type { Crop } from "@/types/crop";
import { Leaf, AlertTriangle, Sprout, Calendar } from "lucide-react";

const NUTRIENTS = ["N", "P", "K", "Ca", "Mg", "S", "Zn", "Fe", "Mn", "Cu", "B", "Mo"];

const SYMPTOMS = [
  { name: "Nitrogen (N)", risk: "high" as const, desc: "Yellowing of older leaves, stunted growth" },
  { name: "Phosphorus (P)", risk: "medium" as const, desc: "Purple tint on leaves, poor root development" },
  { name: "Potassium (K)", risk: "medium" as const, desc: "Brown leaf margins, lodging" },
  { name: "Zinc (Zn)", risk: "high" as const, desc: "Khaira disease, dusty brown spots" },
];

const DEFICIENCY_TABLE = [
  { nutrient: "N", symptoms: "Yellow older leaves", stage: "Tillering", risk: "high" as const, correction: "Urea 40-60 kg/acre", source: "Soil" },
  { nutrient: "P", symptoms: "Purple leaves", stage: "Early growth", risk: "medium" as const, correction: "DAP 50 kg/acre", source: "Soil" },
  { nutrient: "K", symptoms: "Brown leaf tips", stage: "Panicle init.", risk: "medium" as const, correction: "MOP 20 kg/acre", source: "Soil" },
  { nutrient: "Zn", symptoms: "Brown dusty spots", stage: "Tillering", risk: "high" as const, correction: "ZnSO₄ 5 kg/acre", source: "Foliar" },
];

export default function CropNutrientsClient({ crop }: { crop: Crop }) {
  return (
    <AppShell
      title={`${crop.name} Nutrient Deficiency`}
      subtitle="Identify deficiency symptoms and apply the right nutrients"
      breadcrumbs={[
        { label: "Crops", href: "/crops" },
        { label: crop.name, href: `/crops/${crop.slug}` },
        { label: "Nutrient Deficiency" },
      ]}
    >
      <CropSubNav slug={crop.slug} cropName={crop.name} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Leaf} label="Total Deficiencies" value="12 In Crop" />
        <StatCard icon={AlertTriangle} iconColor="text-red-400" label="High Risk" value="4 Need Attention" />
        <StatCard icon={Sprout} label="Critical Stage" value="Tillering — Panicle Init." />
        <StatCard icon={Calendar} label="Last Updated" value="07 May, 2024" sub="09:30 AM" />
      </div>

      <DarkCard className="mt-4" delay={1}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Essential Nutrients</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {NUTRIENTS.map((n) => (
            <AppLink
              key={n}
              href={`/deficiencies/${n.toLowerCase() === "n" ? "nitrogen" : n.toLowerCase()}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-xs font-bold text-[var(--av-accent)] transition hover:border-[#10b981]/50"
            >
              {n}
            </AppLink>
          ))}
        </div>
      </DarkCard>

      <h3 className="mt-6 text-sm font-bold text-[var(--av-text-primary)]">Identify by Symptoms</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SYMPTOMS.map((s, i) => (
          <DarkCard key={s.name} hover delay={i}>
            <div className="flex h-20 items-center justify-center rounded-lg bg-[var(--av-surface-inset)] text-3xl">🍃</div>
            <p className="mt-2 text-xs font-bold text-[var(--av-text-primary)]">{s.name}</p>
            <RiskBadge level={s.risk} />
            <p className="mt-2 text-[10px] text-[var(--av-text-muted)]">{s.desc}</p>
          </DarkCard>
        ))}
      </div>

      <DarkCard className="mt-6" delay={2}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Nitrogen Deficiency — Detail</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <ul className="space-y-2 text-sm text-[var(--av-text-secondary)]">
              {["Older leaves turn light green to yellow", "Stunted plant growth", "Reduced tillering in paddy"].map((sym) => (
                <li key={sym} className="flex gap-2"><span className="text-[var(--av-accent)]">✓</span>{sym}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            {[
              { title: "Soil Application", dose: "Apply Urea @ 40-60 kg/acre" },
              { title: "Foliar Spray", dose: "2% Urea solution" },
              { title: "Best Stage", dose: "Tillering to Panicle Initiation" },
            ].map((m) => (
              <div key={m.title} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
                <p className="text-xs font-bold text-[var(--av-accent)]">{m.title}</p>
                <p className="text-[10px] text-[var(--av-text-secondary)]">{m.dose}</p>
              </div>
            ))}
          </div>
        </div>
      </DarkCard>

      <DarkCard className="mt-4 overflow-x-auto" delay={3}>
        <h3 className="mb-3 text-sm font-bold text-[var(--av-text-primary)]">All Nutrient Deficiencies</h3>
        <table className="w-full min-w-[560px] text-xs">
          <thead>
            <tr className="text-[var(--av-text-muted)]">
              <th className="pb-2 text-left">Nutrient</th>
              <th className="pb-2 text-left">Symptoms</th>
              <th className="pb-2">Stage</th>
              <th className="pb-2">Risk</th>
              <th className="pb-2 text-left">Correction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f2937]">
            {DEFICIENCY_TABLE.map((row) => (
              <tr key={row.nutrient}>
                <td className="py-2 font-bold text-[var(--av-accent)]">{row.nutrient}</td>
                <td className="py-2 text-[var(--av-text-secondary)]">{row.symptoms}</td>
                <td className="py-2 text-center text-[var(--av-text-secondary)]">{row.stage}</td>
                <td className="py-2 text-center"><RiskBadge level={row.risk} /></td>
                <td className="py-2 text-[var(--av-text-secondary)]">{row.correction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DarkCard>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <DarkCard hover delay={1}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Balanced Nutrition</h3>
          <p className="mt-2 text-lg font-bold text-[var(--av-accent)]">NPK 120 : 60 : 60</p>
          <AppLink href={`/crops/${crop.slug}/fertilizer-schedule`} className="mt-3 inline-block text-xs font-semibold text-[var(--av-accent)]">
            Fertilizer Plan →
          </AppLink>
        </DarkCard>
        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Deficiency Risk Forecast</h3>
          <GaugeChart value={72} label="High Risk — N & Fe" />
          <p className="mt-2 text-[10px] text-[var(--av-text-muted)]">Temp 32°C · Humidity 72% · pH 6.5</p>
        </DarkCard>
        <DarkCard hover delay={3}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Expert Tips</h3>
          <ul className="mt-2 space-y-1 text-xs text-[var(--av-text-secondary)]">
            <li>• Soil test before applying micronutrients</li>
            <li>• Split nitrogen doses for efficiency</li>
            <li>• Foliar spray during active growth</li>
          </ul>
        </DarkCard>
      </div>

      <ShellCtaBanner
        title="Need Help?"
        description="Ask our AI Doctor for personalized nutrient recommendations."
        buttonLabel="Ask AI Doctor"
        href="/ai-doctor"
      />
    </AppShell>
  );
}
