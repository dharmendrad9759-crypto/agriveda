import type { CropPestDiseaseData, DiseaseItem, PestItem, WeedItem } from "@/data/pest-disease";
import { getCropPestDisease } from "@/data/pest-disease";
import { THREAT_DETAIL_OVERRIDES } from "@/data/pest-disease-details";
import type { EnrichedThreat, ThreatCategory, ThreatType } from "@/types/pest-disease-ui";

const GENERIC_STOCK = /unsplash\.com|placeholder|picsum|loremflickr/i;

function resolveThreatImage(
  overrideImage: string | undefined,
  itemImage: string | undefined
): string | undefined {
  const candidate = overrideImage ?? itemImage;
  if (candidate && !GENERIC_STOCK.test(candidate)) return candidate;
  return undefined;
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

function enrichPest(crop: CropPestDiseaseData, pest: PestItem): EnrichedThreat {
  const key = `${crop.slug}-pest-${pest.id}`;
  const override = THREAT_DETAIL_OVERRIDES[key];
  const category: ThreatCategory = "insect";

  return {
    id: pest.id,
    cropSlug: crop.slug,
    cropName: crop.name,
    type: "pest",
    category,
    name: pest.name,
    scientificName: pest.scientificName,
    image: resolveThreatImage(override?.image, pest.image) ?? "",
    stage: pest.stage,
    description:
      override?.description ??
      `${pest.scientificName} is a major insect pest of ${crop.name}. It damages the crop during ${pest.stage} stage and requires integrated management combining monitoring, biological control, and targeted chemical intervention only at Economic Threshold Level (ETL).`,
    symptoms: override?.symptoms ?? [
      `Visible feeding damage during ${pest.stage}`,
      "Reduced plant vigour and yield potential",
      "Honeydew or frass may be present on affected plant parts",
    ],
    remediation: override?.remediation ?? [
      pest.control ?? "Follow package of practices for recommended control",
      "Scout field twice weekly during vulnerable crop stage",
      "Conserve natural enemies — avoid broad-spectrum insecticides",
      "Rotate insecticide modes of action (IRAC groups) to prevent resistance",
    ],
    iracGroup: pest.iracGroup,
    activeIngredient: override?.activeIngredient ?? pest.control,
    etl: override?.etl,
  };
}

function enrichDisease(crop: CropPestDiseaseData, disease: DiseaseItem): EnrichedThreat {
  const key = `${crop.slug}-disease-${disease.id}`;
  const override = THREAT_DETAIL_OVERRIDES[key];
  const category = override?.category ?? inferDiseaseCategory(disease.pathogen, disease.name);

  return {
    id: disease.id,
    cropSlug: crop.slug,
    cropName: crop.name,
    type: "disease",
    category,
    name: disease.name,
    scientificName: disease.pathogen,
    pathogen: disease.pathogen,
    image: resolveThreatImage(override?.image, disease.image) ?? "",
    stage: disease.stage,
    description:
      override?.description ??
      `${disease.name} is caused by ${disease.pathogen}. It affects ${crop.name} during ${disease.stage} and spreads under favourable weather conditions. Early identification and integrated disease management are critical to prevent yield loss.`,
    symptoms: override?.symptoms ?? [
      `Characteristic lesions or symptoms during ${disease.stage}`,
      "Progressive spread if humidity and temperature are favourable",
      "Yield reduction proportional to disease severity and timing",
    ],
    remediation: override?.remediation ?? [
      disease.control ?? "Apply recommended fungicide/bactericide as per local advisory",
      "Remove and destroy infected plant debris",
      "Improve drainage and reduce leaf wetness duration",
      "Use resistant varieties where available",
      "Rotate crops to break disease cycle",
    ],
    fracGroup: disease.fracGroup,
    activeIngredient: override?.activeIngredient ?? disease.control,
  };
}

function enrichWeed(crop: CropPestDiseaseData, weed: WeedItem): EnrichedThreat {
  return {
    id: weed.id,
    cropSlug: crop.slug,
    cropName: crop.name,
    type: "weed",
    category: "weed",
    name: weed.name,
    scientificName: weed.scientificName,
    image: resolveThreatImage(undefined, weed.image) ?? "",
    stage: weed.criticalPeriod,
    description: `${weed.scientificName} (${weed.type} weed) competes with ${crop.name} for nutrients, water, and light. Critical competition period is ${weed.criticalPeriod}. Timely weed management is essential for protecting yield.`,
    symptoms: [
      `Competition during critical period: ${weed.criticalPeriod}`,
      "Reduced crop stand and vigour if uncontrolled",
      "Nutrient and moisture stress in crop plants",
    ],
    remediation: [
      `Pre-emergence: ${weed.preEmergence}`,
      `Post-emergence: ${weed.postEmergence}`,
      `Cultural control: ${weed.culturalControl}`,
      "Maintain weed-free field for first 45 days after sowing/transplanting",
    ],
  };
}

export function getEnrichedCropThreats(slug: string): EnrichedThreat[] {
  const crop = getCropPestDisease(slug);
  return [
    ...crop.pests.map((p) => enrichPest(crop, p)),
    ...crop.diseases.map((d) => enrichDisease(crop, d)),
    ...crop.weeds.map((w) => enrichWeed(crop, w)),
  ];
}

export function getThreatDetail(
  cropSlug: string,
  threatType: ThreatType,
  threatId: string
): EnrichedThreat | null {
  const crop = getCropPestDisease(cropSlug);
  if (threatType === "pest") {
    const pest = crop.pests.find((p) => p.id === threatId);
    return pest ? enrichPest(crop, pest) : null;
  }
  if (threatType === "disease") {
    const disease = crop.diseases.find((d) => d.id === threatId);
    return disease ? enrichDisease(crop, disease) : null;
  }
  if (threatType === "weed") {
    const weed = crop.weeds.find((w) => w.id === threatId);
    return weed ? enrichWeed(crop, weed) : null;
  }
  return null;
}

export function threatDetailPath(cropSlug: string, type: ThreatType, id: string): string {
  return `/pest-diseases/${cropSlug}/${type}/${id}`;
}

export function filterThreats(
  threats: EnrichedThreat[],
  query: string,
  category: ThreatCategory | "all"
): EnrichedThreat[] {
  const q = query.trim().toLowerCase();
  return threats.filter((t) => {
    if (category !== "all" && t.category !== category) return false;
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.scientificName.toLowerCase().includes(q) ||
      (t.pathogen?.toLowerCase().includes(q) ?? false) ||
      t.cropName.toLowerCase().includes(q)
    );
  });
}
