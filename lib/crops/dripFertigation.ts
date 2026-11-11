import { CROP_TIMING } from "@/data/crop-detail-timing";
import type { Crop } from "@/types/crop";

/**
 * Crops where Indian farmers commonly run drip / टपक fertigation.
 * Potato, wheat, paddy, mustard, gram, maize, soybean stay furrow/flood.
 */
export const DRIP_FERTIGATION_SLUGS = new Set([
  "tomato",
  "chilli",
  "capsicum",
  "brinjal",
  "okra",
  "bhindi",
  "cucumber",
  "watermelon",
  "muskmelon",
  "onion",
  "cauliflower",
  "cabbage",
  "banana",
  "pomegranate",
  "sugarcane",
  "bottle-gourd",
  "bitter-gourd",
]);

export function cropSupportsDripFertigation(crop: Pick<Crop, "slug"> | { slug?: string }): boolean {
  return DRIP_FERTIGATION_SLUGS.has((crop.slug || "").toLowerCase());
}

export function mentionsDripFertigation(text: string): boolean {
  return /ड्रिप|drip|fertigation|फर्टिगेशन|ड्रेंचिंग|drench/i.test(text);
}

export function withoutDripFertigationLines<T extends { apply?: string; detail?: string; method?: string; time?: string }>(
  rows: T[],
  supportsDrip: boolean
): T[] {
  if (supportsDrip) return rows;
  return rows.filter((r) => {
    const text = `${r.apply ?? ""} ${r.detail ?? ""} ${r.method ?? ""} ${r.time ?? ""}`;
    return !mentionsDripFertigation(text);
  });
}

export function filterDripMentions(lines: string[], supportsDrip: boolean): string[] {
  if (supportsDrip) return lines;
  return lines.filter((line) => !mentionsDripFertigation(line));
}

export function dripRowsFromSchedule<T extends { time?: string; method?: string; apply?: string }>(
  rows: T[]
): T[] {
  return rows.filter((r) =>
    mentionsDripFertigation(`${r.time ?? ""} ${r.method ?? ""} ${r.apply ?? ""}`)
  );
}

/** Crop-specific drip/drench doses from the timing pack (per acre, farmer units already in source). */
export function dripScheduleFromTiming(
  slug: string,
  hi: boolean
): { stage: number; time: string; method: string; apply: string }[] {
  const pack = CROP_TIMING[slug];
  if (!pack?.fertilizers?.length) return [];
  return pack.fertilizers.map((f, i) => ({
    stage: i + 1,
    time: f.timing,
    method: hi ? "ड्रिप / ड्रेंचिंग" : "Drip / drench",
    apply: f.dose,
  }));
}
