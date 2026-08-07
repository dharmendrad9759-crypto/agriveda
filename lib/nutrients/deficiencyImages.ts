/**
 * Crop × nutrient deficiency leaf photos.
 * Prefer `/images/deficiencies/{crop}-{nutrient}.jpg`, else shared nutrient art.
 */

export const DEFICIENCY_NUTRIENT_SLUGS = [
  "nitrogen",
  "phosphorus",
  "potassium",
  "calcium",
  "magnesium",
  "sulphur",
  "iron",
  "zinc",
  "manganese",
  "copper",
  "boron",
  "molybdenum",
] as const;

export type DeficiencyNutrientSlug = (typeof DEFICIENCY_NUTRIENT_SLUGS)[number];

const NAME_TO_SLUG: Record<string, DeficiencyNutrientSlug> = {
  nitrogen: "nitrogen",
  n: "nitrogen",
  नाइट्रोजन: "nitrogen",
  phosphorus: "phosphorus",
  p: "phosphorus",
  फॉस्फोरस: "phosphorus",
  potassium: "potassium",
  k: "potassium",
  पोटाश: "potassium",
  calcium: "calcium",
  ca: "calcium",
  कैल्शियम: "calcium",
  magnesium: "magnesium",
  mg: "magnesium",
  मैग्नीशियम: "magnesium",
  sulphur: "sulphur",
  sulfur: "sulphur",
  s: "sulphur",
  सल्फर: "sulphur",
  iron: "iron",
  fe: "iron",
  लोहा: "iron",
  zinc: "zinc",
  zn: "zinc",
  ज़िंक: "zinc",
  जिंक: "zinc",
  manganese: "manganese",
  mn: "manganese",
  copper: "copper",
  cu: "copper",
  boron: "boron",
  b: "boron",
  बोरॉन: "boron",
  molybdenum: "molybdenum",
  mo: "molybdenum",
};

export function nutrientNameToSlug(nameOrSymbol: string): DeficiencyNutrientSlug | undefined {
  const key = nameOrSymbol.trim().toLowerCase();
  return NAME_TO_SLUG[key];
}

/** Batch / UI crop labels → app slug for crop×nutrient photo files */
const CROP_LABEL_TO_SLUG: Record<string, string> = {
  paddy: "paddy",
  rice: "paddy",
  धान: "paddy",
  wheat: "wheat",
  गेहूँ: "wheat",
  maize: "maize",
  corn: "maize",
  मक्का: "maize",
  bajra: "bajra",
  "pearl millet": "bajra",
  बाजरा: "bajra",
  soybean: "soybean",
  सोयाबीन: "soybean",
  groundnut: "moongfali",
  moongfali: "moongfali",
  peanut: "moongfali",
  मूंगफली: "moongfali",
  tomato: "tomato",
  टमाटर: "tomato",
  potato: "potato",
  आलू: "potato",
  chilli: "chilli",
  chili: "chilli",
  मिर्च: "chilli",
  brinjal: "brinjal",
  eggplant: "brinjal",
  बैंगन: "brinjal",
  onion: "onion",
  प्याज: "onion",
  cauliflower: "cauliflower",
  फूलगोभी: "cauliflower",
  cucumber: "cucumber",
  खीरा: "cucumber",
  cotton: "cotton",
  कपास: "cotton",
  sugarcane: "sugarcane",
  गन्ना: "sugarcane",
  okra: "bhindi",
  bhindi: "bhindi",
  भिंडी: "bhindi",
  moong: "moong",
  मूंग: "moong",
  capsicum: "chilli",
  "bell pepper": "chilli",
  cabbage: "cauliflower",
  arhar: "moong",
  pigeonpea: "moong",
  "pigeon pea": "moong",
};

export function cropLabelToImageSlug(cropLabel: string): string | undefined {
  const key = cropLabel.trim().toLowerCase();
  if (CROP_LABEL_TO_SLUG[key]) return CROP_LABEL_TO_SLUG[key];
  // Try first word (e.g. "Paddy / Rice")
  const first = key.split(/[/(]/)[0]?.trim();
  if (first && CROP_LABEL_TO_SLUG[first]) return CROP_LABEL_TO_SLUG[first];
  // Already an app slug?
  if (/^[a-z]+$/.test(key)) return key;
  return undefined;
}

export function cropDeficiencyImagePath(cropSlug: string, nutrientSlug: string): string {
  return `/images/deficiencies/${cropSlug}-${nutrientSlug}.jpg`;
}

export function sharedDeficiencyImagePath(nutrientSlug: string): string {
  return `/images/deficiencies/${nutrientSlug}.jpg`;
}

/** Preferred crop-specific URL; UI falls back on error. */
export function getCropDeficiencyImage(cropSlug: string, nutrientNameOrSlug: string): string {
  const nutrient =
    nutrientNameToSlug(nutrientNameOrSlug) ||
    (DEFICIENCY_NUTRIENT_SLUGS.includes(nutrientNameOrSlug as DeficiencyNutrientSlug)
      ? (nutrientNameOrSlug as DeficiencyNutrientSlug)
      : undefined);
  if (!nutrient) return "/images/home/home-job-yellow-leaf.jpg";
  return cropDeficiencyImagePath(cropSlug, nutrient);
}

export function getSharedDeficiencyImage(nutrientNameOrSlug: string): string {
  const nutrient =
    nutrientNameToSlug(nutrientNameOrSlug) ||
    (DEFICIENCY_NUTRIENT_SLUGS.includes(nutrientNameOrSlug as DeficiencyNutrientSlug)
      ? (nutrientNameOrSlug as DeficiencyNutrientSlug)
      : undefined);
  if (!nutrient) return "/images/home/home-job-yellow-leaf.jpg";
  return sharedDeficiencyImagePath(nutrient);
}
