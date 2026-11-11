/**
 * State (and a few districts) → local bigha, the soil farmers actually name,
 * and a short climate line. Acre area still comes from the map.
 */

import { getBighaInfo } from "@/lib/bighaConversion";

export type FieldPlace = {
  stateEn: string;
  stateHi: string;
  district?: string;
  village?: string;
  bighaId: string;
  acresPerBigha: number;
  /** Shown as “1 बीघा = …”, never as the field’s own area. */
  bighaLineHi: string;
  soil: string;
  /** Climate zone farmers can recognise, not a lab reading of this field. */
  climateHi: string;
};

const STATE_HI: Record<string, string> = {
  "Andhra Pradesh": "आंध्र प्रदेश",
  "Arunachal Pradesh": "अरुणाचल प्रदेश",
  Assam: "असम",
  Bihar: "बिहार",
  Chhattisgarh: "छत्तीसगढ़",
  Goa: "गोवा",
  Gujarat: "गुजरात",
  Haryana: "हरियाणा",
  "Himachal Pradesh": "हिमाचल प्रदेश",
  Jharkhand: "झारखंड",
  Karnataka: "कर्नाटक",
  Kerala: "केरल",
  "Madhya Pradesh": "मध्य प्रदेश",
  Maharashtra: "महाराष्ट्र",
  Manipur: "मणिपुर",
  Meghalaya: "मेघालय",
  Mizoram: "मिज़ोरम",
  Nagaland: "नागालैंड",
  Odisha: "ओडिशा",
  Punjab: "पंजाब",
  Rajasthan: "राजस्थान",
  Sikkim: "सिक्किम",
  "Tamil Nadu": "तमिलनाडु",
  Telangana: "तेलंगाना",
  Tripura: "त्रिपुरा",
  "Uttar Pradesh": "उत्तर प्रदेश",
  Uttarakhand: "उत्तराखंड",
  "West Bengal": "पश्चिम बंगाल",
  Delhi: "दिल्ली",
  "Jammu and Kashmir": "जम्मू और कश्मीर",
  Ladakh: "लद्दाख",
  Chandigarh: "चंडीगढ़",
  Puducherry: "पुडुचेरी",
};

type Facts = { soil: string; climateHi: string; bighaId?: string };

