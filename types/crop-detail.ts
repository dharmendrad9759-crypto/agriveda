import type { Crop } from "@/types/crop";
import type { CropStage } from "@/types/crop-management";

export type TimingRef = "DAS" | "DAT" | "Stage";

export interface TimedApplication {
  label: string;
  dose: string;
  timing: string;
  timingRef: TimingRef;
  notes?: string;
}

export interface TimedIrrigation {
  label: string;
  amount: string;
  timing: string;
  timingRef: TimingRef;
  notes?: string;
}

export interface IpmPractice {
  name: string;
  timing: string;
  dose: string;
  notes?: string;
}

export interface NutrientDeficiencyItem {
  nutrient: string;
  role: string;
  symptoms: string;
  cause: string;
  solution: string;
}

export interface EnrichedCropDetail {
  crop: Crop;
  establishment: "transplant" | "direct-sown";
  growthStages: CropStage[];
  fertilizers: TimedApplication[];
  irrigations: TimedIrrigation[];
  pests: { name: string; detail: string; timing?: string }[];
  diseases: { name: string; detail: string; timing?: string }[];
  weeds: { name: string; detail: string; timing?: string }[];
  ipm: IpmPractice[];
  nutrients: NutrientDeficiencyItem[];
}
