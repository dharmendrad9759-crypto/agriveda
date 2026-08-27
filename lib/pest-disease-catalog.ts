import type { CropPestDiseaseData, DiseaseItem, PestItem, WeedItem } from "@/data/pest-disease";
import { getCropPestDisease, pestDiseaseCropList } from "@/data/pest-disease";
import { THREAT_DETAIL_OVERRIDES, THREAT_IMAGES } from "@/data/pest-disease-details";
import { getWeedCardImage } from "@/lib/weeds/weedStageImages";
import { getDiseaseSpeciesImage, getPestSpeciesImage } from "@/lib/pests/threatSpeciesImages";
import { getCropManagementProfile } from "@/data/crop-management";
import { getCropHindiName } from "@/lib/crops/crop-display";

import { getIpmThreatOverride } from "@/lib/crops/ipmDataBridge";
import { getCropFieldGuideThreatOverride } from "@/lib/crops/cropFieldGuideBridge";
import { getWeedNameHi } from "@/lib/crops/weedNamesHi";
import { findStageGuideForThreat } from "@/lib/cropProtectionGuide";
import type { EnrichedThreat, ThreatCategory, ThreatType } from "@/types/pest-disease-ui";
import { managementThreatId, threatDetailPath } from "@/lib/pests/threatPaths";
import { normThreatText } from "@/lib/pests/matchCatalogThreat";

const GENERIC_STOCK = /placeholder|picsum|loremflickr/i;

