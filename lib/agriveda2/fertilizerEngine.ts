import {
  getFertilizerForSlug,
  formatNutrientValue,
  scaleBagKg,
  FERTILIZER_UNIT_NOTE,
  type FertilizerCropEntry,
} from "@/data/agriveda2/fertilizer-data";
import { dataKeyForSlug } from "@/data/agriveda2/crop-slug-map";

export interface FertilizerPlanRow {
  nutrient: string;
  detail: string;
}

export interface FertilizerPlan {
  cropKey: string;
  acres: number;
  unitNote: string;
  nutrients: FertilizerPlanRow[];
  bags: { name: string; amount: string }[];
  schedule: { time: string; apply: string }[];
}

const NUTRIENT_ORDER = ["N", "P", "K", "Ca", "Mg", "S", "Zn", "Fe", "B", "Mo", "Si", "Rhizobium", "Rhizobium_PSB"] as const;

export function buildFertilizerPlan(cropSlug: string, acres: number): FertilizerPlan | null {
  const entry = getFertilizerForSlug(cropSlug);
  const cropKey = dataKeyForSlug(cropSlug);
  if (!entry || !cropKey) return null;

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
    acres,
    unitNote: FERTILIZER_UNIT_NOTE,
    nutrients,
    bags,
    schedule,
  };
}
