import type { WeedItem } from "@/data/pest-disease";
import { getWeedCardImage, normalizeScientificName } from "@/lib/weeds/weedStageImages";

/** Reusable weed defs with real stage photos (keyed by scientific name). */
const BANK: Record<
  string,
  Omit<WeedItem, "id" | "criticalPeriod" | "preEmergence" | "postEmergence" | "culturalControl"> & {
    criticalPeriod: string;
    preEmergence: string;
    postEmergence: string;
    culturalControl: string;
  }
> = {
  "echinochloa crus-galli": {
    name: "सांवा घास (Barnyard Grass)",
    scientificName: "Echinochloa crus-galli",
    type: "Grassy",
    criticalPeriod: "0–45 DAS",
    preEmergence: "Pretilachlor / Pendimethalin — लेबल अनुसार",
    postEmergence: "Bispyribac-sodium / Fenoxaprop — लेबल अनुसार",
    culturalControl: "खेत पोखर, बासी बीज क्यारी",
  },
  "echinochloa colona": {
    name: "सांवा घास (Jungle rice)",
    scientificName: "Echinochloa colona",
    type: "Grassy",
    criticalPeriod: "0–35 DAS",
    preEmergence: "Atrazine / Pendimethalin — लेबल अनुसार",
    postEmergence: "Tembotrione / 2,4-D — लेबल अनुसार",
    culturalControl: "मेड़-निराई, घनी फसल",
  },
  "cyperus iria": {
    name: "चपटा नागरमोथा (Flat Sedge)",
    scientificName: "Cyperus iria",
    type: "Sedge",
    criticalPeriod: "15–60 DAS",
    preEmergence: "Pretilachlor + Pyrazosulfuron — लेबल अनुसार",
    postEmergence: "Bispyribac-sodium — लेबल अनुसार",
    culturalControl: "पानी की गहराई बनाए रखें",
  },
  "cyperus rotundus": {
    name: "मोठा (Nutgrass)",
    scientificName: "Cyperus rotundus",
    type: "Sedge",
    criticalPeriod: "10–45 DAS",
    preEmergence: "Pendimethalin + Metribuzin — लेबल अनुसार",
    postEmergence: "Halosulfuron methyl — लेबल अनुसार",
    culturalControl: "गर्मी में गहरी जुताई",
  },
  "cyperus esculentus": {
    name: "मोठा (Yellow nutsedge)",
    scientificName: "Cyperus esculentus",
    type: "Sedge",
    criticalPeriod: "10–40 DAS",
    preEmergence: "Metribuzin + Pendimethalin — लेबल अनुसार",
    postEmergence: "Halosulfuron — लेबल अनुसार",
    culturalControl: "कंद वाले हिस्से हटाएँ",
  },
  "monochoria vaginalis": {
    name: "मोनोकोरिया (Monochoria)",
    scientificName: "Monochoria vaginalis",
    type: "Broadleaf",
    criticalPeriod: "20–50 DAS",
    preEmergence: "Pretilachlor — लेबल अनुसार",
    postEmergence: "2,4-D / MCPA — लेबल अनुसार",
    culturalControl: "हाथ से निराई",
  },
  "phalaris minor": {
    name: "गुल्ली-डंडा (Phalaris minor)",
    scientificName: "Phalaris minor",
    type: "Grassy",
    criticalPeriod: "20–60 DAS",
    preEmergence: "Pendimethalin — लेबल अनुसार",
    postEmergence: "Clodinafop / Pinoxaden — लेबल अनुसार",
    culturalControl: "साफ बीज, फसल चक्र",
  },
  "avena fatua": {
    name: "जंगली जई (Wild Oat)",
    scientificName: "Avena fatua",
    type: "Grassy",
    criticalPeriod: "25–55 DAS",
    preEmergence: "Pendimethalin — लेबल अनुसार",
    postEmergence: "Clodinafop — लेबल अनुसार",
    culturalControl: "दलहनी फसल चक्र",
  },
  "chenopodium album": {
    name: "बथुआ (Bathua)",
    scientificName: "Chenopodium album",
    type: "Broadleaf",
    criticalPeriod: "15–45 DAS",
    preEmergence: "Pendimethalin / Metribuzin — लेबल अनुसार",
    postEmergence: "Metsulfuron — लेबल अनुसार",
    culturalControl: "हाथ निराई 25–30 DAS",
  },
  "parthenium hysterophorus": {
    name: "गाजर घास (Parthenium)",
    scientificName: "Parthenium hysterophorus",
    type: "Broadleaf",
    criticalPeriod: "0–40 DAS",
    preEmergence: "Atrazine / Pendimethalin — लेबल अनुसार",
    postEmergence: "फूल से पहले उखाड़ें",
    culturalControl: "घनी फसल / मल्च",
  },
  "trianthema portulacastrum": {
    name: "इटसा घास (Trianthema)",
    scientificName: "Trianthema portulacastrum",
    type: "Broadleaf",
    criticalPeriod: "10–30 DAS",
    preEmergence: "Atrazine / Pendimethalin — लेबल अनुसार",
    postEmergence: "2,4-D — लेबल अनुसार",
    culturalControl: "मेड़ चढ़ाना",
  },
  "sorghum halepense": {
    name: "जंगली ज्वार (Johnson grass)",
    scientificName: "Sorghum halepense",
    type: "Grassy",
    criticalPeriod: "10–35 DAS",
    preEmergence: "Atrazine — लेबल अनुसार",
    postEmergence: "Fenoxaprop / हाथ निराई",
    culturalControl: "जड़ के टुकड़े हटाएँ",
  },
  "digitaria sanguinalis": {
    name: "काकरा घास (Digitaria)",
    scientificName: "Digitaria sanguinalis",
    type: "Grassy",
    criticalPeriod: "0–25 DAS",
    preEmergence: "Pendimethalin — लेबल अनुसार",
    postEmergence: "हाथ / कुदाल निराई",
    culturalControl: "बासी क्यारी",
  },
  "digitaria spp.": {
    name: "काकरा घास (Digitaria)",
    scientificName: "Digitaria spp.",
    type: "Grassy",
    criticalPeriod: "0–25 DAS",
    preEmergence: "Pendimethalin — लेबल अनुसार",
    postEmergence: "हाथ निराई",
    culturalControl: "मेड़ साफ रखें",
  },
  "brassica campestris": {
    name: "जंगली सरसों (Wild Mustard)",
    scientificName: "Brassica campestris",
    type: "Broadleaf",
    criticalPeriod: "20–50 DAS",
    preEmergence: "Metribuzin / Pendimethalin — लेबल अनुसार",
    postEmergence: "हाथ निराई",
    culturalControl: "पंक्तियों में मल्च",
  },
  "cynodon dactylon": {
    name: "दूब / हरियाली (Bermuda grass)",
    scientificName: "Cynodon dactylon",
    type: "Grassy",
    criticalPeriod: "साल भर",
    preEmergence: "मेड़ पर directed glyphosate (फसल छुए नहीं)",
    postEmergence: "कुदाल से जड़ सहित हटाएँ",
    culturalControl: "मेड़ साफ रखें",
  },
};

