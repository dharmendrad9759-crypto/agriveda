/** District / state aware bigha → acre conversion (India varies widely). */

export interface BighaInfo {
  acresPerBigha: number;
  label: string;
  note: string;
}

/** Normalise for lookup — lowercase, trim, collapse spaces */
function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Per-district overrides (UP and other known variants) */
const DISTRICT_BIGHA: Record<string, BighaInfo> = {
  hathras: {
    acresPerBigha: 0.619,
    label: "Hathras bigha",
    note: "≈2520 m² — Aligarh division",
  },
  etah: {
    acresPerBigha: 0.619,
    label: "Etah bigha",
    note: "≈2520 m² — UP pucca bigha",
  },
  moradabad: {
    acresPerBigha: 0.625,
    label: "Moradabad pucca bigha",
    note: "0.625 acre",
  },
  bareilly: {
    acresPerBigha: 0.625,
    label: "Bareilly pucca bigha",
    note: "0.625 acre",
  },
  lucknow: {
    acresPerBigha: 0.625,
    label: "Lucknow pucca bigha",
    note: "0.625 acre",
  },
  kanpur: {
    acresPerBigha: 0.625,
    label: "Kanpur pucca bigha",
    note: "0.625 acre",
  },
  varanasi: {
    acresPerBigha: 0.578,
    label: "Varanasi kachcha bigha",
    note: "≈0.578 acre — purvanchal",
  },
  noida: {
    acresPerBigha: 0.625,
    label: "Noida/Gautam Buddha Nagar bigha",
    note: "0.625 acre",
  },
  "gautam buddha nagar": {
    acresPerBigha: 0.625,
    label: "GB Nagar pucca bigha",
    note: "0.625 acre",
  },
  jhunjhunu: {
    acresPerBigha: 1.25,
    label: "Rajasthan bigha (Jhunjhunu)",
    note: "≈1.25 acre",
  },
  sikar: {
    acresPerBigha: 1.25,
    label: "Rajasthan bigha (Sikar)",
    note: "≈1.25 acre",
  },
  aligarh: {
    acresPerBigha: 0.619,
    label: "Aligarh bigha",
    note: "≈2520 m² — UP pucca bigha (Aligarh)",
  },
  bulandshahr: {
    acresPerBigha: 0.578,
    label: "Bulandshahr bigha",
    note: "≈2340 m² — thoda chhota kachcha bigha",
  },
  bulandshahar: {
    acresPerBigha: 0.578,
    label: "Bulandshahr bigha",
    note: "≈2340 m² — thoda chhota kachcha bigha",
  },
  mathura: {
    acresPerBigha: 0.5,
    label: "Mathura kachcha bigha",
    note: "≈2023 m² — Braj region ka chhota bigha",
  },
  agra: {
    acresPerBigha: 0.578,
    label: "Agra bigha",
    note: "≈2340 m² — kachcha bigha",
  },
  meerut: {
    acresPerBigha: 0.625,
    label: "Meerut pucca bigha",
    note: "3025 sq yd = 0.625 acre",
  },
  ghaziabad: {
    acresPerBigha: 0.625,
    label: "Ghaziabad pucca bigha",
    note: "3025 sq yd = 0.625 acre",
  },
  jaipur: {
    acresPerBigha: 1.25,
    label: "Rajasthan bigha (Jaipur)",
    note: "Rajasthan mein bigha bada — ≈1.25 acre",
  },
  jodhpur: {
    acresPerBigha: 1.6,
    label: "Rajasthan badi bigha (Jodhpur)",
    note: "≈1.6 acre — marusthal ka bada bigha",
  },
  bikaner: {
    acresPerBigha: 1.6,
    label: "Rajasthan badi bigha (Bikaner)",
    note: "≈1.6 acre",
  },
};