const STATE_FACTS: Record<string, Facts> = {
  "Uttar Pradesh": {
    soil: "जलोढ़ मिट्टी (Alluvial)",
    climateHi: "गर्मियाँ तेज़, जाड़ा ठंडा, बारिश ज्यादातर जुलाई से सितंबर",
    bighaId: "up",
  },
  Bihar: {
    soil: "जलोढ़ मिट्टी (Alluvial)",
    climateHi: "गर्म और नम, जाड़ा हल्का, मानसून में अच्छी बारिश",
    bighaId: "bihar",
  },
  "West Bengal": {
    soil: "जलोढ़ मिट्टी (Alluvial)",
    climateHi: "गर्म नम, बारिश ज़्यादा, जाड़ा हल्का",
    bighaId: "wb",
  },
  Punjab: {
    soil: "जलोढ़ मिट्टी (Alluvial)",
    climateHi: "गर्मियाँ तेज़, जाड़ा ठंडा, बारिश कम — सिंचाई ज़रूरी",
    bighaId: "punjab_haryana",
  },
  Haryana: {
    soil: "जलोढ़ मिट्टी (Alluvial)",
    climateHi: "गर्मियाँ तेज़, जाड़ा ठंडा, बारिश कम — सिंचाई ज़रूरी",
    bighaId: "punjab_haryana",
  },
  Delhi: {
    soil: "जलोढ़ मिट्टी (Alluvial)",
    climateHi: "गर्मियाँ तेज़, जाड़ा ठंडा, बारिश कम",
    bighaId: "up",
  },
  Uttarakhand: {
    soil: "दोमट मिट्टी (Loam)",
    climateHi: "पहाड़ पर ठंडा, मैदान में गर्मियाँ तेज़ और जाड़ा ठंडा",
  },
  "Himachal Pradesh": {
    soil: "दोमट मिट्टी (Loam)",
    climateHi: "पहाड़ी ठंड, घाटी में जाड़ा कड़ा और गर्मी हल्की",
  },
  "Jammu and Kashmir": {
    soil: "दोमट मिट्टी (Loam)",
    climateHi: "जाड़ा बहुत ठंडा, गर्मी छोटी, ऊँचाई पर ठंड रहती है",
  },
  Ladakh: {
    soil: "बलुई दोमट (Sandy Loam)",
    climateHi: "बहुत ठंडा और सूखा, बारिश नाममात्र",
  },
  Rajasthan: {
    soil: "बलुई दोमट (Sandy Loam)",
    climateHi: "गर्म और सूखा, बारिश कम, गर्मियाँ बहुत तेज़",
    bighaId: "rajasthan_std",
  },
  Gujarat: {
    soil: "काली मिट्टी (Black)",
    climateHi: "गर्म, अंदरूनी इलाका सूखा, किनारे पर नम",
    bighaId: "gujarat",
  },
  "Madhya Pradesh": {
    soil: "काली मिट्टी (Black)",
    climateHi: "गर्म, मानसून पर खरीफ, जाड़ा सुहावना",
    bighaId: "mp",
  },
  Maharashtra: {
    soil: "काली मिट्टी (Black)",
    climateHi: "गर्म, बारिश जून से सितंबर, किनारे पर ज़्यादा नम",
  },
  Telangana: {
    soil: "काली मिट्टी (Black)",
    climateHi: "गर्म, मानसून जून से अक्टूबर",
  },
  Karnataka: {
    soil: "लाल मिट्टी (Red)",
    climateHi: "उत्तर में सूखा-गर्म, पश्चिमी घाट पर बहुत बारिश",
  },
  "Andhra Pradesh": {
    soil: "लाल मिट्टी (Red)",
    climateHi: "तट पर नम, अंदर गर्म और कम बारिश",
  },
  "Tamil Nadu": {
    soil: "लाल मिट्टी (Red)",
    climateHi: "गर्म, बारिश ज्यादातर अक्टूबर से दिसंबर",
  },
  Kerala: {
    soil: "लाल मिट्टी (Red)",
    climateHi: "गर्म नम, साल भर बारिश के झोंके",
  },
  Odisha: {
    soil: "लाल मिट्टी (Red)",
    climateHi: "गर्म नम, मानसून में भारी बारिश",
  },
  Jharkhand: {
    soil: "लाल मिट्टी (Red)",
    climateHi: "गर्म, मानसून में अच्छी बारिश, जाड़ा हल्का",
  },
  Chhattisgarh: {
    soil: "लाल मिट्टी (Red)",
    climateHi: "गर्म नम, मानसून में अच्छी बारिश",
  },
  Assam: {
    soil: "जलोढ़ मिट्टी (Alluvial)",
    climateHi: "गर्म नम, बारिश बहुत, जाड़ा हल्का",
  },
  Goa: {
    soil: "लाल मिट्टी (Red)",
    climateHi: "गर्म नम समुद्री, मानसून में भारी बारिश",
  },
  Sikkim: {
    soil: "दोमट मिट्टी (Loam)",
    climateHi: "पहाड़ी ठंड, बारिश ज़्यादा, जाड़ा गीला",
  },
  "Arunachal Pradesh": {
    soil: "दोमट मिट्टी (Loam)",
    climateHi: "पहाड़ी नम, बारिश बहुत, जाड़ा हल्का ठंडा",
  },
  Manipur: {
    soil: "दोमट मिट्टी (Loam)",
    climateHi: "गर्म नम घाटी, पहाड़ पर ठंडा, मानसून में बारिश",
  },
  Meghalaya: {
    soil: "लाल मिट्टी (Red)",
    climateHi: "बहुत बारिश, गर्म नम, जाड़ा हल्का",
  },
  Mizoram: {
    soil: "लाल मिट्टी (Red)",
    climateHi: "गर्म नम पहाड़ी, मानसून में अच्छी बारिश",
  },
  Nagaland: {
    soil: "दोमट मिट्टी (Loam)",
    climateHi: "पहाड़ी नम, मानसून में बारिश, जाड़ा ठंडा",
  },
  Tripura: {
    soil: "लाल मिट्टी (Red)",
    climateHi: "गर्म नम, मानसून में अच्छी बारिश",
  },
  Chandigarh: {
    soil: "जलोढ़ मिट्टी (Alluvial)",
    climateHi: "गर्मियाँ तेज़, जाड़ा ठंडा, बारिश कम",
    bighaId: "punjab_haryana",
  },
  Puducherry: {
    soil: "लाल मिट्टी (Red)",
    climateHi: "गर्म तटीय, बारिश अक्टूबर से दिसंबर",
  },
};

/** District names that change the state default. Keys are lowercase. */
const DISTRICT_SOIL: Record<string, { soil: string; bighaId?: string }> = {
  mathura: { soil: "बलुई दोमट (Sandy Loam)", bighaId: "up_braj" },
  agra: { soil: "बलुई दोमट (Sandy Loam)" },
  jodhpur: { soil: "बलुई दोमट (Sandy Loam)", bighaId: "rajasthan_bada" },
  bikaner: { soil: "बलुई दोमट (Sandy Loam)", bighaId: "rajasthan_bada" },
  barmer: { soil: "बलुई दोमट (Sandy Loam)", bighaId: "rajasthan_bada" },
  jaisalmer: { soil: "बलुई दोमट (Sandy Loam)", bighaId: "rajasthan_bada" },
  kutch: { soil: "बलुई दोमट (Sandy Loam)" },
  hisar: { soil: "बलुई दोमट (Sandy Loam)" },
  sirsa: { soil: "बलुई दोमट (Sandy Loam)" },
  fatehabad: { soil: "बलुई दोमट (Sandy Loam)" },
  bhiwani: { soil: "बलुई दोमट (Sandy Loam)" },
  ganganagar: { soil: "बलुई दोमट (Sandy Loam)" },
  hanumangarh: { soil: "बलुई दोमट (Sandy Loam)" },
  belagavi: { soil: "काली मिट्टी (Black)" },
  belgaum: { soil: "काली मिट्टी (Black)" },
  vijayapura: { soil: "काली मिट्टी (Black)" },
  kalaburagi: { soil: "काली मिट्टी (Black)" },
  raichur: { soil: "काली मिट्टी (Black)" },
  bidar: { soil: "काली मिट्टी (Black)" },
};

