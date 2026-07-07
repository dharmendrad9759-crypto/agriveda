import { getCropManagementProfile } from "@/data/crop-management";
import {
  getFertilizerForSlug,
  formatNutrientValue,
  scaleBagKg,
  FERTILIZER_UNIT_NOTE,
  type FertilizerCropEntry,
} from "@/data/agriveda2/fertilizer-data";
import { dataKeyForSlug } from "@/data/agriveda2/crop-slug-map";
import { cropCatalog } from "@/data/crop-catalog";

export interface FertilizerPlanRow {
  nutrient: string;
  detail: string;
}

export interface FertilizerPlan {
  cropKey: string;
  cropSlug: string;
  acres: number;
  source: "verified" | "guide";
  unitNote: string;
  nutrients: FertilizerPlanRow[];
  bags: { name: string; amount: string }[];
  schedule: { time: string; apply: string }[];
  guideNotes: string[];
}

const NUTRIENT_ORDER = [
  "N",
  "P",
  "K",
  "Ca",
  "Mg",
  "S",
  "Zn",
  "Fe",
  "B",
  "Mo",
  "Si",
  "Rhizobium",
  "Rhizobium_PSB",
] as const;

function buildFromGuide(slug: string, acres: number): FertilizerPlan | null {
  const profile = getCropManagementProfile(slug);
  if (!profile) return null;

  const nutrients: FertilizerPlanRow[] = [];
  if (profile.fertilizerSchedule?.length) {
    nutrients.push({
      nutrient: "Schedule",
      detail: profile.fertilizerSchedule.join(" · "),
    });
  }
  if (profile.micronutrients?.length) {
    nutrients.push({
      nutrient: "Micro",
      detail: profile.micronutrients.join(" · "),
    });
  }

  return {
    cropKey: profile.name,
    cropSlug: slug,
    acres,
    source: "guide",
    unitNote: FERTILIZER_UNIT_NOTE,
    nutrients,
    bags: [],
    schedule: (profile.fertilizerSchedule ?? []).map((line, i) => ({
      time: `Step ${i + 1}`,
      apply: line,
    })),
    guideNotes: profile.irrigationSchedule?.slice(0, 2) ?? [],
  };
}

function buildFromVerified(entry: FertilizerCropEntry, cropKey: string, slug: string, acres: number): FertilizerPlan {
  const nutrients: FertilizerPlanRow[] = [];
  for (const key of NUTRIENT_ORDER) {
    const val = entry[key as keyof FertilizerCropEntry];
    if (val != null) {
      nutrients.push({ nutrient: key, detail: formatNutrientValue(val as never) });
    }
  }

  const bagsRaw = entry.fertilizer_bags_per_acre ?? entry.fertilizer_bags ?? {};
  const bags = Object.entries(bagsRaw).map(([name, amount]) => ({
    name,
    amount: acres === 1 ? amount : scaleBagKg(amount, acres),
  }));

  const schedule = (entry.schedule ?? []).map((s) => ({
    time: s.time,
    apply: acres === 1 ? s.apply : `${s.apply} (× ${acres} acre)`,
  }));

  return {
    cropKey,
    cropSlug: slug,
    acres,
    source: "verified",
    unitNote: FERTILIZER_UNIT_NOTE,
    nutrients,
    bags,
    schedule,
    guideNotes: [],
  };
}

export function buildFertilizerPlan(cropSlug: string, acres: number): FertilizerPlan | null {
  const entry = getFertilizerForSlug(cropSlug);
  const cropKey = dataKeyForSlug(cropSlug);
  if (entry && cropKey) return buildFromVerified(entry, cropKey, cropSlug, acres);
  return buildFromGuide(cropSlug, acres);
}

export function listFertilizerCrops(): string[] {
  return cropCatalog
    .filter((c) => buildFertilizerPlan(c.slug, 1) != null)
    .map((c) => c.slug);
}