const SETS: Record<string, string[]> = {
  paddy: [
    "echinochloa crus-galli",
    "cyperus iria",
    "monochoria vaginalis",
    "cyperus rotundus",
    "echinochloa colona",
    "cynodon dactylon",
  ],
  wheat: [
    "phalaris minor",
    "avena fatua",
    "chenopodium album",
    "brassica campestris",
    "cynodon dactylon",
    "cyperus rotundus",
  ],
  maize: [
    "echinochloa colona",
    "trianthema portulacastrum",
    "cyperus rotundus",
    "digitaria sanguinalis",
    "parthenium hysterophorus",
    "sorghum halepense",
  ],
  bajra: [
    "sorghum halepense",
    "digitaria sanguinalis",
    "parthenium hysterophorus",
    "cyperus rotundus",
    "trianthema portulacastrum",
    "cynodon dactylon",
  ],
  potato: [
    "chenopodium album",
    "brassica campestris",
    "cyperus esculentus",
    "phalaris minor",
    "parthenium hysterophorus",
    "digitaria sanguinalis",
  ],
  tomato: [
    "parthenium hysterophorus",
    "cyperus rotundus",
    "digitaria spp.",
    "trianthema portulacastrum",
    "chenopodium album",
    "cynodon dactylon",
  ],
  onion: [
    "chenopodium album",
    "cyperus rotundus",
    "phalaris minor",
    "parthenium hysterophorus",
    "digitaria sanguinalis",
    "brassica campestris",
  ],
  chilli: [
    "parthenium hysterophorus",
    "trianthema portulacastrum",
    "digitaria sanguinalis",
    "cyperus rotundus",
    "chenopodium album",
    "cynodon dactylon",
  ],
  cotton: [
    "trianthema portulacastrum",
    "digitaria spp.",
    "cyperus rotundus",
    "parthenium hysterophorus",
    "echinochloa colona",
    "cynodon dactylon",
  ],
  sugarcane: [
    "cyperus rotundus",
    "cynodon dactylon",
    "parthenium hysterophorus",
    "sorghum halepense",
    "digitaria sanguinalis",
    "echinochloa colona",
  ],
  soybean: [
    "digitaria sanguinalis",
    "cyperus rotundus",
    "echinochloa colona",
    "parthenium hysterophorus",
    "trianthema portulacastrum",
    "cynodon dactylon",
  ],
  mustard: [
    "chenopodium album",
    "avena fatua",
    "phalaris minor",
    "brassica campestris",
    "cynodon dactylon",
    "cyperus rotundus",
  ],
  pulses: [
    "phalaris minor",
    "chenopodium album",
    "cyperus rotundus",
    "parthenium hysterophorus",
    "digitaria sanguinalis",
    "cynodon dactylon",
  ],
  mango: [
    "parthenium hysterophorus",
    "cynodon dactylon",
    "cyperus rotundus",
    "digitaria sanguinalis",
    "trianthema portulacastrum",
    "sorghum halepense",
  ],
  banana: [
    "cyperus rotundus",
    "parthenium hysterophorus",
    "digitaria spp.",
    "cynodon dactylon",
    "trianthema portulacastrum",
    "echinochloa colona",
  ],
  grapes: [
    "cynodon dactylon",
    "cyperus rotundus",
    "parthenium hysterophorus",
    "digitaria sanguinalis",
    "chenopodium album",
    "trianthema portulacastrum",
  ],
  // IPM extras commonly in list
  cauliflower: [
    "chenopodium album",
    "cyperus rotundus",
    "parthenium hysterophorus",
    "digitaria sanguinalis",
    "phalaris minor",
    "cynodon dactylon",
  ],
  cabbage: [
    "chenopodium album",
    "cyperus rotundus",
    "parthenium hysterophorus",
    "digitaria sanguinalis",
    "brassica campestris",
    "cynodon dactylon",
  ],
  cucumber: [
    "parthenium hysterophorus",
    "cyperus rotundus",
    "digitaria spp.",
    "trianthema portulacastrum",
    "chenopodium album",
    "cynodon dactylon",
  ],
  brinjal: [
    "parthenium hysterophorus",
    "cyperus rotundus",
    "digitaria sanguinalis",
    "trianthema portulacastrum",
    "chenopodium album",
    "cynodon dactylon",
  ],
  bhindi: [
    "parthenium hysterophorus",
    "cyperus rotundus",
    "digitaria sanguinalis",
    "trianthema portulacastrum",
    "chenopodium album",
    "cynodon dactylon",
  ],
  capsicum: [
    "parthenium hysterophorus",
    "cyperus rotundus",
    "digitaria sanguinalis",
    "chenopodium album",
    "trianthema portulacastrum",
    "cynodon dactylon",
  ],
  moong: [
    "phalaris minor",
    "chenopodium album",
    "cyperus rotundus",
    "digitaria sanguinalis",
    "parthenium hysterophorus",
    "cynodon dactylon",
  ],
  moongfali: [
    "digitaria sanguinalis",
    "cyperus rotundus",
    "echinochloa colona",
    "parthenium hysterophorus",
    "trianthema portulacastrum",
    "cynodon dactylon",
  ],
};

