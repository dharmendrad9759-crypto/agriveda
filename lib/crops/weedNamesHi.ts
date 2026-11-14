/**
 * Weed display — field/market famous name on top (often English), Hindi below.
 */

const WEED_NAME_HI: Record<string, string> = {
  "barnyard grass": "सांवा",
  "echinochloa crus-galli": "सांवा",
  "echinochloa colona": "सांवा",
  "wild oat": "जंगली जई",
  "avena fatua": "जंगली जई",
  "avena ludoviciana": "जंगली जई",
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
  "monochoria (broadleaf)": "मोनोकोरिया",
  "monochoria vaginalis": "मोनोकोरिया",
  "anagallis arvensis": "कृष्णनील",
  "convolvulus arvensis": "हिरनखुरी",
  "rumex dentatus": "जंगली पालक",
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

/** Local Hindi on top. Second line is the scientific name only. */
export function weedDisplayName(
  name: string,
  scientificName: string | undefined,
  _locale: string
): { primary: string; secondary?: string } {
  const fromMap = getWeedNameHi(name, scientificName);
  const stripped = name.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
  const primary = fromMap || (/[अ-ह]/.test(stripped) ? stripped : stripped);
  const secondary =
    scientificName && scientificName.trim().toLowerCase() !== primary.trim().toLowerCase()
      ? scientificName
      : undefined;
  return { primary, secondary };
}
