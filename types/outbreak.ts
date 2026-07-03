export type OutbreakSeverity = "low" | "medium" | "high";
export type OutbreakThreatType = "pest" | "disease";

export interface OutbreakReport {
  id: string;
  farmerId: string;
  cropId: string;
  threatType: OutbreakThreatType;
  pestOrDiseaseId: string;
  photoUrl?: string;
  latitude: number;
  longitude: number;
  severity: OutbreakSeverity;
  reportDate: string;
  verified: boolean;
}

/** Public-facing report — no farmer identity, approximate location */
export interface PublicOutbreakReport {
  id: string;
  cropId: string;
  cropName: string;
  threatType: OutbreakThreatType;
  pestOrDiseaseId: string;
  threatName: string;
  threatCategory: string;
  latitude: number;
  longitude: number;
  severity: OutbreakSeverity;
  reportDate: string;
  verified: boolean;
  advisoryUrl: string;
  distanceKm?: number;
}

export interface OutbreakCluster {
  cropId: string;
  cropName: string;
  threatType: OutbreakThreatType;
  pestOrDiseaseId: string;
  threatName: string;
  centerLat: number;
  centerLon: number;
  reportCount: number;
  radiusKm: number;
  lastReportDate: string;
  advisoryUrl: string;
  reportIds: string[];
}

export interface OutbreakListSummary {
  threatName: string;
  cropName: string;
  threatType: OutbreakThreatType;
  cropId: string;
  pestOrDiseaseId: string;
  reportCount: number;
  nearestDistanceKm: number;
  lastReportDate: string;
  advisoryUrl: string;
}

export interface SubmitOutbreakInput {
  farmerId: string;
  cropId: string;
  threatType: OutbreakThreatType;
  pestOrDiseaseId: string;
  photoUrl?: string;
  latitude: number;
  longitude: number;
  severity: OutbreakSeverity;
}
