// types/crop.ts

export interface StageSchedule {
  stageName: string;
  durationDays: string;
  description: string;
  fertilizers?: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  sprays?: {
    target: string;
    chemicals: string[];
    dosage: string;
  }[];
}

export interface ProblemEntity {
  id: string;
  name: string;
  scientificName?: string;
  symptoms: string[];
  severity: "low" | "medium" | "high";
  controlChemicals: {
    technical: string;
    brandExample?: string;
    dosage: string;
  }[];
  images: string[];
}

export interface Crop {
  slug: string;
  name: string;
  scientificName: string;
  category: "Cereals" | "Vegetables" | "Pulses" | "Millets" | "Cash-Crops";
  image: string;
  overview: string;
  climate: string;
  soil: string;
  seedRate: string;
  spacing: string;
  durationDays: string; // ध्यान दें: यहाँ durationDays होना जरूरी है
  basalDose: { name: string; dosage: string }[];
  stageWiseSchedule: StageSchedule[];
  pests: ProblemEntity[];
  diseases: ProblemEntity[];
  deficiencies: ProblemEntity[];
  estimatedYield: string;
  marketInfo: string;
}