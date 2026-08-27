import type { MandiRow } from "@/lib/mandi/types";

/** App crop slug → mandi commodity name (data.gov / mock rows). */
export const CROP_SLUG_TO_MANDI_CROP: Record<string, string> = {
  paddy: "Paddy",
  wheat: "Wheat",
  maize: "Maize",
  bajra: "Bajra",
  soybean: "Soybean",
  moongfali: "Groundnut",
  groundnut: "Groundnut",
  mustard: "Mustard",
  cotton: "Cotton",
  tomato: "Tomato",
  potato: "Potato",
  onion: "Onion",
  chilli: "Chilli",
  cauliflower: "Cauliflower",
  cucumber: "Cucumber",
  brinjal: "Brinjal",
  bhindi: "Bhindi",
  sugarcane: "Sugarcane",
  chana: "Gram",
  pulses: "Tur",
  moong: "Moong",
  masoor: "Masoor",
  urad: "Urad",
  ginger: "Ginger",
  garlic: "Garlic",
  mango: "Mango",
  banana: "Banana",
  grapes: "Grapes",
};

export function mandiCropForSlug(slug: string): string | null {
  return CROP_SLUG_TO_MANDI_CROP[slug] ?? null;
}

/** Best mandi quote for this crop — highest modal when several mandis report. */
export function bestMandiRowForSlug(rows: MandiRow[], slug: string): MandiRow | null {
  const crop = mandiCropForSlug(slug);
  if (!crop) return null;
  const matches = rows.filter((r) => r.crop.toLowerCase() === crop.toLowerCase());
  if (!matches.length) return null;
  return matches.reduce((best, r) => (r.modal > best.modal ? r : best));
}
