export interface Crop {
  slug: string;
  name: string;
  scientificName: string;
  category: "Cereals" | "Vegetables" | "Pulses" | "Millets" | "Cash-Crops";
  image: string;
  overview: string;
  durationDays: string;
  estimatedYield: string;
  seedRate: string;
  spacing: string;
  suitableSeason: string;
  suitableSoil: string;
  climate: string;
  sowingGuide: {
    bestSowingTime: string;
    seedRate: string;
    seedTreatment: string;
    spacing: string;
    sowingMethod: string;
  };
  fertilizerSchedule: {
    basalDose: string[];
    stageWise: { stage: string; details: string[] }[];
    micronutrients: string[];
    foliarSpray: string[];
  };
  irrigationManagement: {
    waterRequirement: string;
    criticalStages: string[];
    schedule: string[];
  };
  cropProtection: {
    majorPests: string[];
    majorDiseases: string[];
    weedManagement: string[];
    symptoms: string[];
    prevention: string[];
    control: string[];
  };
  nutrientDeficiencies: {
    nutrient: string;
    symptoms: string;
    cause: string;
    solution: string;
  }[];
  harvestAndYield: {
    harvestingTime: string;
    maturitySigns: string[];
    yield: string;
    storageTips: string[];
  };
  marketInformation: {
    majorMarkets: string[];
    demand: string;
    msp: string;
    priceTrend: string;
  };
}