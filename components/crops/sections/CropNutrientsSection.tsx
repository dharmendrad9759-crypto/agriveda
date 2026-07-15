"use client";

import { useMemo } from "react";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import RiskBadge from "@/components/shell/RiskBadge";
import { getFertilizerForCrop, haToAcre } from "@/data/knowledge/fertilizer-recommendations";
import { enrichCropDetail } from "@/lib/cropDetailEnrichment";
import type { Crop } from "@/types/crop";
import { Leaf, AlertTriangle, Sprout, FlaskConical } from "lucide-react";

const SYMBOL_HREF: Record<string, string> = {
  Nitrogen: "nitrogen",
  Phosphorus: "phosphorus",
  Potassium: "potassium",
  Calcium: "calcium",
  Magnesium: "magnesium",
  Sulfur: "sulphur",
  Sulphur: "sulphur",
  Iron: "iron",
  Zinc: "zinc",
  Manganese: "manganese",
  Copper: "copper",
  Boron: "boron",
  Molybdenum: "molybdenum",
};

function riskForNutrient(name: string, solution: string): "high" | "medium" | "low" {
  if (/zinc|nitrogen|iron|khaira|blossom/i.test(name + solution)) return "high";
  if (/potassium|phosphorus|boron|sulph/i.test(name)) return "medium";
  return "low";
}

function criticalStageLabel(crop: Crop): string {
  const stages = crop.irrigationManagement.criticalStages;
  if (stages.length >= 2) return `${stages[0]} — ${stages[1]}`;
  if (stages[0]) return stages[0];
  const fert = crop.fertilizerSchedule.stageWise[0]?.stage;
  return fert ?? "Mid growth";
}

export default function CropNutrientsSection({ crop }: { crop: Crop }) {
  const detail = useMemo(() => enrichCropDetail(crop), [crop]);
  const fert = useMemo(() => getFertilizerForCrop(crop.slug), [crop.slug]);
  const nutrients = detail.nutrients;

  const micros = useMemo(() => {
    const fromCrop = crop.fertilizerSchedule.micronutrients ?? [];
    const fromFert = fert?.micronutrients ?? [];
    return [...fromCrop, ...fromFert].filter(Boolean);
  }, [crop, fert]);

  const highCount = nutrients.filter((n) => riskForNutrient(n.nutrient, n.solution) === "high").length;
  const npkLabel = fert
    ? `N:P:K ${Math.round(haToAcre(fert.n, 1))} : ${Math.round(haToAcre(fert.p2o5, 1))} : ${Math.round(haToAcre(fert.k2o, 1))} kg/acre`
    : crop.fertilizerSchedule.basalDose[0] ?? "Soil-test NPK recommended";

  const nutrientLinks = [
    { symbol: "N", href: "nitrogen" },
    { symbol: "P", href: "phosphorus" },
    { symbol: "K", href: "potassium" },
    ...nutrients
      .map((n) => {
        const href = SYMBOL_HREF[n.nutrient];
        if (!href || ["nitrogen", "phosphorus", "potassium"].includes(href)) return null;
        const symbol =
          n.nutrient === "Zinc"
            ? "Zn"
            : n.nutrient === "Iron"
              ? "Fe"
              : n.nutrient === "Magnesium"
                ? "Mg"
                : n.nutrient === "Calcium"
                  ? "Ca"
                  : n.nutrient === "Sulfur" || n.nutrient === "Sulphur"
                    ? "S"
                    : n.nutrient === "Manganese"
                      ? "Mn"
                      : n.nutrient === "Boron"
                        ? "B"
                        : n.nutrient.slice(0, 2);
        return { symbol, href };
      })
      .filter(Boolean) as { symbol: string; href: string }[],
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Leaf} label="Nutrients covered" value={`${nutrients.length} for ${crop.name}`} />
        <StatCard
          icon={AlertTriangle}
          iconColor="text-red-500"
          label="Watch closely"
          value={highCount ? `${highCount} high priority` : "Balanced watch"}
        />
        <StatCard icon={Sprout} label="Critical stage" value={criticalStageLabel(crop)} />
        <StatCard icon={FlaskConical} label="Guide NPK" value={npkLabel} />
      </div>

      <DarkCard delay={1}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
          Essential nutrients — {crop.name}
        </h3>
        <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
          Tap a nutrient for pehchaan tips. Corrections follow this crop&apos;s fertilizer guide.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {nutrientLinks.map((n) => (
            <AppLink
              key={n.href}
              href={`/deficiencies/${n.href}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-xs font-bold text-[var(--av-accent)] hover:border-[var(--av-accent)]/50"
            >
              {n.symbol}
            </AppLink>
          ))}
        </div>
      </DarkCard>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {nutrients.slice(0, 4).map((n, i) => {
          const risk = riskForNutrient(n.nutrient, n.solution);
          return (
            <DarkCard key={n.nutrient} hover delay={i}>
              <p className="text-xs font-bold text-[var(--av-text-primary)]">{n.nutrient}</p>
              <RiskBadge level={risk} />
              <p className="mt-2 text-[10px] text-[var(--av-text-muted)]">{n.symptoms}</p>
            </DarkCard>
          );
        })}
      </div>

      <DarkCard className="overflow-x-auto" delay={3}>
        <h3 className="mb-3 text-sm font-bold text-[var(--av-text-primary)]">
          Deficiency guide — {crop.name}
        </h3>
        <table className="av-table min-w-[560px]">
          <thead>
            <tr>
              <th>Nutrient</th>
              <th>Symptoms</th>
              <th>Likely cause</th>
              <th>Risk</th>
              <th>Correction</th>
            </tr>
          </thead>
          <tbody>
            {nutrients.map((row) => {
              const risk = riskForNutrient(row.nutrient, row.solution);
              return (
                <tr key={row.nutrient}>
                  <td className="font-bold text-[var(--av-accent)]">{row.nutrient}</td>
                  <td>{row.symptoms}</td>
                  <td>{row.cause}</td>
                  <td className="text-center">
                    <RiskBadge level={risk} />
                  </td>
                  <td>{row.solution}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </DarkCard>

      {micros.length > 0 && (
        <DarkCard>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Micronutrients for this crop</h3>
          <ul className="mt-3 space-y-2">
            {micros.map((m) => (
              <li key={m} className="crop-premium-inset text-xs text-[var(--av-text-secondary)]">
                {m}
              </li>
            ))}
          </ul>
        </DarkCard>
      )}

      <DarkCard hover delay={1}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Balanced nutrition target</h3>
        <p className="mt-2 text-lg font-bold text-[var(--av-accent)]">{npkLabel}</p>
        <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
          Always adjust after soil test. Open Fertiliser tab for stage-wise splits.
        </p>
        <AppLink href={`/crops/${crop.slug}?tab=fertilizer`} className="mt-3 inline-flex text-xs font-bold text-[var(--av-accent)]">
          Open fertilizer plan →
        </AppLink>
      </DarkCard>
    </div>
  );
}
