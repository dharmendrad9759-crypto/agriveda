"use client";

import DarkCard from "@/components/shell/DarkCard";
import RiskBadge from "@/components/shell/RiskBadge";
import AppLink from "@/components/ui/AppLink";
import FarmerSplitCard from "@/components/ui/FarmerSplitCard";
import { getCropManagementProfile } from "@/data/crop-management";
import { getFertilizerForCrop, haToAcre } from "@/data/knowledge/fertilizer-recommendations";
import { enrichCropDetail } from "@/lib/cropDetailEnrichment";
import {
  nutrientNameHi,
  resolveNutrientSlug,
} from "@/lib/nutrients/farmerNutrientView";
import {
  getCropDeficiencyImage,
  getSharedDeficiencyImage,
} from "@/lib/nutrients/deficiencyImages";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { useLocale } from "@/components/i18n/LocaleProvider";
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

function nutrientPhoto(cropSlug: string, nutrient: string): string {
  return (
    getCropDeficiencyImage(cropSlug, nutrient) ||
    getSharedDeficiencyImage(nutrient) ||
    "/images/home/home-job-yellow-leaf.jpg"
  );
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
  const cropLabel = (hi && getCropHindiName(crop.slug)) || crop.name;

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
    ? `N:P:K ${Math.round(haToAcre(fert.n, 1))} : ${Math.round(haToAcre(fert.p2o5, 1))} : ${Math.round(haToAcre(fert.k2o, 1))} ${hi ? "किग्रा/एकड़" : "kg/acre"}`
    : crop.fertilizerSchedule.basalDose[0] ??
      (hi ? "मिट्टी जाँच के बाद NPK" : "NPK after soil test");

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-extrabold text-[var(--av-text-primary)]">
          {hi ? `पीली पत्ती — ${cropLabel}` : `Yellow leaf — ${cropLabel}`}
        </h3>
        <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
          {hi
            ? "कमी चुनें · फोटो देखकर पहचानें"
            : "Pick a deficiency · match the photo"}
        </p>
      </div>

      <ul className="space-y-2.5">
        {nutrients.map((n) => {
          const risk = riskForNutrient(n.nutrient, n.solution);
          const href = resolveNutrientSlug(n.nutrient);
          const symbol = symbolFor(n.nutrient);
          const labelHi = nutrientNameHi(n.nutrient);
          const title = hi ? labelHi : n.nutrient;
          const photo = nutrientPhoto(crop.slug, href ?? n.nutrient);
          const card = (
            <FarmerSplitCard
              title={title}
              subtitle={n.symptoms}
              image={photo}
              openHint={hi ? "पूरी गाइड" : "Full guide"}
              meta={
                <span className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-[10px] font-black",
                      SYM_TILE[symbol] ?? "bg-emerald-700 text-white"
                    )}
                  >
                    {symbol}
                  </span>
                  <RiskBadge level={risk} />
                </span>
              }
              {...(href
                ? {
                    href: `/deficiencies/${href}?crop=${encodeURIComponent(crop.slug)}`,
                  }
                : {})}
            />
          );
          return <li key={n.nutrient}>{card}</li>;
        })}
      </ul>

      {!nutrients.length ? (
        <p className="rounded-xl border border-dashed border-[var(--av-border)] px-4 py-6 text-center text-sm text-[var(--av-text-muted)]">
          {hi ? "इस फसल की कमी सूची जल्द आएगी" : "Deficiency list coming soon"}
        </p>
      ) : null}

      {micros.length > 0 ? (
        <DarkCard>
          <h3 className="text-[14px] font-extrabold text-[var(--av-text-primary)]">
            {hi ? "सूक्ष्म पोषक" : "Micronutrients"}
          </h3>
          <ul className="mt-2 space-y-1.5">
            {micros.slice(0, 4).map((m) => (
              <li key={m} className="text-[12px] font-semibold text-[var(--av-text-secondary)]">
                • {m}
              </li>
            ))}
          </ul>
        </DarkCard>
      ) : null}

      <DarkCard>
        <h3 className="text-[14px] font-extrabold text-[var(--av-text-primary)]">
          {hi ? "संतुलित पोषण लक्ष्य" : "Balanced nutrition target"}
        </h3>
        <p className="mt-1.5 text-[15px] font-black text-[var(--av-accent)]">{npkLabel}</p>
        <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
          {hi
            ? "मिट्टी जाँच के बाद मात्रा बदलें · खाद योजना में अवस्था देखें"
            : "Adjust after soil test · see fertilizer plan for stages"}
        </p>
        <AppLink
          href={`/crops/${crop.slug}/care/fertilizer`}
          className="mt-2.5 inline-flex items-center gap-0.5 text-xs font-bold text-[var(--av-accent)]"
        >
          {hi ? "खाद योजना खोलें" : "Open fertilizer plan"}
          <ChevronRight className="h-3.5 w-3.5" />
        </AppLink>
      </DarkCard>
    </div>
  );
}
