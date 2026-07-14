import type { Crop } from "@/types/crop";
import type { CropManagementProfile } from "@/types/crop-management";
import type { CropDashboardData, AgronomicSection } from "@/data/crop-dashboard";
import { resolveCropImage } from "@/lib/crops/cropImages";

/** Tom / ClickUp export shape (batch JSON) */
export interface AgrivedaCropExport {
  managementProfile: {
    basicInfo: {
      name: string;
      hindiName?: string;
      scientificName: string;
      category: string;
      summary: string;
      overview: string;
      climate: string;
      soil: string;
    };
    landAndSowing: {
      landPreparation: string[];
      seedSelection: string[];
      seedTreatment: string[];
      sowingTime: string[];
      seedRate: string[];
      spacing: string[];
      nursery: string[];
      transplanting: string[];
    };
    growthStages: { title: string; period: string; keyPoints: string[] }[];
    irrigation: string[];
    fertilizer: string[];
    micronutrients: string[];
    weeds: {
      name: string;
      type: string;
      criticalPeriod: string;
      herbicide: string;
      hrac: string;
      dose: string;
    }[];
    pests: {
      name: string;
      identification: string;
      symptoms: string | string[];
      etl: string;
      bioControl: string;
      chemicalControl: string;
      irac: string;
      activeIngredient: string;
      dose: string;
    }[];
    diseases: {
      name: string;
      pathogen: string;
      type: string;
      symptoms: string | string[];
      conditions: string;
      ipm: string;
      frac: string;
      activeIngredient: string;
      dose: string;
      phi: string;
    }[];
    nutrientDeficiencies: { nutrient: string; symptoms: string; fix: string }[];
    harvestAndYield: {
      whenToHarvest: string;
      maturitySigns: string | string[];
      yieldRange: string;
      storage: string;
    };
    market: {
      majorMandis: string;
      demand: string;
      msp: string;
      priceTrend: string;
    };
    faqs: { q: string; a: string }[];
  };
  cropListing: {
    duration: string;
    yield: string;
    season: string;
    soil: string;
    climate: string;
    sowingGuide: {
      sowingTime: string;
      seedRate: string;
      spacing: string;
      method: string;
      seedTreatment: string;
    };
    fertilizer: {
      basal: string;
      stageWise: { stage: string; dose: string }[];
    };
    irrigationSummary: string;
    cropProtection: {
      pests: string[];
      diseases: string[];
      weeds: string[];
      symptoms: string;
      prevention: string;
      control: string;
    };
    nutrientDeficiency: {
      nutrient: string;
      symptoms: string;
      cause: string;
      solution: string;
    }[];
    harvestSummary: string;
    marketSummary: string;
  };
  dashboard: {
    emoji: string;
    currentStageName: string;
    growthStages: {
      id: string;
      name: string;
      das: string;
      status: "completed" | "current" | "upcoming";
      emoji: string;
    }[];
    topPests: string[];
    expertAdvice: string[];
    sections: {
      sowing: SectionBlock;
      fertilizer: SectionBlock;
      irrigation: SectionBlock;
      nutrients: SectionBlock;
      harvest: SectionBlock;
      market: SectionBlock;
    };
  };
  _meta: { slug: string };
}

interface SectionBlock {
  summary: string;
  fields: Record<string, string>;
  tips: string[];
}

export interface AgrivedaBatchExport {
  exportVersion: string;
  sourceDocuments: string[];
  crops: AgrivedaCropExport[];
}

function asArray(value: string | string[]): string[] {
  return Array.isArray(value) ? value : [value];
}

function joinLines(lines: string[]): string {
  return lines.filter(Boolean).join(" ");
}

function mapCategory(raw: string): Crop["category"] {
  const n = raw.toLowerCase();
  if (n.includes("cereal")) return "Cereals";
  if (n.includes("vegetable")) return "Vegetables";
  if (n.includes("pulse")) return "Pulses";
  if (n.includes("millet")) return "Millets";
  if (n.includes("oil")) return "Pulses";
  if (n.includes("cash")) return "Cash-Crops";
  return "Pulses";
}

