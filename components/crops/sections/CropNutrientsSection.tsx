"use client";

import DarkCard from "@/components/shell/DarkCard";
import RiskBadge from "@/components/shell/RiskBadge";
import AppLink from "@/components/ui/AppLink";
import DeficiencySymptomImage from "@/components/nutrients/DeficiencySymptomImage";
import { getCropManagementProfile } from "@/data/crop-management";
import { getFertilizerForCrop, haToAcre } from "@/data/knowledge/fertilizer-recommendations";
import { enrichCropDetail } from "@/lib/cropDetailEnrichment";
import {
  nutrientNameHi,
  resolveNutrientSlug,
} from "@/lib/nutrients/farmerNutrientView";
import { getCropHindiName } from "@/lib/crops/crop-display";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { Crop } from "@/types/crop";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/cn";

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

const SLUG_SYMBOL: Record<string, string> = {
  nitrogen: "N",
  phosphorus: "P",
  potassium: "K",
  calcium: "Ca",
  magnesium: "Mg",
  sulphur: "S",
  iron: "Fe",
  zinc: "Zn",
  manganese: "Mn",
  copper: "Cu",
  boron: "B",
  molybdenum: "Mo",
};

function riskForNutrient(name: string, solution: string): "high" | "medium" | "low" {
  const slug = resolveNutrientSlug(name) ?? "";
  if (/(zinc|nitrogen|iron|khaira|blossom|नाइट्रोजन|जिंक|लोहा)/i.test(name + solution + slug))
    return "high";
  if (/(potassium|phosphorus|boron|sulph|पोटैश|फॉस्फ|बोरॉन|सल्फर)/i.test(name + slug))
    return "medium";
  return "low";
}

function symbolFor(nameOrSlug: string): string {
  const slug = resolveNutrientSlug(nameOrSlug);
  if (slug && SLUG_SYMBOL[slug]) return SLUG_SYMBOL[slug];
  return nameOrSlug.slice(0, 2);
}