/** Shared threat tabs / crop heroes — never beat a real species photo */
function isWeakThreatImage(path: string | undefined): boolean {
  if (!path) return true;
  if (GENERIC_STOCK.test(path)) return true;
  if (/^\/images\/[a-z0-9-]+\.png$/i.test(path)) return true;
  if (/\/images\/threats\/threat-(insect|disease|yellow|weed)\.jpg$/i.test(path)) return true;
  if (/\/images\/crops\//i.test(path)) return true;
  if (/\/images\/jobs\//i.test(path)) return true;
  return false;
}

function resolveThreatImage(
  overrideImage: string | undefined,
  itemImage: string | undefined,
  speciesImage?: string
): string | undefined {
  // Prefer species / disease pathogen art first
  if (speciesImage && !GENERIC_STOCK.test(speciesImage) && !isWeakThreatImage(speciesImage)) {
    return speciesImage;
  }
  if (overrideImage && !isWeakThreatImage(overrideImage)) return overrideImage;
  if (itemImage && !isWeakThreatImage(itemImage)) return itemImage;
  if (speciesImage && !GENERIC_STOCK.test(speciesImage)) return speciesImage;
  // Never keep crop-hero / generic stock as the "best" photo
  const candidates = [overrideImage, itemImage, speciesImage].filter(
    (p): p is string =>
      typeof p === "string" && !isWeakThreatImage(p) && !GENERIC_STOCK.test(p)
  );
  return candidates[0];
}

function inferDiseaseCategory(pathogen: string, name: string): ThreatCategory {
  const p = `${pathogen} ${name}`.toLowerCase();
  if (p.includes("virus") || p.includes("mosaic") || p.includes("begomo")) return "viral";
  if (
    p.includes("xanthomonas") ||
    p.includes("ralstonia") ||
    p.includes("bacterial") ||
    p.includes("erwinia")
  )
    return "bacterial";
  if (
    p.includes("phytophthora") ||
    p.includes("alternaria") ||
    p.includes("puccinia") ||
    p.includes("rhizoctonia") ||
    p.includes("magnaporthe") ||
    p.includes("colletotrichum") ||
    p.includes("fusarium") ||
    p.includes("mycosphaerella") ||
    p.includes("exserohilum") ||
    p.includes("phakopsora") ||
    p.includes("oidium") ||
    p.includes("plasmopara") ||
    p.includes("fungal") ||
    p.includes("blight") ||
    p.includes("rust") ||
    p.includes("mildew") ||
    p.includes("smut") ||
    p.includes("rot")
  )
    return "fungal";
  return "other";
}

function mergeStageGuide(
  threat: EnrichedThreat,
  threatType: ThreatType
): EnrichedThreat {
  const overrideKey = `${threat.cropSlug}-${threatType}-${threat.id}`;
  const override = {
    ...getIpmThreatOverride(overrideKey),
    ...getCropFieldGuideThreatOverride(overrideKey),
    ...THREAT_DETAIL_OVERRIDES[overrideKey],
  };

  if (override?.stageSprays?.length) {
    return {
      ...threat,
      stageSprays: override.stageSprays,
      rotationNotes: override.rotationNotes ?? threat.rotationNotes,
      stageExtraNotes: override.stageExtraNotes ?? threat.stageExtraNotes,
      continuousHarvest: override.continuousHarvest ?? threat.continuousHarvest,
    };
  }

  const guide = findStageGuideForThreat(
    threat.cropSlug,
    threatType,
    threat.name,
    threat.id
  );
  if (!guide?.stages.length) return threat;

  const early = guide.stages.find((s) => s.stage === "early") ?? guide.stages[0];

  return {
    ...threat,
    symptoms: guide.symptoms?.length ? guide.symptoms : threat.symptoms,
    stageSprays: guide.stages,
    rotationNotes: guide.rotationNotes,
    stageExtraNotes: guide.extraNotes,
    continuousHarvest: guide.continuousHarvest,
    activeIngredient: threat.activeIngredient ?? `${early.chemistry} — ${early.dose}`,
  };
}

function enrichPest(crop: CropPestDiseaseData, pest: PestItem): EnrichedThreat {
  const key = `${crop.slug}-pest-${pest.id}`;
  const ipmOverride = {
    ...getIpmThreatOverride(key),
    ...getCropFieldGuideThreatOverride(key),
  };
  const override = THREAT_DETAIL_OVERRIDES[key];
  const merged = { ...ipmOverride, ...override };
  const category: ThreatCategory = "insect";

  const base: EnrichedThreat = {
    id: pest.id,
    cropSlug: crop.slug,
    cropName: crop.name,
    type: "pest",
    category,
    name: pest.name,
    scientificName: pest.scientificName,
    image:
      resolveThreatImage(
        merged?.image,
        pest.image,
        getPestSpeciesImage(pest.scientificName)
      ) ?? THREAT_IMAGES.insect,
    stage: pest.stage,
    description:
      merged?.description ??
      `${pest.scientificName} ${crop.name} की एक प्रमुख कीट समस्या है। यह ${pest.stage} अवस्था में फसल को नुकसान पहुँचाता है। समेकित प्रबंधन में निगरानी, जैविक नियंत्रण और Economic Threshold Level (ETL) पर ही लक्षित रासायनिक उपचार शामिल है।`,
    symptoms: merged?.symptoms ?? [
      `${pest.stage} अवस्था में दिखने वाला चबाने/चूसने का नुकसान`,
      "पौधे की वृद्धि और उपज की क्षमता कम होना",
      "प्रभावित भागों पर honeydew या frass दिख सकता है",
    ],
    remediation: merged?.remediation ?? [
      pest.control ?? "अनुशंसित नियंत्रण के लिए package of practices का पालन करें",
      "संवेदनशील अवस्था में सप्ताह में दो बार खेत की जाँच करें",
      "प्राकृतिक शत्रुओं को बचाएँ — broad-spectrum कीटनाशकों से बचें",
      "प्रतिरोध रोकने के लिए कीटनाशक के MoA (IRAC groups) बदलते रहें",
    ],
    iracGroup: pest.iracGroup,
    activeIngredient: merged?.activeIngredient ?? pest.control,
    etl: merged?.etl,
  };

  return mergeStageGuide(base, "pest");
}

function enrichDisease(crop: CropPestDiseaseData, disease: DiseaseItem): EnrichedThreat {
  const key = `${crop.slug}-disease-${disease.id}`;
  const ipmOverride = {
    ...getIpmThreatOverride(key),
    ...getCropFieldGuideThreatOverride(key),
  };
  const override = THREAT_DETAIL_OVERRIDES[key];
  const merged = { ...ipmOverride, ...override };
  const category = merged?.category ?? inferDiseaseCategory(disease.pathogen, disease.name);

  const base: EnrichedThreat = {
    id: disease.id,
    cropSlug: crop.slug,
    cropName: crop.name,
    type: "disease",
    category,
    name: disease.name,
    scientificName: disease.pathogen,
    pathogen: disease.pathogen,
    image:
      resolveThreatImage(
        merged?.image,
        disease.image,
        getDiseaseSpeciesImage(disease.pathogen)
      ) ?? THREAT_IMAGES.fungalLeaf,
    stage: disease.stage,
    description:
      merged?.description ??
      `${disease.name} ${disease.pathogen} से होता है। यह ${crop.name} में ${disease.stage} अवस्था में प्रभावित करता है और अनुकूल मौसम में फैलता है। उपज क्षति रोकने के लिए शीघ्र पहचान और समेकित रोग प्रबंधन जरूरी है।`,
    symptoms: merged?.symptoms ?? [
      `${disease.stage} अवस्था में विशिष्ट दाग या लक्षण`,
      "आर्द्रता और तापमान अनुकूल होने पर धीरे-धीरे फैलाव",
      "रोग की गंभीरता और समय के अनुसार उपज में कमी",
    ],
    remediation: merged?.remediation ?? [
      disease.control ?? "स्थानीय सलाह के अनुसार अनुशंसित fungicide/bactericide लगाएँ",
      "संक्रमित पौधों के अवशेष हटाकर नष्ट करें",
      "जल निकासी सुधारें और पत्तियों पर गीला रहने का समय कम करें",
      "जहाँ उपलब्ध हो, प्रतिरोधी किस्में अपनाएँ",
      "रोग चक्र तोड़ने के लिए फसल चक्र अपनाएँ",
    ],
    fracGroup: disease.fracGroup,
    activeIngredient: merged?.activeIngredient ?? disease.control,
  };

  return mergeStageGuide(base, "disease");
}

function enrichWeed(crop: CropPestDiseaseData, weed: WeedItem): EnrichedThreat {
  const nameHi = weed.nameHi ?? getWeedNameHi(weed.name, weed.scientificName);
  const base: EnrichedThreat = {
    id: weed.id,
    cropSlug: crop.slug,
    cropName: crop.name,
    type: "weed",
    category: "weed",
    name: weed.name,
    nameHi,
    scientificName: weed.scientificName,
    image:
      getWeedCardImage(weed.scientificName) ||
      resolveThreatImage(undefined, weed.image) ||
      THREAT_IMAGES.weed,
    stage: weed.criticalPeriod,
    description: `${weed.scientificName} (${weed.type} खरपतवार) ${crop.name} के साथ पोषक तत्व, पानी और रोशनी के लिए प्रतिस्पर्धा करता है। महत्वपूर्ण प्रतिस्पर्धा अवधि ${weed.criticalPeriod} है। उपज बचाने के लिए समय पर खरपतवार नियंत्रण जरूरी है।`,
    symptoms: [
      `महत्वपूर्ण अवधि में प्रतिस्पर्धा: ${weed.criticalPeriod}`,
      "नियंत्रण न होने पर फसल की घनत्व और वृद्धि कम",
      "फसल के पौधों में पोषक और नमी की कमी",
    ],
    remediation: [
      `रासायनिक — Pre-emergence: ${weed.preEmergence}`,
      `रासायनिक — Post-emergence: ${weed.postEmergence}`,
      weed.culturalControl ? `सांस्कृतिक: ${weed.culturalControl}` : "",
    ].filter(Boolean),
  };

  return mergeStageGuide(base, "weed");
}

export function getEnrichedCropThreats(slug: string): EnrichedThreat[] {
  const crop = getCropPestDisease(slug);
  return [
    ...crop.pests.map((p) => enrichPest(crop, p)),
    ...crop.diseases.map((d) => enrichDisease(crop, d)),
    ...crop.weeds.map((w) => enrichWeed(crop, w)),
  ];
}

/** All weeds across catalog crops — for weeds hub overview */
export function getAllWeedsAcrossCrops(): EnrichedThreat[] {
  return pestDiseaseCropList.flatMap((c) => {
    const crop = getCropPestDisease(c.slug);
    return crop.weeds.map((w) => enrichWeed(crop, w));
  });
}

export function getThreatDetail(
  cropSlug: string,
  threatType: ThreatType,
  threatId: string
): EnrichedThreat | null {
  const crop = getCropPestDisease(cropSlug);
  if (threatType === "pest") {
    const pest = crop.pests.find((p) => p.id === threatId);
    if (pest) return enrichPest(crop, pest);
    return enrichPestFromManagement(cropSlug, threatId);
  }
  if (threatType === "disease") {
    const disease = crop.diseases.find((d) => d.id === threatId);
    if (disease) return enrichDisease(crop, disease);
    return enrichDiseaseFromManagement(cropSlug, threatId);
  }
  if (threatType === "weed") {
    const weed = crop.weeds.find((w) => w.id === threatId);
    return weed ? enrichWeed(crop, weed) : null;
  }
  return null;
}

function cropDisplayName(slug: string): string {
  return getCropHindiName(slug) || getCropPestDisease(slug).name;
}

function enrichPestFromManagement(
  cropSlug: string,
  threatId: string
): EnrichedThreat | null {
  const profile = getCropManagementProfile(cropSlug);
  const list = profile?.pestManagement ?? [];
  if (!list.length) return null;

  const decoded = decodeURIComponent(threatId);
  const idx = list.findIndex((p, i) => {
    const mid = managementThreatId("pest", p.pestName, p.scientificName, i);
    if (mid === decoded || mid === threatId) return true;
    // Legacy / loose ids: tomato-pest-5, mp-0, scientific fragment
    if (decoded === `${cropSlug}-pest-${i}` || decoded === `mp-${i}`) return true;
    const sci = normThreatText(p.scientificName.split(/[/,(]/)[0] ?? "");
    if (sci.length >= 6 && normThreatText(decoded).includes(sci)) return true;
    if (normThreatText(decoded).includes(normThreatText(p.pestName).slice(0, 12))) return true;
    return false;
  });
  if (idx < 0) return null;

  const p = list[idx];
  const id = managementThreatId("pest", p.pestName, p.scientificName, idx);
  return pestManagementToThreat(cropSlug, p, id);
}

function pestManagementToThreat(
  cropSlug: string,
  p: {
    pestName: string;
    scientificName: string;
    identification?: string;
    symptoms: string[];
    etl: string;
    biologicalControl: string[];
    chemicalControl: string[];
    iracGroup: string;
    activeIngredient: string;
    dose: string;
  },
  id: string
): EnrichedThreat {
  const cropName = cropDisplayName(cropSlug);
  const chem = p.chemicalControl?.[0] ?? p.dose ?? "लेबल अनुसार दवा";
  const base: EnrichedThreat = {
    id,
    cropSlug,
    cropName,
    type: "pest",
    category: "insect",
    name: p.pestName,
    scientificName: p.scientificName,
    image:
      getPestSpeciesImage(p.scientificName) || THREAT_IMAGES.insect,
    stage: "फसल अवधि",
    description:
      p.identification ||
      `${p.pestName} ${cropName} का मुख्य कीट है। खेत घूमकर देखें; कीड़े ज़्यादा हों तभी दवा डालें।`,
    symptoms: p.symptoms?.length
      ? p.symptoms
      : ["पत्तियों / फल पर नुकसान", "कीड़े या इल्ली दिखना"],
    remediation: [
      ...(p.biologicalControl ?? []).map((x) => `जैविक: ${x}`),
      ...(p.chemicalControl ?? []).map((x) => `दवा: ${x}`),
      p.etl ? `कब स्प्रे: ${p.etl}` : "",
    ].filter(Boolean),
    iracGroup: p.iracGroup,
    activeIngredient: p.activeIngredient || chem,
    etl: p.etl,
  };
  return mergeStageGuide(base, "pest");
}

function enrichDiseaseFromManagement(
  cropSlug: string,
  threatId: string
): EnrichedThreat | null {
  const profile = getCropManagementProfile(cropSlug);
  const list = profile?.diseaseManagement ?? [];
  if (!list.length) return null;

  const decoded = decodeURIComponent(threatId);
  const idx = list.findIndex((d, i) => {
    const mid = managementThreatId("disease", d.diseaseName, d.pathogen, i);
    if (mid === decoded || mid === threatId) return true;
    if (decoded === `${cropSlug}-dis-${i}` || decoded === `md-${i}`) return true;
    const path = normThreatText(d.pathogen.split(/[/,(]/)[0] ?? "");
    if (path.length >= 6 && normThreatText(decoded).includes(path)) return true;
    if (normThreatText(decoded).includes(normThreatText(d.diseaseName).slice(0, 12))) return true;
    return false;
  });
  if (idx < 0) return null;

  const d = list[idx];
  const id = managementThreatId("disease", d.diseaseName, d.pathogen, idx);
  const cropName = cropDisplayName(cropSlug);
  const base: EnrichedThreat = {
    id,
    cropSlug,
    cropName,
    type: "disease",
    category: inferDiseaseCategory(d.pathogen, d.diseaseName),
    name: d.diseaseName,
    scientificName: d.pathogen,
    pathogen: d.pathogen,
    image: getDiseaseSpeciesImage(d.pathogen) || THREAT_IMAGES.fungalLeaf,
    stage: "फसल अवधि",
    description: `${d.diseaseName} ${cropName} में लगता है। जल्दी पहचान कर इलाज करें।`,
    symptoms: d.symptoms?.length ? d.symptoms : ["पत्तियों / तने पर दाग या मुरझान"],
    remediation: [
      ...(d.integratedManagement ?? []).slice(0, 3).map((x) => `रोकथाम: ${x}`),
      ...(d.biologicalControl ?? []).map((x) => `जैविक: ${x}`),
      ...(d.chemicalControl ?? []).map((x) => `दवा: ${x}`),
    ].filter(Boolean),
    activeIngredient: d.chemicalControl?.[0],
  };
  return mergeStageGuide(base, "disease");
}

export { threatDetailPath } from "@/lib/pests/threatPaths";

export function filterThreats(
  threats: EnrichedThreat[],
  query: string,
  category: ThreatCategory | "all"
): EnrichedThreat[] {
  const q = query.trim().toLowerCase();
  return threats.filter((t) => {
    if (category === "fungal") {
      if (!["fungal", "bacterial", "viral", "other"].includes(t.category)) return false;
    } else if (category !== "all" && t.category !== category) {
      return false;
    }
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.scientificName.toLowerCase().includes(q) ||
      (t.pathogen?.toLowerCase().includes(q) ?? false) ||
      t.cropName.toLowerCase().includes(q) ||
      (t.nameHi?.toLowerCase().includes(q) ?? false)
    );
  });
}