function sectionFromBlock(id: string, title: string, emoji: string, block: SectionBlock): AgronomicSection {
  return {
    id,
    title,
    emoji,
    summary: block.summary,
    fields: Object.entries(block.fields).map(([label, value]) => ({
      label: label.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value,
    })),
    tips: block.tips,
  };
}

export function mapToManagementProfile(exportCrop: AgrivedaCropExport): CropManagementProfile {
  const m = exportCrop.managementProfile;
  const slug = exportCrop._meta.slug;
  const b = m.basicInfo;
  const l = m.landAndSowing;

  return {
    slug,
    name: b.hindiName ? `${b.name} (${b.hindiName})` : b.name,
    scientificName: b.scientificName,
    category: mapCategory(b.category),
    image: resolveCropImage({ slug }),
    summary: b.summary,
    overview: b.overview,
    climate: b.climate,
    soil: b.soil,
    landPreparation: l.landPreparation,
    seedSelection: l.seedSelection,
    seedTreatment: l.seedTreatment,
    sowingTime: l.sowingTime,
    seedRate: joinLines(l.seedRate),
    spacing: joinLines(l.spacing),
    nursery: l.nursery,
    transplanting: l.transplanting,
    irrigationSchedule: m.irrigation,
    fertilizerSchedule: m.fertilizer,
    micronutrients: m.micronutrients,
    growthStages: m.growthStages,
    interculturalOperations: [],
    weedManagement: m.weeds.map((w) => ({
      weedName: w.name,
      scientificName: w.name,
      type: w.type,
      criticalPeriod: w.criticalPeriod,
      preEmergenceHerbicide: w.herbicide,
      postEmergenceHerbicide: w.herbicide,
      hracGroup: w.hrac,
      dose: w.dose,
    })),
    pestManagement: m.pests.map((p) => ({
      pestName: p.name,
      scientificName: p.name,
      identification: p.identification,
      symptoms: asArray(p.symptoms),
      etl: p.etl,
      biologicalControl: [p.bioControl],
      chemicalControl: [p.chemicalControl],
      iracGroup: p.irac,
      activeIngredient: p.activeIngredient,
      dose: p.dose,
    })),
    diseaseManagement: m.diseases.map((d) => ({
      diseaseName: d.name,
      pathogen: d.pathogen,
      type: d.type,
      symptoms: asArray(d.symptoms),
      favourableConditions: [d.conditions],
      integratedManagement: [d.ipm],
      biologicalControl: [],
      chemicalControl: [d.activeIngredient],
      fracGroup: d.frac,
      activeIngredient: d.activeIngredient,
      dose: d.dose,
      waitingPeriod: d.phi,
    })),
    physiologicalDisorders: [],
    nutrientDeficiencies: m.nutrientDeficiencies.map((n) => ({
      name: n.nutrient,
      role: n.nutrient,
      deficiencySymptoms: [n.symptoms],
      excessSymptoms: [],
      management: [n.fix],
      recommendedFertilizers: [n.fix],
    })),
    harvesting: [m.harvestAndYield.whenToHarvest, ...asArray(m.harvestAndYield.maturitySigns)],
    yield: m.harvestAndYield.yieldRange,
    storage: [m.harvestAndYield.storage],
    marketInformation: {
      majorMarkets: m.market.majorMandis.split(/,\s*/),
      demand: m.market.demand,
      msp: m.market.msp,
      priceTrend: m.market.priceTrend,
    },
    faqs: m.faqs.map((f) => ({ question: f.q, answer: f.a })),
  };
}

