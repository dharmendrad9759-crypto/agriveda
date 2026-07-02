export interface NutrientDeficiencyType {
  nutrient: string;
  role: string;
  deficiencySymptoms: string[];
  excessSymptoms?: string[];
  cause: string[];
  management: string[];
  recommendedFertilizers: string[];
}