function looksLikeScientific(name: string): boolean {
  const s = name.trim();
  if (!s || /[अ-ह]/.test(s) || /और|,|;/.test(s)) return false;
  return /^[A-Za-z][A-Za-z.-]*\s+[a-z][A-Za-z.-]*\.?$/.test(s);
}

function bankItem(sciKey: string, id: string): WeedItem | null {
  const def = BANK[sciKey];
  if (!def) return null;
  return {
    id,
    ...def,
    image: getWeedCardImage(def.scientificName) ?? undefined,
  };
}

/** Merge preferred crop weed set with existing entries; drop broken sci names; attach real photos. */
export function expandAndPhotoWeeds(slug: string, existing: WeedItem[]): WeedItem[] {
  const map = new Map<string, WeedItem>();

  for (const w of existing) {
    if (!looksLikeScientific(w.scientificName)) continue;
    const key = normalizeScientificName(w.scientificName);
    if (!key || map.has(key)) continue;
    map.set(key, {
      ...w,
      image: getWeedCardImage(w.scientificName) || w.image,
    });
  }

  const extras = SETS[slug] ?? [
    "parthenium hysterophorus",
    "cyperus rotundus",
    "cynodon dactylon",
    "digitaria sanguinalis",
    "chenopodium album",
    "trianthema portulacastrum",
  ];

  let i = map.size;
  for (const sci of extras) {
    const key = normalizeScientificName(sci);
    if (map.has(key)) continue;
    const item = bankItem(sci, `w${i + 1}`);
    if (!item) continue;
    map.set(key, item);
    i += 1;
    if (map.size >= 6) break;
  }

  return [...map.values()].slice(0, 6).map((w, idx) => ({
    ...w,
    id: `w${idx + 1}`,
    image: getWeedCardImage(w.scientificName) || w.image || "/images/threats/threat-weed.jpg",
  }));
}

export function isValidWeedScientific(name: string): boolean {
  return looksLikeScientific(name);
}
