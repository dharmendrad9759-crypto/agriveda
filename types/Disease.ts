export interface Disease {
  diseaseId: string;
  name: string;
  pathogen: string;
  type: "fungal" | "bacterial" | "viral" | "nematode" | "other";
  symptoms: string[];
  favourableConditions: string[];
  management: string[];
  chemicalControl?: string[];
  biologicalControl?: string[];
}
