/**
 * Weed display — field/market famous name on top (often English), Hindi below.
 */

import { farmerThreatDisplayName } from "@/lib/crops/farmerThreatTitle";

const WEED_NAME_HI: Record<string, string> = {
  "barnyard grass": "सांवा",
  "echinochloa crus-galli": "सांवा",
  "echinochloa colona": "सांवा",
  "wild oat": "जंगली जई",
  "avena fatua": "जंगली जई",
  "phalaris minor": "गुल्ली डंडा",
  phalaris: "गुल्ली डंडा",
  "digitaria sanguinalis": "काकरा घास",
  "digitaria spp.": "काकरा घास",
  digitaria: "काकरा घास",
  "wild sorghum": "जंगली ज्वार",
  "sorghum halepense": "जंगली ज्वार",
  "flat sedge": "नागरमोथा",
  "cyperus iria": "नागरमोथा",
  cyperus: "मोठा",
  "cyperus rotundus": "मोठा",
  "cyperus esculentus": "मोठा",
  "monochoria (broadleaf)": "कुंदरू",
  "monochoria vaginalis": "कुंदरू",
  chenopodium: "बथुआ",
  bathua: "बथुआ",
  "chenopodium album": "बथुआ",
  parthenium: "गाजर घास",
  "parthenium hysterophorus": "गाजर घास",
  trianthema: "इटसा",
  "trianthema portulacastrum": "इटसा",
  "wild mustard": "जंगली सरसों",
  "brassica campestris": "जंगली सरसों",
  "cynodon dactylon": "दूब घास",
  "bermuda grass": "दूब घास",
  doob: "दूब घास",
  "amaranthus viridis": "चौलाई",
  amaranthus: "चौलाई",
  "portulaca oleracea": "कुलफ़ा",
  "eleusine indica": "मकड़ा घास",
};

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getWeedNameHi(name: string, scientificName?: string): string | undefined {
  const keys = [name, scientificName].filter(Boolean).map((k) => norm(k!));
  for (const key of keys) {
    if (WEED_NAME_HI[key]) return WEED_NAME_HI[key];
  }
  if (scientificName) {
    const genus = norm(scientificName).split(" ")[0];
    if (genus && WEED_NAME_HI[genus]) return WEED_NAME_HI[genus];
  }
  return undefined;
}

/** Famous field name first; Hindi as secondary when available. */
export function weedDisplayName(
  name: string,
  scientificName: string | undefined,
  _locale: string
): { primary: string; secondary?: string } {
  const soft = farmerThreatDisplayName(name, scientificName);
  if (soft.primary && soft.primary !== name.trim()) {
    return { primary: soft.primary, secondary: soft.english };
  }
  // Prefer English common name on top when name is "हिंदी (English)"
  const m = name.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (m?.[1] && m[2] && /^[A-Za-z]/.test(m[2].trim())) {
    const hi = getWeedNameHi(m[2], scientificName) || m[1].trim();
    return { primary: m[2].trim(), secondary: hi };
  }
  const hi = getWeedNameHi(name, scientificName);
  if (/^[A-Za-z]/.test(name.trim())) {
    return { primary: name.trim(), secondary: hi || scientificName };
  }
  return {
    primary: hi || name,
    secondary: scientificName || undefined,
  };
}