/** State-level default when district not listed */
const STATE_BIGHA: Record<string, BighaInfo> = {
  "uttar pradesh": {
    acresPerBigha: 0.625,
    label: "UP pucca bigha",
    note: "2529 m² = 0.625 acre — zila ke hisaab se thoda alag ho sakta hai",
  },
  rajasthan: {
    acresPerBigha: 1.25,
    label: "Rajasthan bigha",
    note: "Rajasthan mein 0.625 se 2.5 acre tak — jila chunne par exact milega",
  },
  bihar: {
    acresPerBigha: 0.625,
    label: "Bihar bigha",
    note: "≈0.625 acre",
  },
  punjab: {
    acresPerBigha: 0.5,
    label: "Punjab bigha",
    note: "≈0.5 acre — killa system alag hai",
  },
  haryana: {
    acresPerBigha: 0.5,
    label: "Haryana bigha",
    note: "≈0.5 acre",
  },
  "madhya pradesh": {
    acresPerBigha: 0.6,
    label: "MP bigha",
    note: "≈0.6 acre",
  },
  gujarat: {
    acresPerBigha: 0.4,
    label: "Gujarat bigha",
    note: "≈0.4 acre — vistar se alag ho sakta hai",
  },
  "west bengal": {
    acresPerBigha: 0.33,
    label: "Bengal bigha",
    note: "≈0.33 acre — chhota bigha",
  },
  maharashtra: {
    acresPerBigha: 0.625,
    label: "Maharashtra bigha",
    note: "≈0.625 acre",
  },
};

const DEFAULT_BIGHA: BighaInfo = {
  acresPerBigha: 0.625,
  label: "Standard bigha",
  note: "Default 0.625 acre — apna rajya/jila chunein exact size ke liye",
};

export const REGIONAL_BIGHA_OPTIONS = [
  { id: "up", state: "Uttar Pradesh", label: "उत्तर प्रदेश (पक्का बीघा - 0.625 एकड़ / 2529 m²)", acresPerBigha: 0.625, note: "2529 m² = 0.625 acre" },
  { id: "bihar", state: "Bihar", label: "बिहार (0.625 एकड़ / कठ्ठा-बीघा)", acresPerBigha: 0.625, note: "≈0.625 acre" },
  { id: "mp", state: "Madhya Pradesh", label: "मध्य प्रदेश (0.60 एकड़ / 2428 m²)", acresPerBigha: 0.6, note: "≈0.6 acre" },
  { id: "rajasthan_std", state: "Rajasthan", label: "राजस्थान मानक (1.25 एकड़ / 5058 m²)", acresPerBigha: 1.25, note: "≈1.25 acre" },
  { id: "rajasthan_bada", state: "Rajasthan (Marwar)", label: "राजस्थान बड़ा बीघा (1.60 एकड़ / 6475 m²)", acresPerBigha: 1.6, note: "≈1.6 acre" },
  { id: "punjab_haryana", state: "Punjab & Haryana", label: "पंजाब व हरियाणा (0.50 एकड़ / 4 कनाल)", acresPerBigha: 0.5, note: "≈0.5 acre" },
  { id: "gujarat", state: "Gujarat", label: "गुजरात विघा (0.40 एकड़ / 1618 m²)", acresPerBigha: 0.4, note: "≈0.4 acre" },
  { id: "wb", state: "West Bengal", label: "पश्चिम बंगाल (0.33 एकड़ / 1337 m²)", acresPerBigha: 0.33, note: "≈0.33 acre" },
  { id: "up_braj", state: "Braj (Mathura/Agra)", label: "ब्रज कच्चा बीघा (0.50 एकड़ / 2023 m²)", acresPerBigha: 0.5, note: "≈2023 m²" },
];

export function getBighaInfo(state?: string, district?: string): BighaInfo {
  if (district) {
    const dKey = norm(district);
    for (const [key, info] of Object.entries(DISTRICT_BIGHA)) {
      if (dKey.includes(key) || key.includes(dKey)) return info;
    }
  }

  if (state) {
    const sKey = norm(state);
    for (const [key, info] of Object.entries(STATE_BIGHA)) {
      if (sKey.includes(key) || key.includes(sKey)) return info;
    }
  }

  return DEFAULT_BIGHA;
}

export function bighaToAcres(
  bighaCount: number,
  state?: string,
  district?: string
): { acres: number; info: BighaInfo } {
  const info = getBighaInfo(state, district);
  const acres = Math.round(bighaCount * info.acresPerBigha * 100) / 100;
  return { acres, info };
}
