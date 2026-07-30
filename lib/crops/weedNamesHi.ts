/**
 * Hindi-first weed display names.
 * Keys: lowercase English common name and/or scientific binomial.
 */
const WEED_NAME_HI: Record<string, string> = {
  // Common grassy
  "barnyard grass": "सावांक् / सांवा",
  "echinochloa crus-galli": "सावांक् / सांवा",
  "echinochloa colona": "सावांक् (जंगली)",
  "wild oat": "जंगली जई",
  "avena fatua": "जंगली जई",
  "phalaris minor": "गेंहूँ का मामा (फलारिस)",
  phalaris: "गेंहूँ का मामा (फलारिस)",
  "digitaria sanguinalis": "डिजिटेरिया / क्रैब घास",
  "digitaria spp.": "डिजिटेरिया घास",
  digitaria: "डिजिटेरिया घास",
  "wild sorghum": "जंगली ज्वार (जॉनसन)",
  "sorghum halepense": "जंगली ज्वार (जॉनसन)",
  // Sedges
  "flat sedge": "मोथा (चपटा)",
  "cyperus iria": "मोथा (आइरिया)",
  cyperus: "मोथा",
  "cyperus rotundus": "मोथा (नटग्रास)",
  "cyperus esculentus": "मोथा (पीला)",
  // Broadleaf
  "monochoria (broadleaf)": "कुंदरू / गैबरुआ",
  "monochoria vaginalis": "कुंदरू / गैबरुआ",
  chenopodium: "बथुआ",
  bathua: "बथुआ",
  "chenopodium album": "बथुआ",
  parthenium: "गाजर घास",
  "parthenium hysterophorus": "गाजर घास",
  trianthema: "सटा / स्लेट",
  "trianthema portulacastrum": "सटा / स्लेट",
  "wild mustard": "जंगली सरसों",
  "brassica campestris": "जंगली सरसों",
  // Bermuda / others often in programs
  "cynodon dactylon": "दूब घास",
  "bermuda grass": "दूब घास",
  doob: "दूब घास",
  "amaranthus viridis": "चौलाई",
  amaranthus: "चौलाई",
  "portulaca oleracea": "कुलफ़ा",
  "eleusine indica": "मकड़ा घास",
  "celosia argentea": "सिल्क गार्डन खरपतवार",
};

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Resolve Hindi weed name from English common and/or scientific name. */
export function getWeedNameHi(name: string, scientificName?: string): string | undefined {
  const keys = [name, scientificName].filter(Boolean).map((k) => norm(k!));
  for (const key of keys) {
    if (WEED_NAME_HI[key]) return WEED_NAME_HI[key];
  }
  // genus-only fallback
  if (scientificName) {
    const genus = norm(scientificName).split(" ")[0];
    if (genus && WEED_NAME_HI[genus]) return WEED_NAME_HI[genus];
  }
  return undefined;
}

/** Primary label for locale: Hindi-first when available. */
export function weedDisplayName(
  name: string,
  scientificName: string | undefined,
  locale: string
): { primary: string; secondary?: string } {
  const hi = getWeedNameHi(name, scientificName);
  if (locale === "hi" && hi) {
    return { primary: hi, secondary: scientificName || name };
  }
  return { primary: name, secondary: scientificName || undefined };
}