function norm(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function districtFacts(district?: string) {
  if (!district) return undefined;
  const key = norm(district);
  for (const [name, facts] of Object.entries(DISTRICT_SOIL)) {
    if (key === name || key.includes(name)) return facts;
  }
  return undefined;
}

/** Western Uttar Pradesh sits in the upper Gangetic plain. */
const UPPER_GANGETIC = [
  "aligarh",
  "mathura",
  "agra",
  "meerut",
  "hathras",
  "etah",
  "bulandshahr",
  "bulandshahar",
  "ghaziabad",
  "gautam buddha nagar",
  "noida",
  "baghpat",
  "hapur",
  "muzaffarnagar",
  "saharanpur",
  "shamli",
  "bijnor",
  "moradabad",
  "amroha",
  "sambhal",
  "rampur",
  "bareilly",
  "pilibhit",
  "firozabad",
  "mainpuri",
  "kasganj",
  "etawah",
];

function climateFor(stateEn: string, district: string | undefined, fallback: string): string {
  const key = norm(district || "");
  if (
    stateEn === "Uttar Pradesh" &&
    UPPER_GANGETIC.some((name) => key === name || key.includes(name))
  ) {
    return "ऊपरी गंगा का मैदान";
  }
  return fallback;
}

export function stateLabelHi(stateEn: string): string {
  return STATE_HI[stateEn] || stateEn;
}

export function fieldPlaceFor(
  stateEn: string,
  district?: string,
  village?: string
): FieldPlace {
  const facts = STATE_FACTS[stateEn];
  const districtHit = districtFacts(district);
  const bighaId = districtHit?.bighaId || facts?.bighaId || "";
  const info = getBighaInfo(stateEn, district);
  const knownBigha = info.label !== "Standard bigha";
  const acresPerBigha = knownBigha ? info.acresPerBigha : 0;
  const bighaLineHi = knownBigha
    ? `1 बीघा = ${acresPerBigha} एकड़`
    : "इस राज्य में बीघा एक जैसा नहीं। एकड़ नक्शे से लिया जाएगा।";
  const villageName = village?.trim();

  return {
    stateEn,
    stateHi: stateLabelHi(stateEn),
    district: district?.trim() || undefined,
    village: villageName || undefined,
    bighaId: bighaId || "local",
    acresPerBigha,
    bighaLineHi,
    soil: districtHit?.soil || facts?.soil || "",
    climateHi: climateFor(
      stateEn,
      district,
      facts?.climateHi || "इस जगह का मौसम जिले की रीति से देखें।"
    ),
  };
}

export function matchStateName(raw: string, states: string[]): string {
  const n = norm(raw);
  if (!n) return "";
  return (
    states.find((state) => {
      const s = state.toLowerCase();
      const hi = stateLabelHi(state).toLowerCase();
      return n === s || n === hi || s.includes(n) || n.includes(s);
    }) || ""
  );
}

export const FARM_SOIL_OPTIONS = [
  "दोमट मिट्टी (Loam)",
  "काली मिट्टी (Black)",
  "जलोढ़ मिट्टी (Alluvial)",
  "बलुई दोमट (Sandy Loam)",
  "चिकनी मिट्टी (Clay)",
  "लाल मिट्टी (Red)",
] as const;

export function matchFarmSoil(value?: string): string {
  if (!value?.trim()) return "";
  const v = value.trim();
  if ((FARM_SOIL_OPTIONS as readonly string[]).includes(v)) return v;
  const n = v.toLowerCase();
  const hit = FARM_SOIL_OPTIONS.find((option) => {
    const hi = option.replace(/\s*\(.*\)$/, "").toLowerCase();
    const en = (option.match(/\(([^)]+)\)/)?.[1] || "").toLowerCase();
    return n.includes(hi) || hi.includes(n) || Boolean(en && (n.includes(en) || en.includes(n)));
  });
  return hit || "";
}

/** Dominant soil farmers name for this state/district — not a lab report. */
export function soilForPlace(state?: string, district?: string): string {
  const raw = (state || "").trim();
  if (!raw) return "";
  const states = Object.keys(STATE_HI);
  const stateEn = STATE_FACTS[raw] || STATE_HI[raw] ? raw : matchStateName(raw, states);
  if (!stateEn) return "";
  return fieldPlaceFor(stateEn, district).soil;
}
