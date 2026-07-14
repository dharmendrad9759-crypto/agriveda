import batchJson from "@/data/imports/agriveda-batch-2-priority-crops.json";
import { cropCatalog } from "@/data/crop-catalog";
import { buildDashboardFromCatalog } from "@/lib/dashboardFactory";
import type { Crop } from "@/types/crop";
import type { CropManagementProfile } from "@/types/crop-management";
import type { CropDashboardData } from "@/data/crop-dashboard";
import {
  mapToCropListing,
  mapToDashboard,
  mapToManagementProfile,
  type AgrivedaBatchExport,
} from "@/lib/crops/agrivedaExportMapper";
import { resolveCropImage } from "@/lib/crops/cropImages";
import type { CropCategory } from "@/data/crop-catalog";

function mapCatalogCategory(cat: CropCategory): Crop["category"] {
  if (cat === "Cash Crops") return "Cash-Crops";
  if (cat === "Oilseeds" || cat === "Fruits") return "Vegetables";
  if (cat === "Cereals" || cat === "Vegetables" || cat === "Pulses") return cat;
  return "Cereals";
}

const batch = batchJson as AgrivedaBatchExport;

/** Priority crops from batch-2 roadmap — auto-fill from catalog when not in JSON */
export const BATCH2_PRIORITY_SLUGS = [
  "paddy",
  "wheat",
  "maize",
  "bajra",
  "soybean",
  "moongfali",
  "mustard",
  "cotton",
  "sugarcane",
  "tomato",
  "brinjal",
  "chilli",
  "potato",
  "groundnut",
] as const;

const profiles = batch.crops.map(mapToManagementProfile);
const listings = batch.crops.map(mapToCropListing);
const dashboards = batch.crops.map(mapToDashboard);

const managementMap: Record<string, CropManagementProfile> = Object.fromEntries(
  profiles.map((p) => [p.slug, p])
);
const listingMap: Record<string, Partial<Crop>> = Object.fromEntries(
  listings.map((l) => [l.slug!, l])
);
const dashboardMap: Record<string, CropDashboardData> = Object.fromEntries(
  dashboards.map((d) => [d.slug, d])
);

for (const slug of BATCH2_PRIORITY_SLUGS) {
  if (!dashboardMap[slug]) {
    const dash = buildDashboardFromCatalog(slug);
    if (dash) dashboardMap[slug] = dash;
  }
  if (!listingMap[slug]) {
    const cat = cropCatalog.find((c) => c.slug === slug);
    if (cat) {
      listingMap[slug] = {
        slug: cat.slug,
        name: cat.name,
        category: mapCatalogCategory(cat.category),
        image: resolveCropImage({ slug: cat.slug }),
        overview: `${cat.name} cultivation guide — package of practices for Indian farmers.`,
      };
    }
  }
}

export const importedManagementProfiles = managementMap;
export const importedCropListings = listingMap;
export const importedDashboards = dashboardMap;

export const importedBatchMeta = {
  exportVersion: batch.exportVersion,
  sourceDocuments: batch.sourceDocuments,
  slugs: [...new Set([...batch.crops.map((c) => c._meta.slug), ...BATCH2_PRIORITY_SLUGS])],
};
