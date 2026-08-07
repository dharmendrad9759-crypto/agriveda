export interface CropStage {
  title: string;
  period: string;
  keyPoints: string[];
}

export interface CropSprayProduct {
  /** e.g. Thiamethoxam 12.6% + Lambda-Cyhalothrin 9.5% ZC */
  technical: string;
  /** Formulation strength if not already in technical, e.g. 18.5% SC */
  formulation?: string;
  /** Popular retail names farmers ask for */
  brands?: string[];
  /** Prefer acre wording farmers use, e.g. 80–100 मिलीलीटर प्रति एकड़ */
  doseAcre: string;
  /** Best crop/pest stage for this spray */
  bestStage?: string;
  /** When this option is preferred (early / severe / rotation) */
  bestUseCondition?: string;
  /** Short farmer points — why / caution / tank-mix */
  points?: string[];
  /** Confidence for label claims in-app */
  sourceConfidence?: "high" | "medium" | "label-check";
}

export interface PestManagement {
  pestName: string;
  scientificName: string;
  identification: string;
  symptoms: string[];
  etl: string;
  biologicalControl: string[];
  chemicalControl: string[];
  /** Prefer structured spray cards when present (UI on all crops) */
  sprayProducts?: CropSprayProduct[];
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
  sprayProducts?: CropSprayProduct[];
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
