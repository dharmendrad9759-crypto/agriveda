import { resolveNorthIndiaRegion } from "@/data/agriveda2/crop-slug-map";

/** Base suitability 0–100 per agro-climatic region */
export const REGION_CROP_SCORES: Record<string, Partial<Record<string, number>>> = {
  "Punjab/Haryana": {
    wheat: 98,
    paddy: 90,
    maize: 76,
    mustard: 86,
    potato: 82,
    sugarcane: 74,
    cotton: 68,
    tomato: 70,
    pulses: 72,
    cauliflower: 68,
    bhindi: 65,
    chilli: 62,
    brinjal: 60,
    cucumber: 58,
    bajra: 45,
    soybean: 55,
    moong: 58,
    moongfali: 40,
  },
  "UP/Bihar/Jharkhand": {
    paddy: 94,
    wheat: 90,
    potato: 88,
    sugarcane: 90,
    maize: 82,
    mustard: 78,
    pulses: 80,
    tomato: 76,
    bhindi: 78,
    cauliflower: 72,
    brinjal: 70,
    chilli: 68,
    cucumber: 66,
    cotton: 55,
    bajra: 50,
    soybean: 58,
    moong: 62,
    moongfali: 48,
  },
  "MP/Chhattisgarh": {
    soybean: 96,
    wheat: 88,
    paddy: 84,
    maize: 80,
    pulses: 78,
    cotton: 74,
    mustard: 76,
    potato: 68,
    tomato: 65,
    chilli: 62,
    sugarcane: 70,
    bajra: 58,
    bhindi: 60,
    moong: 72,
    moongfali: 55,
    cauliflower: 58,
    brinjal: 55,
  },
  Rajasthan: {
    bajra: 98,
    mustard: 94,
    moong: 88,
    moongfali: 86,
    wheat: 76,
    pulses: 82,
    cotton: 72,
    maize: 65,
    chilli: 60,
    cumin: 0,
    potato: 55,
    tomato: 48,
    paddy: 42,
    soybean: 58,
    sugarcane: 45,
    bhindi: 52,
    cauliflower: 45,
  },
  "MP/Maharashtra": {
    cotton: 96,
    soybean: 90,
    sugarcane: 88,
    paddy: 72,
    wheat: 68,
    maize: 74,
    chilli: 78,
    tomato: 76,
    onion: 70,
    pulses: 70,
    bajra: 62,
    moong: 68,
    mustard: 65,
    potato: 60,
    bhindi: 72,
    moongfali: 55,
    cauliflower: 58,
  },
  "Rajasthan/Haryana/Gujarat": {
    cotton: 94,
    moongfali: 92,
    wheat: 80,
    mustard: 82,
    bajra: 78,
    maize: 70,
    pulses: 75,
    potato: 68,
    chilli: 72,
    tomato: 65,
    paddy: 55,
    soybean: 68,
    sugarcane: 72,
    bhindi: 60,
    moong: 70,
    cauliflower: 55,
  },
};

/** Known district-level crop strengths (overrides regional base) */
export const DISTRICT_CROP_PROFILES: Record<string, Partial<Record<string, number>>> = {
  Agra: { potato: 98, wheat: 88, mustard: 72 },
  Aligarh: { potato: 96, mustard: 85, wheat: 80, maize: 70 },
  Bulandshahr: { sugarcane: 96, wheat: 82, paddy: 75 },
  Meerut: { sugarcane: 94, wheat: 85, potato: 78 },
  Moradabad: { paddy: 90, wheat: 86, sugarcane: 80 },
  Varanasi: { paddy: 92, wheat: 84, tomato: 75 },
  Lucknow: { wheat: 88, paddy: 86, potato: 80, sugarcane: 78 },
  Patna: { paddy: 95, wheat: 82, maize: 78, pulses: 75 },
  Muzaffarpur: { paddy: 94, wheat: 80, maize: 76, potato: 72 },
  Karnal: { paddy: 96, wheat: 94, maize: 72, mustard: 78 },
  Ludhiana: { wheat: 98, paddy: 88, maize: 75, potato: 70 },
  Hisar: { cotton: 88, wheat: 90, mustard: 82, bajra: 70 },
  Rohtak: { wheat: 92, mustard: 85, cotton: 75, maize: 72 },
  Kota: { mustard: 92, soybean: 88, wheat: 78, coriander: 0 },
  Jaipur: { mustard: 94, bajra: 90, moong: 82, wheat: 72 },
  Jodhpur: { bajra: 98, moong: 90, mustard: 88, moongfali: 75 },
  Indore: { soybean: 98, wheat: 88, paddy: 78, maize: 75 },
  Bhopal: { soybean: 92, wheat: 85, paddy: 80, pulses: 78 },
  Nagpur: { cotton: 96, soybean: 85, chilli: 78, orange: 0 },
  Pune: { sugarcane: 90, tomato: 82, onion: 78, bajra: 70 },
  Ahmedabad: { cotton: 94, moongfali: 90, wheat: 78, cumin: 0 },
  Surat: { sugarcane: 92, cotton: 88, paddy: 70 },
};

export const STATE_SOIL_TYPE: Record<string, string> = {
  rajasthan: "Sandy Loam (Balaui Domat)",
  gujarat: "Sandy Loam (Balaui Domat)",
  "madhya pradesh": "Black Cotton (Kaali Mitti)",
  maharashtra: "Black Cotton (Kaali Mitti)",
  chhattisgarh: "Black Cotton (Kaali Mitti)",
  punjab: "Loamy (Domat)",
  haryana: "Loamy (Domat)",
  uttar: "Loamy (Domat)",
  bihar: "Clay (Bhaaree Mitti)",
  jharkhand: "Clay (Bhaaree Mitti)",
};

export function waterIndexForState(state: string): "low" | "medium" | "high" {
  const s = state.toLowerCase();
  if (/rajasthan|gujarat/.test(s)) return "low";
  if (/punjab|haryana|uttar|bihar|jharkhand/.test(s)) return "high";
  return "medium";
}

function districtHash(district: string, slug: string): number {
  const key = `${district.toLowerCase()}|${slug}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return (h % 17) - 8;
}

export function getLocationCropScore(
  state: string,
  district: string,
  cropSlug: string
): { score: number; reason: string } {
  const region = resolveNorthIndiaRegion(state);
  const regional = REGION_CROP_SCORES[region]?.[cropSlug] ?? 40;
  const districtProfile = DISTRICT_CROP_PROFILES[district]?.[cropSlug];
  const variation = districtHash(district, cropSlug);
  const base = districtProfile ?? regional;
  const score = Math.min(100, Math.max(15, base + variation));

  let reason: string;
  if (districtProfile != null && districtProfile >= 85) {
    reason = `${district} — yahan ${cropSlug} ki mitti/mandi ke liye strong zone`;
  } else if (regional >= 85) {
    reason = `${state} ke ${region} belt mein yeh fasal proven`;
  } else if (regional >= 65) {
    reason = `${district}, ${state} — mausam/mitti ke hisaab se theek`;
  } else {
    reason = `${district} mein kam common — risk zyada`;
  }

  return { score, reason };
}

export function defaultSoilForState(state: string): string {
  const s = state.toLowerCase();
  for (const [key, soil] of Object.entries(STATE_SOIL_TYPE)) {
    if (s.includes(key)) return soil;
  }
  return "Loamy (Domat)";
}
