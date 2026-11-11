/** Mandi quotes are variety-wise when that crop is actually sold that way. पूसा 1121 ≠ पूसा 1509. */

export type MandiVarietyQuote = {
  name: string;
  /** Added to the crop's base modal (₹/quintal) */
  offset: number;
};

export const CROP_MANDI_VARIETIES: Record<string, MandiVarietyQuote[]> = {
  Paddy: [
    { name: "पूसा 1121", offset: 3050 },
    { name: "पूसा 1509", offset: 1720 },
    { name: "PR 126", offset: 40 },
  ],
  Wheat: [
    { name: "HD 2967", offset: 0 },
    { name: "शरबती", offset: 1180 },
  ],
  Gram: [
    { name: "देसी", offset: 0 },
    { name: "काबुली", offset: 1860 },
  ],
  Mustard: [
    { name: "पूसा बोल्ड", offset: 0 },
    { name: "गिरिराज", offset: 140 },
  ],
  Soybean: [
    { name: "JS 335", offset: 0 },
    { name: "JS 20-34", offset: 90 },
  ],
  Maize: [
    { name: "पायनियर 3396", offset: 0 },
    { name: "डेसी", offset: -70 },
  ],
  Onion: [
    { name: "नासिक लाल", offset: 0 },
    { name: "भीमा सुपर", offset: 180 },
  ],
  Potato: [
    { name: "कुफरी पुखराज", offset: 0 },
    { name: "कुफरी ज्योति", offset: 70 },
  ],
  Cotton: [
    { name: "रासी 659", offset: 0 },
    { name: "अंकुर 3028", offset: 220 },
  ],
  Chilli: [
    { name: "तेजा", offset: 0 },
    { name: "आर्मर", offset: 350 },
  ],
};

const VARIETY_ALIASES: Array<{ test: RegExp; name: string }> = [
  { test: /\b1121\b|pusa\s*basmati\s*1121|पूसा\s*(बासमती\s*)?1121/i, name: "पूसा 1121" },
  { test: /\b1509\b|pusa\s*basmati\s*1509|पूसा\s*(बासमती\s*)?1509/i, name: "पूसा 1509" },
  { test: /\bpr\s*[-]?\s*126\b/i, name: "PR 126" },
  { test: /sharbati|शरबती/i, name: "शरबती" },
  { test: /\bhd\s*[-]?\s*2967\b/i, name: "HD 2967" },
  { test: /kabuli|काबुली/i, name: "काबुली" },
  { test: /\bdesi\b|देसी/i, name: "देसी" },
  { test: /nasik|नासिक/i, name: "नासिक लाल" },
  { test: /teja|तेजा/i, name: "तेजा" },
  { test: /\bgrade\s*a\b|ग्रेड\s*a/i, name: "ग्रेड A" },
];

export function isGenericMandiGrade(value: string) {
  return /^(faq|other|others|na|n\/a|common|local|hybrid|-|—|सामान्य)$/i.test(value.trim());
}

/** Keep live Agmarknet variety names; map 1121/1509; drop empty FAQ noise. Do not invent a variety. */
export function prettyMandiVariety(_crop: string, variety?: string, grade?: string): string {
  const raw = [variety, grade]
    .map((v) => (v || "").trim())
    .find((v) => v && !isGenericMandiGrade(v));
  if (!raw) return "";
  const alias = VARIETY_ALIASES.find((item) => item.test.test(raw));
  return alias ? alias.name : raw;
}

export function varietiesForCrop(crop: string): MandiVarietyQuote[] {
  return CROP_MANDI_VARIETIES[crop] ?? [{ name: "", offset: 0 }];
}
