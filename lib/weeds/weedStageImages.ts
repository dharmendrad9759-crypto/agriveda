/**
 * Stage photos for weed identification (AI-generated lookalikes for farmer UX).
 * Keyed by normalized scientific name — not a botanical lab guarantee.
 */
export type WeedStageImages = {
  slug: string;
  early: string;
  late: string;
  nameHi: string;
};

const BY_SCI: Record<string, WeedStageImages> = {
  "chenopodium album": {
    slug: "bathua",
    early: "/images/weeds/weed-bathua-early.jpg",
    late: "/images/weeds/weed-bathua-late.jpg",
    nameHi: "बथुआ",
  },
  "parthenium hysterophorus": {
    slug: "parthenium",
    early: "/images/weeds/weed-parthenium-early.jpg",
    late: "/images/weeds/weed-parthenium-late.jpg",
    nameHi: "गाजर घास",
  },
  "phalaris minor": {
    slug: "phalaris",
    early: "/images/weeds/weed-phalaris-early.jpg",
    late: "/images/weeds/weed-phalaris-late.jpg",
    nameHi: "गुल्ली-डंडा",
  },
  "cyperus rotundus": {
    slug: "motha",
    early: "/images/weeds/weed-motha-early.jpg",
    late: "/images/weeds/weed-motha-late.jpg",
    nameHi: "मोठा",
  },
  "echinochloa crus-galli": {
    slug: "sanwa",
    early: "/images/weeds/weed-sanwa-early.jpg",
    late: "/images/weeds/weed-sanwa-late.jpg",
    nameHi: "सांवा घास",
  },
  "cyperus iria": {
    slug: "cyperus-iria",
    early: "/images/weeds/weed-cyperus-iria-early.jpg",
    late: "/images/weeds/weed-cyperus-iria-late.jpg",
    nameHi: "चपटा नागरमोथा",
  },
  "monochoria vaginalis": {
    slug: "monochoria",
    early: "/images/weeds/weed-monochoria-early.jpg",
    late: "/images/weeds/weed-monochoria-late.jpg",
    nameHi: "मोनोकोरिया",
  },
  "avena fatua": {
    slug: "wild-oat",
    early: "/images/weeds/weed-wild-oat-early.jpg",
    late: "/images/weeds/weed-wild-oat-late.jpg",
    nameHi: "जंगली जई",
  },
  "echinochloa colona": {
    slug: "echinochloa-colona",
    early: "/images/weeds/weed-echinochloa-colona-early.jpg",
    late: "/images/weeds/weed-echinochloa-colona-late.jpg",
    nameHi: "सांवा घास",
  },
  "trianthema portulacastrum": {
    slug: "trianthema",
    early: "/images/weeds/weed-trianthema-early.jpg",
    late: "/images/weeds/weed-trianthema-late.jpg",
    nameHi: "इटसा घास",
  },
  "sorghum halepense": {
    slug: "johnson",
    early: "/images/weeds/weed-johnson-early.jpg",
    late: "/images/weeds/weed-johnson-late.jpg",
    nameHi: "जंगली ज्वार",
  },
  "digitaria sanguinalis": {
    slug: "digitaria",
    early: "/images/weeds/weed-digitaria-early.jpg",
    late: "/images/weeds/weed-digitaria-late.jpg",
    nameHi: "काकरा घास",
  },
  "digitaria spp.": {
    slug: "digitaria",
    early: "/images/weeds/weed-digitaria-early.jpg",
    late: "/images/weeds/weed-digitaria-late.jpg",
    nameHi: "काकरा घास",
  },
  "brassica campestris": {
    slug: "wild-mustard",
    early: "/images/weeds/weed-wild-mustard-early.jpg",
    late: "/images/weeds/weed-wild-mustard-late.jpg",
    nameHi: "जंगली सरसों",
  },
  "cyperus esculentus": {
    slug: "cyperus-esculentus",
    early: "/images/weeds/weed-cyperus-esculentus-early.jpg",
    late: "/images/weeds/weed-cyperus-esculentus-late.jpg",
    nameHi: "मोठा",
  },
  "cynodon dactylon": {
    slug: "cynodon",
    early: "/images/weeds/weed-cynodon-early.jpg",
    late: "/images/weeds/weed-cynodon-late.jpg",
    nameHi: "दूब / हरियाली",
  },
};

