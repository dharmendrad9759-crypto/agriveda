import type { LatLng, GeoJsonPolygonGeometry } from "@/lib/geo/fieldGeometry";

export type { LatLng, GeoJsonPolygonGeometry };

export interface FarmField {
  id: string;
  name: string;
  area: string;
  ownership: string;
  crop: string;
  variety?: string;
  /** Crop catalog slug — used for alerts and my-crops sync */
  cropSlug?: string;
  status: string;
  /** Display or ISO sowing date — prefer ISO yyyy-mm-dd */
  sowingDate: string;
  /** Canonical ISO sowing date when known */
  sowingDateIso?: string;
  emoji: string;
  /** Real measured health only — omit/undefined means unknown (never invent %) */
  health?: number;
  stage: string;

  // Smart Field Mapping & Geospatial measurement attributes
  village?: string;
  farmerName?: string;
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
  updatedAt?: string;
}

export interface FarmActivity {
  id: string;
  task: string;
  field: string;
  date: string;
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
  activities: FarmActivity[];
  notes: FarmNote[];
}
