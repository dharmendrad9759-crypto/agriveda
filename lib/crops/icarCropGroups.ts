import type { Crop } from "@/types/crop";

/**
 * Farmer listing groups aligned with ICAR / DES India crop groups
 * (not botanical family, not leftover JSON mappings).
 *
 * - Cereals — rice (IIRR), wheat (IIWBR), maize (IIMR) as food cereals
 * - Millets / nutri-cereals — bajra (IIMR); maize is NOT a millet here
 * - Pulses — IIPR: arhar, moong, urad, chana, masoor. Soybean & groundnut are oilseeds
 * - Oilseeds — IIOR: soybean, groundnut, rapeseed-mustard
 * - Vegetables — IIVR: tomato, potato, onion, brinjal, cauliflower, cucumber, okra
 * - Spices & condiments — IISR / DASD: chilli, ginger, garlic
 * - Fruits — IIHR: mango, banana, grapes
 * - Commercial — cotton (CICR), sugarcane (SBI)
 */
export type IcarCropGroup =
  | "Cereals"
  | "Millets"
  | "Pulses"
  | "Oilseeds"
  | "Vegetables"
  | "Fruits"
  | "Spices"
  | "Cash Crops";

const ICAR_GROUP_BY_SLUG: Record<string, IcarCropGroup> = {
  paddy: "Cereals",
  wheat: "Cereals",
  maize: "Cereals",

  bajra: "Millets",

  pulses: "Pulses",
  moong: "Pulses",
  chana: "Pulses",
  masoor: "Pulses",
  urad: "Pulses",

  soybean: "Oilseeds",
  moongfali: "Oilseeds",
  groundnut: "Oilseeds",
  mustard: "Oilseeds",

  tomato: "Vegetables",
  potato: "Vegetables",
  onion: "Vegetables",
  cauliflower: "Vegetables",
  cucumber: "Vegetables",
  brinjal: "Vegetables",
  bhindi: "Vegetables",

  chilli: "Spices",
  chili: "Spices",
  ginger: "Spices",
  garlic: "Spices",

  mango: "Fruits",
  banana: "Fruits",
  grapes: "Fruits",

  cotton: "Cash Crops",
  sugarcane: "Cash Crops",
};

export function getIcarCropGroup(slug: string): IcarCropGroup | null {
  const key = slug.trim().toLowerCase();
  return ICAR_GROUP_BY_SLUG[key] ?? null;
}

export function icarGroupFromCropCategory(category: Crop["category"]): IcarCropGroup {
  if (category === "Cash-Crops") return "Cash Crops";
  if (category === "Millets") return "Millets";
  if (category === "Oilseeds") return "Oilseeds";
  if (category === "Fruits") return "Fruits";
  if (category === "Spices") return "Spices";
  if (category === "Cereals") return "Cereals";
  if (category === "Pulses") return "Pulses";
  return "Vegetables";
}

export function listingGroupForCrop(crop: Pick<Crop, "slug" | "category">): IcarCropGroup {
  return getIcarCropGroup(crop.slug) ?? icarGroupFromCropCategory(crop.category);
}

export function cropCategoryFromIcarGroup(group: IcarCropGroup): Crop["category"] {
  if (group === "Cash Crops") return "Cash-Crops";
  if (group === "Millets") return "Millets";
  if (group === "Oilseeds") return "Oilseeds";
  if (group === "Fruits") return "Fruits";
  if (group === "Spices") return "Spices";
  if (group === "Cereals") return "Cereals";
  if (group === "Pulses") return "Pulses";
  return "Vegetables";
}