export function mapToCropListing(exportCrop: AgrivedaCropExport): Partial<Crop> {
  const slug = exportCrop._meta.slug;
  const m = exportCrop.managementProfile;
  const c = exportCrop.cropListing;

  return {
    slug,
    name: m.basicInfo.name,
    scientificName: m.basicInfo.scientificName,
    category: mapCategory(m.basicInfo.category),
    image: resolveCropImage({ slug }),
    overview: m.basicInfo.overview,
    durationDays: c.duration,
    estimatedYield: c.yield,
    seedRate: c.sowingGuide.seedRate,
    spacing: c.sowingGuide.spacing,
    suitableSeason: c.season,
    suitableSoil: c.soil,
    climate: c.climate,
    sowingGuide: {
      bestSowingTime: c.sowingGuide.sowingTime,
      seedRate: c.sowingGuide.seedRate,
      seedTreatment: c.sowingGuide.seedTreatment,
      spacing: c.sowingGuide.spacing,
      sowingMethod: c.sowingGuide.method,
    },
    fertilizerSchedule: {
      basalDose: [c.fertilizer.basal],
      stageWise: c.fertilizer.stageWise.map((s) => ({ stage: s.stage, details: [s.dose] })),
      micronutrients: m.micronutrients,
      foliarSpray: [],
    },
    irrigationManagement: {
      waterRequirement: c.irrigationSummary,
      criticalStages: m.growthStages.map((g) => g.title),
      schedule: m.irrigation,
    },
    cropProtection: {
      majorPests: c.cropProtection.pests,
      majorDiseases: c.cropProtection.diseases,
      weedManagement: c.cropProtection.weeds,
      symptoms: [c.cropProtection.symptoms],
      prevention: [c.cropProtection.prevention],
      control: [c.cropProtection.control],
    },
    nutrientDeficiencies: c.nutrientDeficiency.map((n) => ({
      nutrient: n.nutrient,
      symptoms: n.symptoms,
      cause: n.cause,
      solution: n.solution,
    })),
    harvestAndYield: {
      harvestingTime: m.harvestAndYield.whenToHarvest,
      maturitySigns: asArray(m.harvestAndYield.maturitySigns),
      yield: c.yield,
      storageTips: [m.harvestAndYield.storage],
    },
    marketInformation: {
      majorMarkets: m.market.majorMandis.split(/,\s*/),
      demand: m.market.demand,
      msp: m.market.msp,
      priceTrend: m.market.priceTrend,
    },
  };
}

export function mapToDashboard(exportCrop: AgrivedaCropExport): CropDashboardData {
  const slug = exportCrop._meta.slug;
  const m = exportCrop.managementProfile;
  const d = exportCrop.dashboard;
  const s = d.sections;

  return {
    slug,
    name: m.basicInfo.name,
    emoji: d.emoji,
    currentStage: d.currentStageName,
    growthStages: d.growthStages,
    pestsAndDiseases: d.topPests.map((name, i) => ({
      id: `${slug}-pd-${i + 1}`,
      name,
      image: "",
      stage: d.currentStageName,
    })),
    expertAdvice: d.expertAdvice.map((text, i) => ({
      id: `${slug}-ea-${i + 1}`,
      farmerName: "Agriveda",
      crop: m.basicInfo.name,
      location: "Central India",
      date: "Recent",
      query: text,
      expertName: "Crop Expert",
      expertDate: "Recent",
      answerPreview: text,
    })),
    sowingGuide: sectionFromBlock("sowing", "Sowing Guide", "🌱", s.sowing),
    fertilizerSchedule: sectionFromBlock("fertilizer", "Fertilizer Schedule", "🧪", s.fertilizer),
    irrigationManagement: sectionFromBlock("irrigation", "Irrigation", "💧", s.irrigation),
    nutrientDeficiency: sectionFromBlock("nutrients", "Nutrient Deficiency", "🍃", s.nutrients),
    harvestingYield: sectionFromBlock("harvest", "Harvest & Yield", "✅", s.harvest),
    marketInformation: sectionFromBlock("market", "Market Info", "📈", s.market),
  };
}
