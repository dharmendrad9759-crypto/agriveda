"use client";

import { useMemo } from "react";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import RiskBadge from "@/components/shell/RiskBadge";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getFertilizerForCrop, haToAcre } from "@/data/knowledge/fertilizer-recommendations";
import { enrichCropDetail } from "@/lib/cropDetailEnrichment";
import { parseSprayAdvice } from "@/lib/crops/parseSprayAdvice";
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

const NUTRIENT_HI: Record<string, string> = {
  Nitrogen: "नाइट्रोजन (N)",
  Phosphorus: "फॉस्फोरस (P)",
  Potassium: "पोटाश (K)",
  Calcium: "कैल्शियम (Ca)",
  Magnesium: "मैग्नीशियम (Mg)",
  Sulfur: "सल्फर (S)",
  Sulphur: "सल्फर (S)",
  Iron: "आयरन (Fe)",
  Zinc: "जिंक (Zn)",
  Manganese: "मैंगनीज (Mn)",
  Copper: "कॉपर (Cu)",
  Boron: "बोरॉन (B)",
  Molybdenum: "मॉलिब्डेनम (Mo)",
};

function riskForNutrient(name: string, solution: string): "high" | "medium" | "low" {
  if (/zinc|nitrogen|iron|khaira|blossom/i.test(name + solution)) return "high";
  if (/potassium|phosphorus|boron|sulph/i.test(name)) return "medium";
  return "low";
}

function criticalStageLabel(crop: Crop, isHi: boolean): string {
  const stages = crop.irrigationManagement.criticalStages;
  if (stages.length >= 2) return `${stages[0]} — ${stages[1]}`;
  if (stages[0]) return stages[0];
  const fert = crop.fertilizerSchedule.stageWise[0]?.stage;
  return fert ?? (isHi ? "मध्य वृद्धि" : "Mid growth");
}

