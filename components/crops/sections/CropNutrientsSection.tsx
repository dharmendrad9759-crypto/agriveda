"use client";

import DarkCard from "@/components/shell/DarkCard";
import RiskBadge from "@/components/shell/RiskBadge";
import AppLink from "@/components/ui/AppLink";
import { DossierSourceBanner } from "@/components/crops/DossierSourceBanner";
import { getCropManagementProfile } from "@/data/crop-management";
import { getFertilizerForCrop, haToAcre } from "@/data/knowledge/fertilizer-recommendations";
import { enrichCropDetail } from "@/lib/cropDetailEnrichment";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { Crop } from "@/types/crop";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/cn";

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

const SYM_TILE: Record<string, string> = {
  N: "bg-emerald-600 text-white",
  P: "bg-teal-600 text-white",
  K: "bg-lime-700 text-white",
  Zn: "bg-sky-600 text-white",
  Fe: "bg-orange-600 text-white",
  Mg: "bg-green-700 text-white",
  Ca: "bg-stone-600 text-white",
  S: "bg-amber-600 text-white",
  Mn: "bg-cyan-700 text-white",
  B: "bg-emerald-700 text-white",
  Cu: "bg-rose-700 text-white",
  Mo: "bg-indigo-600 text-white",
};

function riskForNutrient(name: string, solution: string): "high" | "medium" | "low" {
  if (/zinc|nitrogen|iron|khaira|blossom/i.test(name + solution)) return "high";
  if (/potassium|phosphorus|boron|sulph/i.test(name)) return "medium";
  return "low";
}

function symbolForNutrient(name: string): string {
  if (name === "Zinc") return "Zn";
  if (name === "Iron") return "Fe";
  if (name === "Magnesium") return "Mg";
  if (name === "Calcium") return "Ca";
  if (name === "Sulfur" || name === "Sulphur") return "S";
  if (name === "Manganese") return "Mn";
  if (name === "Boron") return "B";
  if (name === "Copper") return "Cu";
  if (name === "Molybdenum") return "Mo";
  if (name === "Nitrogen") return "N";
  if (name === "Phosphorus") return "P";
  if (name === "Potassium") return "K";
  return name.slice(0, 2);
}

export default function CropNutrientsSection({ crop }: { crop: Crop }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const detail = useMemo(() => enrichCropDetail(crop), [crop]);
  const fert = useMemo(() => getFertilizerForCrop(crop.slug), [crop.slug]);
  const profile = useMemo(
    () => getCropManagementProfile(crop.slug) as CropManagementWithDossier | null,
    [crop.slug]
  );
  const nutrients = detail.nutrients;

  const micros = useMemo(() => {
    const fromDossier = profile?.micronutrients ?? [];
    const fromCrop = crop.fertilizerSchedule.micronutrients ?? [];
    const fromFert = fert?.micronutrients ?? [];
    const seen = new Set<string>();
    return [...fromDossier, ...fromCrop, ...fromFert].filter((m) => {
      if (!m || seen.has(m)) return false;
      seen.add(m);
      return true;
    });
  }, [crop, fert, profile]);

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
        return { symbol: symbolForNutrient(n.nutrient), href };
      })
      .filter(Boolean) as { symbol: string; href: string }[],
  ];

  return (
    <div className="space-y-4">
      <DossierSourceBanner profile={profile} hi={hi} />
      {profile?.dossierPgrNotes?.length ? (
        <DarkCard>
          <h3 className="font-display text-[15px] font-bold text-[var(--av-text-primary)]">
            {hi ? "PGR / वृद्धि नियामक नोट" : "PGR notes"}
          </h3>
          <ul className="mt-2 space-y-1.5 text-xs text-[var(--av-text-secondary)]">
            {profile.dossierPgrNotes.map((n) => (
              <li key={n}>• {n}</li>
            ))}
          </ul>
        </DarkCard>
      ) : null}
      <DarkCard delay={1}>
        <h3 className="font-display text-[15px] font-bold text-[var(--av-text-primary)]">
          Essential nutrients — {crop.name}
        </h3>
        <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">
          Tap a symbol for pehchaan tips. Corrections follow this crop&apos;s fertilizer guide.
        </p>
        <div className="mt-3.5 flex flex-wrap gap-2.5">
          {nutrientLinks.map((n) => (
            <AppLink
              key={n.href}
              href={`/deficiencies/${n.href}`}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl text-[13px] font-black shadow-sm transition hover:scale-105",
                SYM_TILE[n.symbol] ?? "bg-emerald-700 text-white"
              )}
            >
              {n.symbol}
            </AppLink>
          ))}
        </div>
      </DarkCard>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {nutrients.slice(0, 4).map((n, i) => {
          const risk = riskForNutrient(n.nutrient, n.solution);
          const href = SYMBOL_HREF[n.nutrient];
          const symbol = symbolForNutrient(n.nutrient);
          const body = (
            <>
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black shadow-sm",
                    SYM_TILE[symbol] ?? "bg-emerald-700 text-white"
                  )}
                >
                  {symbol}
                </span>
                <RiskBadge level={risk} />
              </div>
              <p className="mt-3 font-display text-[14px] font-bold text-[var(--av-text-primary)]">
                {n.nutrient}
              </p>
              <p className="mt-1.5 line-clamp-3 text-[11px] leading-snug text-[var(--av-text-muted)]">
                {n.symptoms}
              </p>
              {href ? (
                <span className="mt-3 inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  Open guide
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              ) : null}
            </>
          );

          return href ? (
            <AppLink
              key={n.nutrient}
              href={`/deficiencies/${href}`}
              className="block rounded-[var(--av-radius)] border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-[var(--av-shadow-sm)] transition hover:-translate-y-0.5 hover:border-emerald-500/35 hover:shadow-[var(--av-shadow-md)]"
            >
              {body}
            </AppLink>
          ) : (
            <DarkCard key={n.nutrient} hover delay={i}>
              {body}
            </DarkCard>
          );
        })}
      </div>

      <DarkCard className="overflow-x-auto" delay={3}>
        <h3 className="mb-3 font-display text-[15px] font-bold text-[var(--av-text-primary)]">
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
              const href = SYMBOL_HREF[row.nutrient];
              return (
                <tr key={row.nutrient}>
                  <td className="font-bold text-[var(--av-accent)]">
                    {href ? (
                      <AppLink
                        href={`/deficiencies/${href}`}
                        className="inline-flex items-center gap-1 hover:underline"
                      >
                        {row.nutrient}
                        <ChevronRight className="h-3 w-3 opacity-60" />
                      </AppLink>
                    ) : (
                      row.nutrient
                    )}
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

      {micros.length > 0 && (
        <DarkCard>
          <h3 className="font-display text-[15px] font-bold text-[var(--av-text-primary)]">
            Micronutrients for this crop
          </h3>
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
        <h3 className="font-display text-[15px] font-bold text-[var(--av-text-primary)]">
          Balanced nutrition target
        </h3>
        <p className="mt-2 font-display text-lg font-bold text-[var(--av-accent)]">{npkLabel}</p>
        <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
          Always adjust after soil test. Open Fertiliser tab for stage-wise splits.
        </p>
        <AppLink
          href={`/crops/${crop.slug}?tab=fertilizer`}
          className="mt-3 inline-flex items-center gap-0.5 text-xs font-bold text-[var(--av-accent)]"
        >
          Open fertilizer plan
          <ChevronRight className="h-3.5 w-3.5" />
        </AppLink>
      </DarkCard>
    </div>
  );
}
