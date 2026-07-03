export type ProductCategory = "insecticide" | "fungicide" | "herbicide";
export type MoAType = "IRAC" | "FRAC" | "HRAC";
export type ResistanceRisk = "low" | "medium" | "high";
export type SprayLocale = "en" | "hi" | "gu" | "kn";

export interface SprayProduct {
  id: string;
  productName: string;
  activeIngredient: string;
  category: ProductCategory;
  moaType: MoAType;
  /** Unified MoA code e.g. IRAC 28, FRAC 3, HRAC C1 */
  moaGroup: string;
  cropRecommended: string[];
  targetPests?: string[];
  targetDiseases?: string[];
  doseHint?: string;
}

export interface FarmerField {
  id: string;
  name: string;
  cropSlug: string;
  areaAcres?: string;
}

export interface SprayLog {
  id: string;
  farmerId: string;
  cropId: string;
  fieldId: string;
  productId: string;
  sprayDate: string;
  doseUsed: string;
  growthStageAtSpray: string;
  pestId?: string;
  diseaseId?: string;
  synced: boolean;
  createdAt: string;
}

export interface SprayWithProduct extends SprayLog {
  product: SprayProduct;
}

export interface ResistanceCheckResult {
  risk: ResistanceRisk;
  title: string;
  message: string;
  repeatedGroups: string[];
  consecutiveWarning: boolean;
  lastThreeGroups: string[];
}

export interface MoASuggestion {
  product: SprayProduct;
  reason: string;
}
