export type KnowledgeTopic =
  | "pest"
  | "disease"
  | "fertilizer"
  | "deficiency"
  | "herbicide"
  | "irrigation"
  | "sowing"
  | "harvest"
  | "ipm"
  | "safety"
  | "organic"
  | "advisory"
  | "general";

export interface KnowledgeChunk {
  id: string;
  sourceFile: string;
  title: string;
  crops: string[];
  topics: KnowledgeTopic[];
  text: string;
  lang: "en" | "hi";
  state?: string;
}

export interface FertilizerRecommendation {
  cropSlug: string;
  cropName: string;
  source: string;
  n: number;
  p2o5: number;
  k2o: number;
  micronutrients?: string[];
  splits?: string[];
  notes?: string[];
}

export interface KnowledgeSearchResult extends KnowledgeChunk {
  score: number;
}
