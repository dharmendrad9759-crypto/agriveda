/** Map app crop slugs ↔ verified AGRIVEDA 2.1 dataset keys */
export const SLUG_TO_DATA_KEY: Record<string, string> = {
  paddy: "Dhan (Paddy)",
  wheat: "Gehun (Wheat)",
  maize: "Makka (Maize)",
  mustard: "Sarson (Mustard)",
  pulses: "Chana (Chickpea)",
  moong: "Moong (Green Gram)",
  soybean: "Soybean",
  bajra: "Bajra (Pearl Millet)",
  potato: "Alu (Potato)",
  tomato: "Tamatar (Tomato)",
  brinjal: "Baingan (Brinjal)",
  chilli: "Mirch (Chilli)",
  bhindi: "Bhindi (Okra)",
  cauliflower: "Gobhi (Cauliflower)",
  sugarcane: "Ganna (Sugarcane)",
};

export const BUWAI_SLUGS = [
  "paddy",
  "wheat",
  "maize",
  "mustard",
  "pulses",
  "soybean",
  "bajra",
  "moong",
  "potato",
  "tomato",
  "brinjal",
  "chilli",
  "bhindi",
  "cauliflower",
  "sugarcane",
] as const;

export const SEED_RATE_SLUGS = [
  ...BUWAI_SLUGS,
  "pulses",
] as const;

export const FERTILIZER_SLUGS = [
  "wheat",
  "paddy",
  "maize",
  "mustard",
  "pulses",
  "soybean",
  "potato",
  "tomato",
  "brinjal",
  "chilli",
  "cauliflower",
  "bhindi",
  "sugarcane",
] as const;

export function dataKeyForSlug(slug: string): string | undefined {
  return SLUG_TO_DATA_KEY[slug];
}

export function resolveNorthIndiaRegion(state?: string): string {
  const s = (state ?? "").toLowerCase().trim();
  if (!s) return "UP/Bihar/Jharkhand";
  if (/punjab|haryana|chandigarh/.test(s)) return "Punjab/Haryana";
  if (/rajasthan/.test(s)) return "Rajasthan";
  if (/madhya|chhattisgarh|\bmp\b/.test(s)) return "MP/Chhattisgarh";
  if (/maharashtra/.test(s)) return "MP/Maharashtra";
  if (/gujarat/.test(s)) return "Rajasthan/Haryana/Gujarat";
  if (/uttarakhand|uttar|up\b|bihar|jharkhand/.test(s)) return "UP/Bihar/Jharkhand";
  return "UP/Bihar/Jharkhand";
}