export default function CropNutrientsSection({ crop }: { crop: Crop }) {
  const { locale } = useLocale();
  const isHi = locale === "hi";
  const detail = useMemo(() => enrichCropDetail(crop), [crop]);
  const fert = useMemo(() => getFertilizerForCrop(crop.slug), [crop.slug]);
  const nutrients = detail.nutrients;

  const micros = useMemo(() => {
    const fromCrop = crop.fertilizerSchedule.micronutrients ?? [];
    const fromFert = fert?.micronutrients ?? [];
    const sprays = crop.fertilizerSchedule.foliarSpray ?? [];
    return [...fromCrop, ...fromFert, ...sprays].filter(Boolean);
  }, [crop, fert]);

  const sprayCards = useMemo(
    () => micros.map((m) => parseSprayAdvice(m, isHi, crop.slug)),
    [micros, isHi, crop.slug]
  );

  const highCount = nutrients.filter((n) => riskForNutrient(n.nutrient, n.solution) === "high").length;
  const npkLabel = fert
    ? `N:P:K ${Math.round(haToAcre(fert.n, 1))} : ${Math.round(haToAcre(fert.p2o5, 1))} : ${Math.round(haToAcre(fert.k2o, 1))} kg/acre`
    : crop.fertilizerSchedule.basalDose[0] ?? (isHi ? "मिट्टी जाँच के बाद NPK" : "Soil-test NPK");

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
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          icon={FlaskConical}
          label={isHi ? "खेत का लक्ष्य" : "Field NPK"}
          value={npkLabel}
        />
        <StatCard
          icon={Sprout}
          label={isHi ? "महत्वपूर्ण स्टेज" : "Critical stage"}
          value={criticalStageLabel(crop, isHi)}
        />
        <StatCard
          icon={AlertTriangle}
          iconColor="text-red-500"
          label={isHi ? "ध्यान दें" : "Watch closely"}
          value={highCount ? `${highCount}` : isHi ? "सामान्य" : "Balanced"}
          sub={isHi ? "उच्च प्राथमिकता पोषक" : "high-priority nutrients"}
        />
      </div>

      <DarkCard delay={1}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
          {isHi ? "जरूरी पोषक" : "Essential nutrients"} — {crop.name}
        </h3>
        <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
          {isHi
            ? "पोषक पर टैप करें — पहचान और सुधार।"
            : "Tap a nutrient for recognition tips."}
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
              <p className="text-xs font-bold text-[var(--av-text-primary)]">
                {isHi ? NUTRIENT_HI[n.nutrient] ?? n.nutrient : n.nutrient}
              </p>
              <RiskBadge level={risk} />
              <p className="mt-2 text-[10px] text-[var(--av-text-muted)] line-clamp-3">{n.symptoms}</p>
            </DarkCard>
          );
        })}
      </div>

      {sprayCards.length > 0 && (
        <DarkCard>
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-cyan-600" />
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
              {isHi ? "स्प्रे / सूक्ष्म पोषक" : "Spray / micronutrients"}
            </h3>
          </div>
          <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
            {isHi ? "समय (DAS/DAT) · मात्रा · पानी L/एकड़" : "When (DAS/DAT) · dose · water L/acre"}
          </p>
          <ul className="mt-3 space-y-2">
            {sprayCards.map((s, i) => (
              <li key={i} className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5">
                <p className="text-xs font-bold text-[var(--av-text-primary)]">{s.name}</p>
                <div className="mt-1.5 grid gap-1 text-[11px] text-[var(--av-text-secondary)] sm:grid-cols-3">
                  <p>
                    <span className="font-semibold text-cyan-700 dark:text-cyan-300">
                      {isHi ? "समय:" : "When:"}
                    </span>{" "}
                    {s.timing}
                  </p>
                  <p>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                      {isHi ? "मात्रा:" : "Dose:"}
                    </span>{" "}
                    {s.dose}
                  </p>
                  <p>
                    <span className="font-semibold text-sky-700 dark:text-sky-300">
                      {isHi ? "पानी:" : "Water:"}
                    </span>{" "}
                    {s.water}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </DarkCard>
      )}

      <DarkCard className="overflow-x-auto" delay={3}>
        <h3 className="mb-3 text-sm font-bold text-[var(--av-text-primary)]">
          {isHi ? "कमी पहचान गाइड" : "Deficiency guide"} — {crop.name}
        </h3>
        <table className="av-table min-w-[560px]">
          <thead>
            <tr>
              <th>{isHi ? "पोषक" : "Nutrient"}</th>
              <th>{isHi ? "लक्षण" : "Symptoms"}</th>
              <th>{isHi ? "कारण" : "Cause"}</th>
              <th>{isHi ? "जोखिम" : "Risk"}</th>
              <th>{isHi ? "सुधार" : "Fix"}</th>
            </tr>
          </thead>
          <tbody>
            {nutrients.map((row) => {
              const risk = riskForNutrient(row.nutrient, row.solution);
              return (
                <tr key={row.nutrient}>
                  <td className="font-bold text-[var(--av-accent)]">
                    {isHi ? NUTRIENT_HI[row.nutrient] ?? row.nutrient : row.nutrient}
                  </td>
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

      <DarkCard hover delay={1}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
          {isHi ? "संतुलित पोषण लक्ष्य" : "Balanced nutrition target"}
        </h3>
        <p className="mt-2 text-lg font-bold text-[var(--av-accent)]">{npkLabel}</p>
        <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
          {isHi
            ? "मिट्टी जाँच के बाद मात्रा एडजस्ट करें। स्टेज-वाइज प्लान उर्वरक टैब में।"
            : "Adjust after soil test. Stage-wise plan in Fertilizer tab."}
        </p>
        <AppLink href={`/crops/${crop.slug}?tab=fertilizer`} className="mt-3 inline-flex text-xs font-bold text-[var(--av-accent)]">
          {isHi ? "उर्वरक प्लान खोलें →" : "Open fertilizer plan →"}
        </AppLink>
      </DarkCard>
    </div>
  );
}
