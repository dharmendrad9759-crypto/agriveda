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
  return (name || "").trim().toLowerCase().replace(/\s+/g, " ");
}

export function getWeedStageImages(
  scientificName: string | undefined | null
): WeedStageImages | null {
  const key = normalizeScientificName(scientificName);
  if (!key) return null;
  if (BY_SCI[key]) return BY_SCI[key];
  for (const [sci, imgs] of Object.entries(BY_SCI)) {
    if (key.startsWith(sci.split(" ")[0]!) && key.includes(sci.split(" ")[1] || "")) {
      return imgs;
    }
    if (key.includes(sci) || sci.includes(key.replace(/\.$/, ""))) return imgs;
  }
  return null;
}

export function getWeedCardImage(scientificName: string | undefined | null): string | null {
  return getWeedStageImages(scientificName)?.early ?? null;
}

export function listMappedWeedScientificNames(): string[] {
  return Object.keys(BY_SCI);
}