export default function CropNutrientsSection({ crop }: { crop: Crop }) {
  const detail = useMemo(() => enrichCropDetail(crop), [crop]);
  const fert = useMemo(() => getFertilizerForCrop(crop.slug), [crop.slug]);
  const profile = useMemo(
    () => getCropManagementProfile(crop.slug) as CropManagementWithDossier | null,
    [crop.slug]
  );
  const nutrients = detail.nutrients;
  const cropLabel = getCropHindiName(crop.slug) || crop.name;

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
    ? `N:P:K ${Math.round(haToAcre(fert.n, 1))} : ${Math.round(haToAcre(fert.p2o5, 1))} : ${Math.round(haToAcre(fert.k2o, 1))} किग्रा/एकड़`
    : crop.fertilizerSchedule.basalDose[0] ?? "मिट्टी जाँच के बाद NPK";

  const nutrientLinks = useMemo(() => {
    const base = [
      { symbol: "N", href: "nitrogen" },
      { symbol: "P", href: "phosphorus" },
      { symbol: "K", href: "potassium" },
    ];
    const extra = nutrients
      .map((n) => {
        const href = resolveNutrientSlug(n.nutrient);
        if (!href || ["nitrogen", "phosphorus", "potassium"].includes(href)) return null;
        return { symbol: symbolFor(href), href };
      })
      .filter(Boolean) as { symbol: string; href: string }[];
    return [...base, ...extra];
  }, [nutrients]);

  return (
    <div className="space-y-4">
      {profile?.dossierPgrNotes?.length ? (
        <DarkCard>
          <h3 className="font-display text-[15px] font-bold text-[var(--av-text-primary)]">
            वृद्धि नियामक सुझाव
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
          ज़रूरी पोषक तत्व — {cropLabel}
        </h3>
        <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">
          प्रतीक पर टैप करें — पहचान और उपाय खुलेंगे। सुधार इस फसल की खाद योजना से जुड़े हैं।
        </p>
        <div className="mt-3.5 flex flex-wrap gap-2.5">
          {nutrientLinks.map((n) => (
            <AppLink
              key={n.href}
              href={`/deficiencies/${n.href}?crop=${encodeURIComponent(crop.slug)}`}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl text-[13px] font-black shadow-sm transition hover:scale-105",
                SYM_TILE[n.symbol] ?? "bg-emerald-700 text-white"
              )}
              title={nutrientNameHi(n.href)}
            >
              {n.symbol}
            </AppLink>
          ))}
        </div>
      </DarkCard>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {nutrients.slice(0, 4).map((n, i) => {
          const risk = riskForNutrient(n.nutrient, n.solution);
          const href = resolveNutrientSlug(n.nutrient);
          const symbol = symbolFor(n.nutrient);
          const labelHi = nutrientNameHi(n.nutrient);
          const body = (
            <>
              <div className="relative mb-2 h-28 w-full overflow-hidden rounded-xl border border-[var(--av-border)]">
                <DeficiencySymptomImage
                  cropSlug={crop.slug}
                  nutrient={href ?? n.nutrient}
                  alt={`${cropLabel} — ${labelHi} कमी`}
                  className="absolute inset-0"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <span
                  className={cn(
                    "absolute left-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-black shadow-sm",
                    SYM_TILE[symbol] ?? "bg-emerald-700 text-white"
                  )}
                >
                  {symbol}
                </span>
                <span className="absolute right-2 top-2">
                  <RiskBadge level={risk} />
                </span>
              </div>
              <p className="font-display text-[14px] font-bold text-[var(--av-text-primary)]">
                {labelHi}
              </p>
              <p className="mt-1.5 line-clamp-3 text-[11px] leading-snug text-[var(--av-text-muted)]">
                {n.symptoms}
              </p>
              {href ? (
                <span className="mt-3 inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  पूरी गाइड देखें
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              ) : null}
            </>
          );

          return href ? (
            <AppLink
              key={n.nutrient}
              href={`/deficiencies/${href}?crop=${encodeURIComponent(crop.slug)}`}
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
          कमी गाइड — {cropLabel}
        </h3>
        <table className="av-table min-w-[560px]">
          <thead>
            <tr>
              <th>फोटो</th>
              <th>पोषक</th>
              <th>लक्षण</th>
              <th>संभावित कारण</th>
              <th>जोखिम</th>
              <th>उपाय</th>
            </tr>
          </thead>
          <tbody>
            {nutrients.map((row) => {
              const risk = riskForNutrient(row.nutrient, row.solution);
              const href = resolveNutrientSlug(row.nutrient);
              const labelHi = nutrientNameHi(row.nutrient);
              return (
                <tr key={row.nutrient}>
                  <td className="w-16">
                    <div className="h-12 w-14 overflow-hidden rounded-lg border border-[var(--av-border)]">
                      <DeficiencySymptomImage
                        cropSlug={crop.slug}
                        nutrient={href ?? row.nutrient}
                        alt={labelHi}
                      />
                    </div>
                  </td>
                  <td className="font-bold text-[var(--av-accent)]">
                    {href ? (
                      <AppLink
                        href={`/deficiencies/${href}?crop=${encodeURIComponent(crop.slug)}`}
                        className="inline-flex items-center gap-1 hover:underline"
                      >
                        {labelHi}
                        <ChevronRight className="h-3 w-3 opacity-60" />
                      </AppLink>
                    ) : (
                      labelHi
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
            इस फसल के सूक्ष्म पोषक
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
          संतुलित पोषण लक्ष्य
        </h3>
        <p className="mt-2 font-display text-lg font-bold text-[var(--av-accent)]">{npkLabel}</p>
        <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
          मिट्टी जाँच के बाद ही मात्रा बदलें। अवस्था अनुसार विभाजन खाद टैब में देखें।
        </p>
        <AppLink
          href={`/crops/${crop.slug}?tab=fertilizer`}
          className="mt-3 inline-flex items-center gap-0.5 text-xs font-bold text-[var(--av-accent)]"
        >
          खाद योजना खोलें
          <ChevronRight className="h-3.5 w-3.5" />
        </AppLink>
      </DarkCard>
    </div>
  );
}
