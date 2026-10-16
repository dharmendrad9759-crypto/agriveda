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
    preEmergence: "Pretilachlor 50% EC @ 500 मिली/एकड़ (0–3 दिन में)",
    postEmergence: "Bispyribac-sodium 10% SC @ 80–100 मिली/एकड़ या Cyhalofop-butyl 10% EC @ 300–400 मिली/एकड़",
    culturalControl: "खेत पोखर, बासी बीज क्यारी, 48 घंटे 2–3 सेमी पानी बनाए रखें",
  },
  "echinochloa colona": {
    name: "सांवा / जंगली सांवा (Jungle rice)",
    scientificName: "Echinochloa colona",
    type: "Grassy",
    criticalPeriod: "0–35 DAS",
    preEmergence: "Atrazine 50% WP @ 500 ग्राम/एकड़ या Pendimethalin 30% EC @ 1 ली/एकड़",
    postEmergence: "Tembotrione 34.4% SC @ 115 मिली/एकड़ या Topramezone @ 30 मिली/एकड़",
    culturalControl: "मेड़-निराई, घनी फसल, पहली निराई 20 दिन पर",
  },
  "cyperus iria": {
    name: "चपटा नागरमोथा (Flat Sedge)",
    scientificName: "Cyperus iria",
    type: "Sedge",
    criticalPeriod: "15–60 DAS",
    preEmergence: "Pretilachlor 50% EC @ 500 मिली या Pyrazosulfuron 10% WP @ 80 ग्राम/एकड़",
    postEmergence: "Ethoxysulfuron 15% WDG @ 50 ग्राम/एकड़ या Almix @ 8 ग्राम/एकड़",
    culturalControl: "पानी की गहराई बनाए रखें (कम से कम 3–5 सेमी)",
  },
  "cyperus rotundus": {
    name: "मोथा / नागरमोथा (Nutgrass)",
    scientificName: "Cyperus rotundus",
    type: "Sedge",
    criticalPeriod: "10–45 DAS",
    preEmergence: "Pendimethalin 30% EC @ 1 ली/एकड़ या Pretilachlor + Safener @ 500 मिली/एकड़",
    postEmergence: "Halosulfuron methyl 75% WG (Sempra) @ 36 ग्राम/एकड़ या Ethoxysulfuron 15% WDG @ 50–60 ग्राम/एकड़ या Almix @ 8 ग्राम/एकड़",
    culturalControl: "गर्मी में गहरी जुताई, कंद व गांठें धूप में सूखने दें",
  },
  "cyperus esculentus": {
    name: "पीला मोथा (Yellow nutsedge)",
    scientificName: "Cyperus esculentus",
    type: "Sedge",
    criticalPeriod: "10–40 DAS",
    preEmergence: "Pendimethalin 30% EC @ 1 ली/एकड़",
    postEmergence: "Halosulfuron methyl 75% WG @ 36 ग्राम/एकड़",
    culturalControl: "कंद वाले हिस्से हटाएँ, फसल चक्र अपनाएं",
  },
  "monochoria vaginalis": {
    name: "मोनोकोरिया (Monochoria)",
    scientificName: "Monochoria vaginalis",
    type: "Broadleaf",
    criticalPeriod: "20–50 DAS",
    preEmergence: "Pretilachlor 50% EC @ 500 मिली/एकड़",
    postEmergence: "Metsulfuron + Chlorimuron 20% WP (Almix) @ 8 ग्राम/एकड़ या 2,4-D Na salt @ 500 ग्राम/एकड़",
    culturalControl: "20 और 40 DAS पर हाथ से निराई",
  },
  "phalaris minor": {
    name: "गुल्ली-डंडा / मंडूसी (Phalaris minor)",
    scientificName: "Phalaris minor",
    type: "Grassy",
    criticalPeriod: "20–60 DAS",
    preEmergence: "Pendimethalin 30% EC @ 1 ली/एकड़ या Pyroxasulfone 85% WG @ 60 ग्राम/एकड़",
    postEmergence: "Clodinafop-propargyl 15% WP @ 160 ग्राम/एकड़ या Pinoxaden 5.1% EC @ 400 मिली/एकड़",
    culturalControl: "साफ प्रमाणित बीज, गेहूं-सरसों या बरसीम फसल चक्र",
  },
  "avena fatua": {
    name: "जंगली जई (Wild Oat)",
    scientificName: "Avena fatua",
    type: "Grassy",
    criticalPeriod: "25–55 DAS",
    preEmergence: "Pendimethalin 30% EC @ 1 ली/एकड़",
    postEmergence: "Clodinafop-propargyl 15% WP @ 160 ग्राम/एकड़",
    culturalControl: "दलहनी फसल चक्र, बीज साफ करके बोएं",
  },
  "chenopodium album": {
    name: "बथुआ (Bathua)",
    scientificName: "Chenopodium album",
    type: "Broadleaf",
    criticalPeriod: "15–45 DAS",
    preEmergence: "Pendimethalin 30% EC @ 1 ली/एकड़",
    postEmergence: "Metsulfuron-methyl 20% WP @ 8 ग्राम/एकड़ या 2,4-D Amine Salt @ 400 मिली/एकड़",
    culturalControl: "हाथ निराई 25–30 DAS, सब्जी उपयोग",
  },
  "parthenium hysterophorus": {
    name: "गाजर घास (Parthenium)",
    scientificName: "Parthenium hysterophorus",
    type: "Broadleaf",
    criticalPeriod: "0–40 DAS",
    preEmergence: "Atrazine 50% WP @ 500 ग्राम/एकड़ या Pendimethalin @ 1 ली/एकड़",
    postEmergence: "2,4-D Amine Salt 58% SL @ 400–500 मिली/एकड़ (फूल से पहले)",
    culturalControl: "फूल आने से पहले जड़ से उखाड़ें, घनी फसल / मल्च",
  },
  "trianthema portulacastrum": {
    name: "इटसा घास / सांठी (Trianthema)",
    scientificName: "Trianthema portulacastrum",
    type: "Broadleaf",
    criticalPeriod: "10–30 DAS",
    preEmergence: "Pendimethalin 30% EC @ 1 ली/एकड़ या Atrazine @ 500 ग्राम/एकड़",
    postEmergence: "2,4-D Amine Salt @ 400 मिली/एकड़ या Tembotrione @ 115 मिली/एकड़",
    culturalControl: "मेड़ चढ़ाना, खुरपी से निराई",
  },
  "sorghum halepense": {
    name: "जंगली ज्वार / बरू (Johnson grass)",
    scientificName: "Sorghum halepense",
    type: "Grassy",
    criticalPeriod: "10–35 DAS",
    preEmergence: "Atrazine 50% WP @ 500 ग्राम/एकड़",
    postEmergence: "Fenoxaprop-p-ethyl 9.3% EC @ 350 मिली/एकड़ (दलहन/तिलहन में)",
    culturalControl: "गहरी जुताई कर जड़ के प्रकंद (rhizomes) बाहर निकालें",
  },
  "digitaria sanguinalis": {
    name: "काकरा घास (Digitaria)",
    scientificName: "Digitaria sanguinalis",
    type: "Grassy",
    criticalPeriod: "0–25 DAS",
    preEmergence: "Pendimethalin 30% EC @ 1 ली/एकड़",
    postEmergence: "Fenoxaprop-p-ethyl @ 350 मिली/एकड़ या Quizalofop @ 350–400 मिली/एकड़",
    culturalControl: "बासी क्यारी, समय पर निराई-गुड़ाई",
  },
  "digitaria spp.": {
    name: "काकरा घास (Digitaria)",
    scientificName: "Digitaria spp.",
    type: "Grassy",
    criticalPeriod: "0–25 DAS",
    preEmergence: "Pendimethalin 30% EC @ 1 ली/एकड़",
    postEmergence: "Fenoxaprop-p-ethyl @ 350 मिली/एकड़",
    culturalControl: "मेड़ साफ रखें",
  },
  "brassica campestris": {
    name: "जंगली सरसों (Wild Mustard)",
    scientificName: "Brassica campestris",
    type: "Broadleaf",
    criticalPeriod: "20–50 DAS",
    preEmergence: "Pendimethalin 30% EC @ 1 ली/एकड़",
    postEmergence: "2,4-D Amine Salt @ 400 मिली/एकड़ या Metsulfuron @ 8 ग्राम/एकड़",
    culturalControl: "पंक्तियों में मल्च, हाथ से उखाड़ना",
  },
  "cynodon dactylon": {
    name: "दूब / हरियाली (Bermuda grass)",
    scientificName: "Cynodon dactylon",
    type: "Grassy",
    criticalPeriod: "साल भर",
    preEmergence: "मेड़ पर directed glyphosate (फसल छुए नहीं)",
    postEmergence: "कुदाल से जड़ सहित हटाएँ",
    culturalControl: "मेड़ साफ रखें, गर्मी में गहरी जुताई",
  },
};

const SETS: Record<string, string[]> = {
  paddy: [
    "echinochloa crus-galli",
    "cyperus iria",
    "monochoria vaginalis",
    "cyperus rotundus",
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
