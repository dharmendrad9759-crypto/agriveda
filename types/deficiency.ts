export type NutrientMobility = "Mobile" | "Immobile" | "Partially mobile";
export type SeverityLevel = "Critical" | "High" | "Moderate" | "Low";

export interface NutrientCorrection {
  title: string;
  details: string[];
}

export interface CropSpecificDeficiencyData {
  cropName: string;
  symptoms: string[];
  stage: string;
  cause: string;
  correction: string;
  prevention: string;
  notes: string;
}

export interface NutrientDeficiencyData {
  slug: string;
  name: string;
  symbol: string;
  role: string;
  mobility: NutrientMobility;
  summary: string;
  quickFacts: string[];
  icon: string;
  severity: SeverityLevel;
  generalSymptoms: string[];
  visualSymptoms: string[];
  whyItHappens: string[];
  fieldConditions: string[];
  confirmation: string[];
  corrections: NutrientCorrection[];
  foliar: string;
  soilApplication: string;
  fertigation: string;
  recoveryTimeline: string;
  prevention: string[];
  cropExamples: string[];
  cropSpecificData: CropSpecificDeficiencyData[];
}
