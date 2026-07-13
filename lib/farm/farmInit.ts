import { cropCatalog, type MyCropItem } from "@/data/crop-catalog";
import { writeStorage } from "@/lib/storage";
import type { FarmerField } from "@/types/spray-rotation";
import type { FarmData, FarmField } from "@/lib/farm/types";

const FARM_KEY = "agriveda-farm-data";
const SPRAY_KEY = "agriveda-spray-fields";
const CROPS_KEY = "agriveda-my-crops";

export interface OnboardingFieldInput {
  name: string;
  areaAcres: number;
  cropSlug: string;
  ownership: "Owned" | "Leased";
  variety?: string;
}

export const EMPTY_FARM_DATA: FarmData = {
  fields: [],
  activities: [],
  notes: [],
};

export function cropSlugFromLabel(crop: string): string | undefined {
  const base = crop.split("(")[0].trim().toLowerCase();
  const match = cropCatalog.find(
    (c) => c.slug === base || c.name.toLowerCase() === base
  );
  return match?.slug;
}

export function buildFarmFieldFromInput(input: OnboardingFieldInput, index: number): FarmField {
  const catalog = cropCatalog.find((c) => c.slug === input.cropSlug);
  const cropLabel = catalog
    ? input.variety?.trim()
      ? `${catalog.name} (${input.variety.trim()})`
      : catalog.name
    : input.cropSlug;

  return {
    id: `f-${Date.now()}-${index}`,
    name: input.name.trim(),
    area: `${input.areaAcres.toFixed(2)} Acre`,
    ownership: input.ownership,
    crop: cropLabel,
    cropSlug: input.cropSlug,
    status: "Active",
    sowingDate: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    emoji: catalog?.emoji ?? "🌾",
    health: 75,
    stage: "Active growth",
  };
}

export function parseAreaAcres(area: string): number {
  const match = area.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

export function totalAreaAcres(fields: { area: string }[]): number {
  return fields.reduce((sum, f) => sum + parseAreaAcres(f.area), 0);
}

export function syncSprayFieldsFromFarm(fields: FarmField[]) {
  const spray: FarmerField[] = fields.map((f) => ({
    id: f.id,
    name: f.name,
    cropSlug: f.cropSlug ?? cropSlugFromLabel(f.crop) ?? "paddy",
    areaAcres: String(parseAreaAcres(f.area)),
  }));
  writeStorage(SPRAY_KEY, spray);
}

export function syncMyCropsFromFarm(fields: FarmField[]) {
  const slugs = [
    ...new Set(
      fields
        .map((f) => f.cropSlug ?? cropSlugFromLabel(f.crop))
        .filter((s): s is string => Boolean(s))
    ),
  ].slice(0, 4);

  const crops: MyCropItem[] = slugs.map((slug) => {
    const catalog = cropCatalog.find((c) => c.slug === slug);
    return {
      slug,
      name: catalog?.name ?? slug,
      emoji: catalog?.emoji ?? "🌾",
    };
  });
  writeStorage(CROPS_KEY, crops);
}

export function initializeFarmData(fields: FarmField[]): FarmData {
  const data: FarmData = { ...EMPTY_FARM_DATA, fields };
  writeStorage(FARM_KEY, data);
  syncSprayFieldsFromFarm(fields);
  syncMyCropsFromFarm(fields);
  return data;
}
