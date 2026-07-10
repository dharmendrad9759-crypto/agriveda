export interface CropStage {
  title: string;
  period: string;
  keyPoints: string[];
}

export interface PestManagement {
  pestName: string;
  scientificName: string;
  identification: string;
  symptoms: string[];
  etl: string;
  biologicalControl: string[];
  chemicalControl: string[];
  iracGroup: string;
  activeIngredient: string;
  dose: string;
}

export interface DiseaseManagement {
  diseaseName: string;
  pathogen: string;
  type: string;
  symptoms: string[];
  favourableConditions: string[];
  integratedManagement: string[];
  biologicalControl: string[];
  chemicalControl: string[];
  fracGroup: string;
  activeIngredient: string;
  dose: string;
  waitingPeriod: string;
}

export interface WeedManagement {
  weedName: string;
  scientificName: string;
  type: string;
  criticalPeriod: string;
  preEmergenceHerbicide: string;
  postEmergenceHerbicide: string;
  hracGroup: string;
  dose: string;
}

export interface HerbicideStep {
  technical: string;
  dose: string;
  timing: string;
  targets?: string;
  note?: string;
}

export interface CropWeedProgram {
  keyWeeds: string[];
  criticalPeriod: string;
  prevention: string[];
  monitoring: string[];
  cultural: string[];
  chemical: HerbicideStep[];
}

export interface AbioticCorrection {
  input: string;
  dose: string;
  stage: string;
  note?: string;
}

export interface AbioticStressItem {
  stressName: string;
  symptoms: string;
  cause: string;
  prevention: string[];
  monitoring: string[];
  cultural: string[];
  corrections: AbioticCorrection[];
}

export interface NutrientDeficiency {
  name: string;
  role: string;
  deficiencySymptoms: string[];
  excessSymptoms: string[];
  management: string[];
  recommendedFertilizers: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CropManagementProfile {
  slug: string;
  name: string;
  scientificName: string;
  category: string;
  image: string;
  summary: string;
  overview: string;
  climate: string;
  soil: string;
  landPreparation: string[];
  seedSelection: string[];
  seedTreatment: string[];
  sowingTime: string[];
  seedRate: string;
  spacing: string;
  nursery: string[];
  transplanting: string[];
  irrigationSchedule: string[];
  fertilizerSchedule: string[];
  micronutrients: string[];
  growthStages: CropStage[];
  interculturalOperations: string[];
  weedManagement: WeedManagement[];
  /** Full ICAR weed program from JSON batch */
  weedProgram?: CropWeedProgram;
  pestManagement: PestManagement[];
  diseaseManagement: DiseaseManagement[];
  physiologicalDisorders: string[];
  /** Structured abiotic / physiological stress (waterlogging, heat, deficiencies mistaken for disease) */
  abioticStress?: AbioticStressItem[];
  nutrientDeficiencies: NutrientDeficiency[];
  harvesting: string[];
  yield: string;
  storage: string[];
  marketInformation: {
    majorMarkets: string[];
    demand: string;
    msp: string;
    priceTrend: string;
  };
  faqs: FAQItem[];
}
