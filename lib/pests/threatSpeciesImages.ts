/**
 * Species-level pest/disease photos for look-and-tap farmer UX.
 * Resolves by normalized scientific name → `public/images/pests|diseases/…`.
 * Prefer explicit aliases for messy pathogen strings; else slug convention.
 */

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(s: string): string {
  return norm(s)
    .replace(/pv\./g, "pv")
    .replace(/f\.?\s*sp\.?/g, "f-sp")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

/** Messy catalog pathogen / sci strings → stable file slug (without prefix). */
const PEST_ALIASES: Record<string, string> = {
  "agrotis spp.": "agrotis-spp",
  "agrotis spp": "agrotis-spp",
  "odontotermes spp.": "odontotermes-spp",
  "odontotermes spp": "odontotermes-spp",
  "henosepilachna vigintioctopunctata": "henosepilachna",
  "henosepilachna spp.": "henosepilachna",
  "earias vittella / earias insulana": "earias-vittella",
  "earias vittella": "earias-vittella",
  "spodoptera litura / spodoptera littoralis": "spodoptera-litura",
  "spodoptera litura": "spodoptera-litura",
  "amrasca biguttula biguttula": "amrasca-biguttula",
  "obereopsis brevis": "oberea-brevis",
  "altica spp.": "altica-spp",
  "altica spp": "altica-spp",
  "leptocorisa oratorius": "leptocorisa-oratorius",
  "leptocorisa acuta": "leptocorisa-oratorius",
  "leptocorisa spp.": "leptocorisa-oratorius",
  "leptocorisa spp": "leptocorisa-oratorius",
  "leptocorisa species": "leptocorisa-oratorius",
  leptocorisa: "leptocorisa-oratorius",
  "sitobion avenae": "sitobion-avenae",
  "rhopalosiphum maidis": "rhopalosiphum-maidis",
  "aphis gossypii": "aphis-gossypii",
  "scirtothrips dorsalis / thrips parvispinus": "scirtothrips-dorsalis",
  "scirtothrips dorsalis thrips parvispinus": "scirtothrips-dorsalis",
  "nephotettix spp.": "nephotettix-virescens",
  "nephotettix spp": "nephotettix-virescens",
  "liriomyza spp.": "liriomyza-trifolii",
  "liriomyza spp": "liriomyza-trifolii",
  "holotrichia spp.": "holotrichia-spp",
  "holotrichia spp": "holotrichia-spp",
  "myllocerus spp.": "myllocerus-spp",
  "myllocerus spp": "myllocerus-spp",
  "chilo infuscatellus": "chilo-infuscatellus",
  "chilo sacchariphagus indicus": "chilo-sacchariphagus-indicus",
  "ceratovacuna lanigera": "ceratovacuna-lanigera",
  "sogatella furcifera": "sogatella-furcifera",
  "orseolia oryzae": "orseolia-oryzae",
  "dicladispa armigera": "dicladispa-armigera",
  "phenacoccus solenopsis": "phenacoccus-solenopsis",
  "spodoptera exigua": "spodoptera-exigua",
  "aceria": "aceria",
  "aceria tulipae": "aceria",
  "melanagromyza sojae": "melanagromyza-sojae",
  "aphis glycines": "aphis-glycines",
  "melanagromyza obtusa": "melanagromyza-obtusa",
  "exelastis atomosa": "exelastis-atomosa",
  "clavigralla": "clavigralla",
  "thrips palmi": "thrips-palmi",
};

const DISEASE_ALIASES: Record<string, string> = {
  "xanthomonas oryzae pv. oryzae": "xanthomonas-oryzae",
  "xanthomonas oryzae pv oryzae": "xanthomonas-oryzae",
  "xanthomonas citri pv. malvacearum": "xanthomonas-citri-malvacearum",
  "xanthomonas citri pv malvacearum": "xanthomonas-citri-malvacearum",
  "xanthomonas citri pv. mangiferaeindicae": "xanthomonas-mangiferaeindicae",
  "xanthomonas citri pv mangiferaeindicae": "xanthomonas-mangiferaeindicae",
  "xanthomonas campestris pv. campestris": "xanthomonas-campestris",
  "begomovirus whitefly vector": "begomovirus-leaf-curl",
  begomovirus: "begomovirus-leaf-curl",
  "pythium / fusarium / rhizoctonia": "damping-off",
  "pythium fusarium rhizoctonia": "damping-off",
  "pythium spp.": "damping-off",
  "pythium spp": "damping-off",
  "pythium aphanidermatum": "damping-off",
  "bipolaris oryzae / cochliobolus miyabeanus": "bipolaris-oryzae",
  "bipolaris oryzae cochliobolus miyabeanus": "bipolaris-oryzae",
  "tilletia indica / neovossia indica": "tilletia-indica",
  "tilletia indica neovossia indica": "tilletia-indica",
  "bipolaris sorokiniana / cochliobolus sativus": "bipolaris-sorokiniana",
  "bipolaris sorokiniana cochliobolus sativus": "bipolaris-sorokiniana",
  "bipolaris maydis / cochliobolus heterostrophus": "bipolaris-maydis",
  "bipolaris maydis cochliobolus heterostrophus": "bipolaris-maydis",
  "rhizoctonia solani f.sp. sasakii": "rhizoctonia-solani",
  "rhizoctonia solani f sp sasakii": "rhizoctonia-solani",
  "fusarium oxysporum f.sp. cepae": "fusarium-oxysporum",
  "fusarium oxysporum f.sp cepae": "fusarium-oxysporum",
  "fusarium oxysporum f sp cepae": "fusarium-oxysporum",
  "fusarium oxysporum f.sp. ciceris": "fusarium-oxysporum",
  "ralstonia solanacearum race 1": "ralstonia-solanacearum",
  "pectobacterium carotovorum": "pectobacterium",
  "pectobacterium": "pectobacterium",
  "erwinia carotovora": "erwinia",
  "erwinia": "erwinia",
  "colletotrichum coccodes": "colletotrichum-coccodes",
  "phytophthora capsici": "phytophthora-capsici",
  "fusarium udum": "fusarium-udum",
  "pigeonpea sterility mosaic virus": "pigeonpea-sterility-mosaic-virus",
  "pigeonpea sterility mosaic virus (eriophyid mite-vectored)": "pigeonpea-sterility-mosaic-virus",
  "phytophthora drechsleri f.sp. cajani": "phytophthora-drechsleri",
  "colletotrichum orbiculare": "colletotrichum-orbiculare",
  "pseudomonas syringae pv. lachrymans": "pseudomonas-syringae-pv-lachrymans",
  "cucumber mosaic virus": "cucumber-mosaic-virus",
  "peronosclerospora sorghi": "peronosclerospora-sorghi",
  "puccinia substriata": "puccinia-substriata",
  "moesziomyces penicillariae": "moesziomyces-penicillariae",
  "fusarium moniliforme / f. verticillioides": "fusarium-moniliforme",
  "fusarium moniliforme f verticillioides": "fusarium-moniliforme",
  "puccinia kuehnii": "puccinia-kuehnii",
  "xanthomonas axonopodis pv. glycines": "xanthomonas-axonopodis-pv-glycines",
  "fusarium oxysporum f.sp. cubense": "fusarium-cubense",
  "fusarium oxysporum f.sp cubense": "fusarium-cubense",
  "fusarium oxysporum f sp cubense": "fusarium-cubense",
  "fusarium oxysporum f.sp. lycopersici": "fusarium-lycopersici",
  "fusarium oxysporum f.sp lycopersici": "fusarium-lycopersici",
  "fusarium oxysporum f.sp. vasinfectum": "fusarium-vasinfectum",
  "fusarium oxysporum f.sp vasinfectum": "fusarium-vasinfectum",
  "banana bunchy top virus": "banana-bunchy-top-virus",
  "phytoplasma leafhopper vector": "phytoplasma-grassy-shoot",
  "mungbean yellow mosaic virus": "mungbean-yellow-mosaic-virus",
  "bhendi yellow vein mosaic virus": "bhendi-yvmv",
  "yellow vein mosaic virus": "bhendi-yvmv",
  "groundnut bud necrosis virus": "groundnut-bud-necrosis",
  "groundnut bud necrosis virus thrips-vectored": "groundnut-bud-necrosis",
  "rice tungro virus": "rice-tungro-virus",
  "rice tungro virus leafhopper vector": "rice-tungro-virus",
  "potato virus y": "potato-virus-y",
  "potato virus y aphid vector": "potato-virus-y",
  "cercospora arachidicola / phaeoisariopsis personata": "cercospora-arachidicola",
  "cercospora arachidicola": "cercospora-arachidicola",
  "podosphaera xanthii / erysiphe cichoracearum": "podosphaera-xanthii",
  "podosphaera xanthii": "podosphaera-xanthii",
  "sclerotium rolfsii / aspergillus niger": "sclerotium-rolfsii",
  "sclerotium rolfsii": "sclerotium-rolfsii",
  "colletotrichum gloeosporioides mango": "mango-anthracnose",
  "pyricularia oryzae magnaporthe": "magnaporthe-oryzae",
  "pyricularia oryzae": "magnaporthe-oryzae",
  "phakosora pachyrhizi": "phakopsora-pachyrhizi",
  "puccinia triticina": "puccinia-triticina",
  "fusarium fujikuroi": "fusarium-fujikuroi",
  "fusarium mangiferae": "fusarium-mangiferae",
  "septoria lycopersici": "septoria-lycopersici",
  "streptomyces scabies": "streptomyces-scabies",
  "cercospora sojina": "cercospora-sojina",
  "fusarium graminearum": "fusarium-graminearum",
};

function pestPath(slug: string): string {
  return `/images/pests/pest-${slug}.jpg`;
}

function diseasePath(slug: string): string {
  return `/images/diseases/disease-${slug}.jpg`;
}

function firstSpeciesChunk(raw: string): string {
  return raw.split("/")[0]?.trim() || raw;
}

export function getPestSpeciesImage(scientificName?: string | null): string | undefined {
  if (!scientificName) return undefined;
  const key = norm(scientificName);
  const alias = PEST_ALIASES[key] ?? PEST_ALIASES[scientificName.toLowerCase().trim()];
  if (alias) return pestPath(alias);
  if (key.includes("scirtothrips")) return pestPath("scirtothrips-dorsalis");
  if (key.includes("maruca")) return pestPath("maruca-vitrata");
  if (key.includes("conogethes")) return pestPath("conogethes-punctiferalis");
  if (key.includes("mimegralla")) return pestPath("delia-antiqua");
  if (key.includes("meloidogyne")) return pestPath("meloidogyne-incognita");
  if (key.includes("aspidiella")) return pestPath("thrips-tabaci");
  if (key.includes("megalurothrips")) return pestPath("thrips-palmi");

  // Combo strings: "Earias vittella / Earias insulana"
  if (scientificName.includes("/")) {
    const first = firstSpeciesChunk(scientificName);
    const firstKey = norm(first);
    const firstAlias = PEST_ALIASES[firstKey];
    if (firstAlias) return pestPath(firstAlias);
    const firstSlug = slugify(first);
    if (firstSlug) return pestPath(firstSlug);
  }

  const slug = slugify(scientificName);
  if (!slug) return undefined;
  return pestPath(slug);
}

export function getDiseaseSpeciesImage(pathogen?: string | null): string | undefined {
  if (!pathogen) return undefined;
  const key = norm(pathogen);

  if (DISEASE_ALIASES[key]) return diseasePath(DISEASE_ALIASES[key]);
  if (key.includes("begomovirus")) return diseasePath("begomovirus-leaf-curl");
  if (key.includes("xanthomonas oryzae")) return diseasePath("xanthomonas-oryzae");
  if (key.includes("xanthomonas citri") && key.includes("malvacearum")) {
    return diseasePath("xanthomonas-citri-malvacearum");
  }
  if (key.includes("mangiferaeindicae")) return diseasePath("xanthomonas-mangiferaeindicae");
  if (key.includes("xanthomonas campestris")) return diseasePath("xanthomonas-campestris");
  if (key.includes("pythium") && key.includes("fusarium")) return diseasePath("damping-off");
  if (key.includes("f.sp. cubense") || key.includes("f sp cubense") || key.includes("f-sp-cubense")) {
    return diseasePath("fusarium-cubense");
  }
  if (key.includes("lycopersici")) return diseasePath("fusarium-lycopersici");
  if (key.includes("vasinfectum")) return diseasePath("fusarium-vasinfectum");
  if (key.includes("bunchy top")) return diseasePath("banana-bunchy-top-virus");
  if (key.includes("tungro")) return diseasePath("rice-tungro-virus");
  if (key.includes("yellow vein mosaic") || key.includes("yvmv")) {
    return diseasePath("bhendi-yvmv");
  }
  if (key.includes("mungbean yellow") || key.includes("mymv")) {
    return diseasePath("mungbean-yellow-mosaic-virus");
  }
  if (key.includes("grassy shoot") || (key.includes("phytoplasma") && key.includes("leafhopper"))) {
    return diseasePath("phytoplasma-grassy-shoot");
  }
  if (key.includes("potato virus y") || key.includes("potato virus y")) {
    return diseasePath("potato-virus-y");
  }
  if (key.includes("bud necrosis")) return diseasePath("groundnut-bud-necrosis");
  if (key.includes("cercospora arachidicola")) return diseasePath("cercospora-arachidicola");
  if (key.includes("podosphaera")) return diseasePath("podosphaera-xanthii");
  if (key.includes("sclerotium rolfsii") || key.includes("agroathelcium")) {
    return diseasePath("sclerotium-rolfsii");
  }
  if (key.includes("phakosora") || key.includes("phakopsora")) {
    return diseasePath("phakopsora-pachyrhizi");
  }
  if (key.includes("pyricularia") || key.includes("magnaporthe")) {
    return diseasePath("magnaporthe-oryzae");
  }
  if (key.includes("rhizoctonia solani")) return diseasePath("rhizoctonia-solani");
  if (key.includes("fusarium oxysporum")) return diseasePath("fusarium-oxysporum");
  if (key.includes("fusarium moniliforme") || key.includes("verticillioides") || key.includes("pokkah boeng")) {
    return diseasePath("fusarium-moniliforme");
  }
  if (key.includes("sterility mosaic")) return diseasePath("pigeonpea-sterility-mosaic-virus");
  if (key.includes("ascochyta")) return diseasePath("ascochyta-rabiei");
  if (key.includes("uromyces")) return diseasePath("uromyces-viciae-fabae");
  if (key.includes("sclerotium cepivorum") || key.includes("stromatinia")) {
    return diseasePath("sclerotium-cepivorum");
  }
  if (key.includes("erysiphe polygoni")) return diseasePath("erysiphe-polygoni");
  if (key.includes("colletotrichum lindemuthianum")) return diseasePath("colletotrichum-capsici");
  if (key.includes("phyllosticta")) return diseasePath("cercospora-canescens");

  if (pathogen.includes("/")) {
    const first = firstSpeciesChunk(pathogen);
    const firstKey = norm(first);
    if (DISEASE_ALIASES[firstKey]) return diseasePath(DISEASE_ALIASES[firstKey]);
    const firstSlug = slugify(first);
    if (firstSlug) return diseasePath(firstSlug);
  }

  const slug = slugify(pathogen);
  if (!slug) return undefined;
  return diseasePath(slug);
}
