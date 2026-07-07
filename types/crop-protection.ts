export type ProtectionStage = "preventive" | "early" | "advanced";

export interface StageSprayRecommendation {
  stage: ProtectionStage;
  label: string;
  chemistry: string;
  dose: string;
  notes?: string;
}

export interface CropProtectionThreat {
  id: string;
  name: string;
  scientificName?: string;
  type: "disease" | "pest" | "weed";
  symptoms?: string[];
  stages: StageSprayRecommendation[];
  rotationNotes?: string;
  extraNotes?: string[];
  fracGroup?: string;
  iracGroup?: string;
  /** Continuous harvest crop — prefer low PHI near picking */
  continuousHarvest?: boolean;
}

export interface CropProtectionProfile {
  slug: string;
  name: string;
  nameHi: string;
  scientificName: string;
  emoji: string;
  groupId: string;
  groupLabel: string;
  diseases: CropProtectionThreat[];
  pests: CropProtectionThreat[];
  weeds: CropProtectionThreat[];
}

export interface CropProtectionGroup {
  id: string;
  label: string;
  labelHi: string;
  cropSlugs: string[];
}
