import batchJson from "@/data/imports/agriveda-batch-2-priority-crops.json";
import type { Crop } from "@/types/crop";
import type { CropManagementProfile } from "@/types/crop-management";
import type { CropDashboardData } from "@/data/crop-dashboard";
import {
  mapToCropListing,
  mapToDashboard,
  mapToManagementProfile,
  type AgrivedaBatchExport,
} from "@/lib/crops/agrivedaExportMapper";

const batch = batchJson as AgrivedaBatchExport;

const profiles = batch.crops.map(mapToManagementProfile);
const listings = batch.crops.map(mapToCropListing);
const dashboards = batch.crops.map(mapToDashboard);

export const importedManagementProfiles: Record<string, CropManagementProfile> = Object.fromEntries(
  profiles.map((p) => [p.slug, p])
);

export const importedCropListings: Record<string, Partial<Crop>> = Object.fromEntries(
  listings.map((l) => [l.slug!, l])
);

export const importedDashboards: Record<string, CropDashboardData> = Object.fromEntries(
  dashboards.map((d) => [d.slug, d])
);

export const importedBatchMeta = {
  exportVersion: batch.exportVersion,
  sourceDocuments: batch.sourceDocuments,
  slugs: batch.crops.map((c) => c._meta.slug),
};