export function normalizeScientificName(name: string | undefined | null): string {
  return (name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\.$/, "");
}

/** Genus → best available stage-photo species when source uses spp. / loose names */
const GENUS_FALLBACK: Record<string, string> = {
  echinochloa: "echinochloa colona",
  cyperus: "cyperus rotundus",
  chenopodium: "chenopodium album",
  phalaris: "phalaris minor",
  avena: "avena fatua",
  trianthema: "trianthema portulacastrum",
  digitaria: "digitaria sanguinalis",
  cynodon: "cynodon dactylon",
  parthenium: "parthenium hysterophorus",
  sorghum: "sorghum halepense",
  monochoria: "monochoria vaginalis",
  brassica: "brassica campestris",
};

/** Hindi / local aliases → scientific keys with photos */
const LOCAL_HI_FALLBACK: Record<string, string> = {
  सांवा: "echinochloa colona",
  सावां: "echinochloa colona",
  "सांवा घास": "echinochloa colona",
  गुल्ली: "phalaris minor",
  "गुल्ली डंडा": "phalaris minor",
  "गुल्ली-डंडा": "phalaris minor",
  बथुआ: "chenopodium album",
  मोथा: "cyperus rotundus",
  नागरमोथा: "cyperus rotundus",
  दूब: "cynodon dactylon",
  "गाजर घास": "parthenium hysterophorus",
  कांग्रेस: "parthenium hysterophorus",
  सांठी: "trianthema portulacastrum",
  पत्थरचट्टा: "trianthema portulacastrum",
  इटसा: "trianthema portulacastrum",
  चौलाई: "chenopodium album",
  "जंगली चौलाई": "chenopodium album",
  मकोई: "parthenium hysterophorus",
  "जंगली जई": "avena fatua",
  काकरा: "digitaria sanguinalis",
  मकड़ा: "digitaria sanguinalis",
  "मकड़ा घास": "digitaria sanguinalis",
};

export function resolveWeedPhotoScientific(
  scientificName?: string | null,
  localHi?: string | null
): string | null {
  const key = normalizeScientificName(scientificName);
  if (key && BY_SCI[key]) return key;

  if (key) {
    const genus = key.split(/\s+/)[0] ?? "";
    if (genus && GENUS_FALLBACK[genus]) return GENUS_FALLBACK[genus]!;
    for (const [sci] of Object.entries(BY_SCI)) {
      if (key.includes(sci) || sci.includes(key.replace(/\s*spp\.?/g, "").trim())) {
        return sci;
      }
    }
  }

  const local = (localHi || "").trim();
  if (local) {
    if (LOCAL_HI_FALLBACK[local]) return LOCAL_HI_FALLBACK[local]!;
    for (const [alias, sci] of Object.entries(LOCAL_HI_FALLBACK)) {
      if (local.includes(alias)) return sci;
    }
  }
  return null;
}

export function getWeedStageImages(
  scientificName: string | undefined | null,
  localHi?: string | null
): WeedStageImages | null {
  const resolved = resolveWeedPhotoScientific(scientificName, localHi);
  if (resolved && BY_SCI[resolved]) return BY_SCI[resolved]!;

  const key = normalizeScientificName(scientificName);
  if (!key) return null;
  if (BY_SCI[key]) return BY_SCI[key]!;
  for (const [sci, imgs] of Object.entries(BY_SCI)) {
    const [g, sp] = sci.split(" ");
    if (g && key.startsWith(g) && sp && key.includes(sp)) return imgs;
    if (key.includes(sci) || sci.includes(key.replace(/\.$/, ""))) return imgs;
  }
  return null;
}

export function getWeedCardImage(
  scientificName: string | undefined | null,
  localHi?: string | null
): string | null {
  return getWeedStageImages(scientificName, localHi)?.early ?? null;
}

export function listMappedWeedScientificNames(): string[] {
  return Object.keys(BY_SCI);
}
