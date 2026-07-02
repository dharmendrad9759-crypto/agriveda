export interface Fertilizer {
  name: string;
  npk?: string;
  type: "basal" | "top-dress" | "foliar" | "micronutrient";
  dose: string;
  stage: string;
  applicationMethod: string;
  notes?: string;
}
