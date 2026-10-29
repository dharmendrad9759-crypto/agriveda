import type { LatLng, GeoJsonPolygonGeometry } from "@/lib/geo/fieldGeometry";

export type { LatLng, GeoJsonPolygonGeometry };

export interface FarmField {
  id: string;
  name: string;
  area: string;
  ownership: string;
  crop: string;
  variety?: string;
  cropSlug?: string;
  status: string; // "Active" | "Archived"
  sowingDate: string;
  sowingDateIso?: string;
  emoji: string;
  health?: number;
  stage: string;

  // Geospatial measurement attributes
  village?: string;
  farmerName?: string;
  location?: { lat: number; lng: number };
  isLocationOnly?: boolean;
  areaAcres?: number;
  areaHectares?: number;
  areaSqMeters?: number;
  perimeterMeters?: number;
  bighaDisplay?: string;
  boundary?: LatLng[];
  geoJson?: GeoJsonPolygonGeometry;
  measurementMethod?: "manual_map" | "gps_walk" | "manual_entry";
  soilType?: string;
  irrigationType?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type SeasonStatus = "active" | "harvested" | "archived";
export type StageEstimationMethod = "farmer_confirmed" | "gdd_weather" | "agronomic_window";

export interface CropSeason {
  id: string;
  fieldId: string;
  cropId: string;
  cropName: string;
  variety?: string;
  seasonName: string; // e.g. "रबी 2026-27"
  sowingDate: string; // ISO yyyy-mm-dd
  sowingMethod?: "drill" | "broadcasting" | "transplanting" | "zero_till";
  currentStageId: string;
  farmerConfirmedStageId?: string;
  stageEstimationMethod: StageEstimationMethod;
  seasonStatus: SeasonStatus;
  actualHarvestDate?: string;
  soilType?: string;
  irrigationMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CropStageDefinition {
  cropId: string;
  stageId: string;
  zadoksCode?: string; // e.g. "Z10-Z19", "Z20-Z29"
  stageNameHi: string;
  stageNameEn: string;
  stageOrder: number;
  descriptionHi: string;
  identificationCriteriaHi: string[];
  typicalDaysRange: [number, number]; // [minDays, maxDays] after sowing
  baseTempC: number; // Base temperature for GDD (e.g. 5.0 for wheat)
  targetGDD?: [number, number]; // Cumulative Growing Degree Days range
  photoUrl: string;
  importantActivitiesHi: string[];
  irrigationConsiderationsHi: string;
  nutrientManagementHi: string;
  weedManagementHi: string;
  pestMonitoringHi: string;
  diseaseMonitoringHi: string;
  commonMistakesHi: string[];
  nextStagePreviewHi: string;
}

export type ObservationCategory =
  | "insect_pest"
  | "disease"
  | "weed_patch"
  | "waterlogging"
  | "irrigation_issue"
  | "soil_deficiency"
  | "general_scout";

export interface FieldObservation {
  id: string;
  fieldId: string;
  seasonId?: string;
  date: string; // ISO string
  location?: { lat: number; lng: number };
  category: ObservationCategory;
  title: string;
  notes: string;
  photoUri?: string;
  status: "active" | "resolved";
  isVerified?: boolean;
  createdAt: string;
}

export interface PotentialInspectionZone {
  zoneId: string;
  relativeDeviation: number; // e.g. -0.18 (18% below field average NDVI)
  meanNdvi: number;
  centroid?: { lat: number; lng: number };
  areaHectares: number;
  explanationHi: string;
  urgency: "low" | "medium" | "high";
}

export interface SatelliteObservation {
  id: string;
  fieldId: string;
  acquisitionDate: string; // YYYY-MM-DD
  satelliteProvider: string; // e.g. "Copernicus Sentinel-2 Level-2A"
  sceneId: string;
  indexType: "NDVI";
  meanNdvi: number;
  medianNdvi: number;
  minNdvi: number;
  maxNdvi: number;
  standardDeviation: number;
  validPixelCount: number;
  validCoveragePercent: number;
  cloudCoveragePercent: number;
  resolutionMeters: number; // 10m for Sentinel-2
  qualityStatus: "high" | "moderate" | "cloud_compromised" | "insufficient_resolution";
  isSmallFieldSafeguarded: boolean;
  smallFieldMessage?: string;
  potentialInspectionZones: PotentialInspectionZone[];
  processingVersion: string;
}

export type TaskStatus = "upcoming" | "due" | "completed" | "skipped";

export interface FarmTask {
  id: string;
  fieldId: string;
  seasonId: string;
  cropId: string;
  stageId?: string;
  category: "sowing" | "irrigation" | "fertilizer" | "weeding" | "scouting" | "spray" | "harvest";
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  dueDaysAfterSowing: [number, number]; // [startDay, endDay]
  status: TaskStatus;
  completedAt?: string;
  farmerNotes?: string;
}

export interface FarmAlert {
  id: string;
  fieldId: string;
  seasonId?: string;
  type: "weather_risk" | "satellite_anomaly" | "stage_milestone" | "task_due";
  severity: "info" | "warning" | "critical";
  titleHi: string;
  messageHi: string;
  createdAt: string;
  isRead: boolean;
  actionHref?: string;
}

export interface FarmActivity {
  id: string;
  task: string;
  field: string;
  date: string;
  category?: string;
  notes?: string;
}

export interface FarmNote {
  id: string;
  title: string;
  body: string;
  date: string;
  pinned: boolean;
}

export interface FarmData {
  fields: FarmField[];
  seasons: CropSeason[];
  observations: FieldObservation[];
  satelliteObservations: SatelliteObservation[];
  tasks: FarmTask[];
  alerts: FarmAlert[];
  activities: FarmActivity[];
  notes: FarmNote[];
}
