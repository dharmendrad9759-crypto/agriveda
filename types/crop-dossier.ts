import type {
  CropManagementProfile,
  CropStage,
  CropWeedProgram,
  DiseaseManagement,
  FAQItem,
  PestManagement,
  WeedManagement,
} from "@/types/crop-management";

/** Research-grade overlay that enriches/replaces sections of CropManagementProfile */
export type ResearchDossierOverlay = {
  slug: string;
  sourceLabel: string;
  legalNote: string;
  growthStages?: CropStage[];
  irrigationSchedule?: string[];
  fertilizerSchedule?: string[];
  micronutrients?: string[];
  pestManagement?: PestManagement[];
  diseaseManagement?: DiseaseManagement[];
  weedManagement?: WeedManagement[];
  weedProgram?: CropWeedProgram;
  physiologicalDisorders?: string[];
  faqs?: FAQItem[];
  tankMixCompatible?: string[];
  tankMixIncompatible?: string[];
  resistanceRotation?: string[];
  pgrNotes?: string[];
};

export type CropManagementWithDossier = CropManagementProfile & {
  dossierSource?: string;
  dossierLegalNote?: string;
  dossierTankMixCompatible?: string[];
  dossierTankMixIncompatible?: string[];
  dossierResistanceRotation?: string[];
  dossierPgrNotes?: string[];
};
