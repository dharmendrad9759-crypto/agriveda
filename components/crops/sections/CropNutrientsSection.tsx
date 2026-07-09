"use client";

import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import RiskBadge from "@/components/shell/RiskBadge";
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
  { nutrient: "N", symptoms: "Yellow older leaves", stage: "Tillering", risk: "high" as const, correction: "Urea 40-60 kg/acre" },
  { nutrient: "P", symptoms: "Purple leaves", stage: "Early growth", risk: "medium" as const, correction: "DAP 50 kg/acre" },
  { nutrient: "K", symptoms: "Brown leaf tips", stage: "Panicle init.", risk: "medium" as const, correction: "MOP 20 kg/acre" },
  { nutrient: "Zn", symptoms: "Brown dusty spots", stage: "Tillering", risk: "high" as const, correction: "ZnSO₄ 5 kg/acre" },
];

export default function CropNutrientsSection({ crop }: { crop: Crop }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Leaf} label="Total Deficiencies" value="12 In Crop" />
        <StatCard icon={AlertTriangle} iconColor="text-red-500" label="High Risk" value="4 Need Attention" />
        <StatCard icon={Sprout} label="Critical Stage" value="Tillering — Panicle" />
        <StatCard icon={Calendar} label="Last Updated" value="07 May, 2024" sub="09:30 AM" />
      </div>

      <DarkCard delay={1}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Essential Nutrients</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {NUTRIENTS.map((n) => (
            <AppLink
              key={n}
              href={`/deficiencies/${n.toLowerCase() === "n" ? "nitrogen" : n.toLowerCase()}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-xs font-bold text-[var(--av-accent)] hover:border-[var(--av-accent)]/50"
            >
              {n}
            </AppLink>
          ))}
        </div>
      </DarkCard>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SYMPTOMS.map((s, i) => (
          <DarkCard key={s.name} hover delay={i}>
            <p className="text-xs font-bold text-[var(--av-text-primary)]">{s.name}</p>
            <RiskBadge level={s.risk} />
            <p className="mt-2 text-[10px] text-[var(--av-text-muted)]">{s.desc}</p>
          </DarkCard>
        ))}
      </div>

      <DarkCard className="overflow-x-auto" delay={3}>
        <h3 className="mb-3 text-sm font-bold text-[var(--av-text-primary)]">All Nutrient Deficiencies</h3>
        <table className="av-table min-w-[560px]">
          <thead>
            <tr>
              <th>Nutrient</th>
              <th>Symptoms</th>
              <th>Stage</th>
              <th>Risk</th>
              <th>Correction</th>
            </tr>
          </thead>
          <tbody>
            {DEFICIENCY_TABLE.map((row) => (
              <tr key={row.nutrient}>
                <td className="font-bold text-[var(--av-accent)]">{row.nutrient}</td>
                <td>{row.symptoms}</td>
                <td className="text-center">{row.stage}</td>
                <td className="text-center">
                  <RiskBadge level={row.risk} />
                </td>
                <td>{row.correction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DarkCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Balanced Nutrition</h3>
          <p className="mt-2 text-lg font-bold text-[var(--av-accent)]">NPK 120 : 60 : 60</p>
        </DarkCard>
        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Deficiency Risk Forecast</h3>
          <GaugeChart value={72} label="High Risk — N & Fe" />
        </DarkCard>
      </div>
    </div>
  );
}
