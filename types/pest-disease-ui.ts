import type { StageSprayRecommendation } from "@/types/crop-protection";

export type ThreatCategory = "fungal" | "bacterial" | "viral" | "insect" | "weed" | "other";

export type ThreatType = "pest" | "disease" | "weed";

export interface EnrichedThreat {
  id: string;
  cropSlug: string;
  cropName: string;
  type: ThreatType;
  category: ThreatCategory;
  name: string;
  scientificName: string;
  pathogen?: string;
  image: string;
  stage: string;
  description: string;
  symptoms: string[];
  remediation: string[];
  iracGroup?: string;
  fracGroup?: string;
  activeIngredient?: string;
  etl?: string;
  /** Stage-wise spray ladder from Agriveda crop protection guide */
  stageSprays?: StageSprayRecommendation[];
  rotationNotes?: string;
  stageExtraNotes?: string[];
  continuousHarvest?: boolean;
}

export const CATEGORY_LABELS: Record<ThreatCategory, string> = {
  fungal: "Fungal",
  bacterial: "Bacterial",
  viral: "Viral",
  insect: "Insect",
  weed: "Weed",
  other: "Other",
};

export const CATEGORY_COLORS: Record<ThreatCategory, string> = {
  fungal: "border-amber-500/30 bg-amber-500/10 text-amber-600",
  bacterial: "border-orange-500/30 bg-orange-500/10 text-orange-600",
  viral: "border-purple-500/30 bg-purple-500/10 text-purple-600",
  insect: "border-red-500/30 bg-red-500/10 text-red-600",
  weed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
  other: "border-gray-500/30 bg-gray-500/10 text-gray-600",
};
