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
  pestManagement: PestManagement[];
  diseaseManagement: DiseaseManagement[];
  physiologicalDisorders: string[];
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
