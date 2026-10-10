const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const dDir = path.join(ROOT, "public", "images", "diseases");
const pDir = path.join(ROOT, "public", "images", "pests");

const dFiles = new Set(fs.readdirSync(dDir).filter(f => f.endsWith(".jpg")));
const pFiles = new Set(fs.readdirSync(pDir).filter(f => f.endsWith(".jpg")));

// Map of baseName -> array of available image filenames
const manifest = {};

for (const f of dFiles) {
  const base = f.replace(/-[23]\.jpg$/, "").replace(/\.jpg$/, "");
  if (!manifest[`/images/diseases/${base}.jpg`]) {
    const list = [`/images/diseases/${base}.jpg`];
    if (dFiles.has(`${base}-2.jpg`)) list.push(`/images/diseases/${base}-2.jpg`);
    if (dFiles.has(`${base}-3.jpg`)) list.push(`/images/diseases/${base}-3.jpg`);
    manifest[`/images/diseases/${base}.jpg`] = list;
  }
}

for (const f of pFiles) {
  const base = f.replace(/-[23]\.jpg$/, "").replace(/\.jpg$/, "");
  if (!manifest[`/images/pests/${base}.jpg`]) {
    const list = [`/images/pests/${base}.jpg`];
    if (pFiles.has(`${base}-2.jpg`)) list.push(`/images/pests/${base}-2.jpg`);
    if (pFiles.has(`${base}-3.jpg`)) list.push(`/images/pests/${base}-3.jpg`);
    manifest[`/images/pests/${base}.jpg`] = list;
  }
}

const outTs = `/**
 * Auto-generated manifest of multi-photo authentic field images for all crop threats.
 * Generated: ${new Date().toISOString()}
 */

export interface ThreatPhotoItem {
  url: string;
  badgeHi: string;
  badgeEn: string;
  captionHi: string;
  captionEn: string;
}

const GALLERY_MAP: Record<string, string[]> = ${JSON.stringify(manifest, null, 2)};

const PHOTO_METAS = [
  {
    badgeHi: "मुख्य लक्षण",
    badgeEn: "Primary symptom",
    captionHi: "फोटो 1: पत्ती / मुख्य पहचान लक्षण",
    captionEn: "Photo 1: Leaf / Primary diagnostic symptom",
  },
  {
    badgeHi: "पौधे / फल पर",
    badgeEn: "Crop damage",
    captionHi: "फोटो 2: पौधे, फल या तने पर असर",
    captionEn: "Photo 2: Damage on fruit, stem or pod",
  },
  {
    badgeHi: "कीट / खेत फैलाव",
    badgeEn: "Pest / Field",
    captionHi: "फोटो 3: कीट अवस्था / खेत स्तर पर फैलाव",
    captionEn: "Photo 3: Pest life stage / Field severity",
  },
];

export function getThreatGalleryPhotos(primaryImageUrl?: string): ThreatPhotoItem[] {
  if (!primaryImageUrl) return [];

  // Normalize image path
  const normalized = primaryImageUrl.split("?")[0].replace(/-[23]\\.jpg$/, ".jpg");
  const urls = GALLERY_MAP[normalized] || [primaryImageUrl];

  return urls.map((url, i) => {
    const meta = PHOTO_METAS[i] || PHOTO_METAS[0];
    return {
      url,
      badgeHi: meta.badgeHi,
      badgeEn: meta.badgeEn,
      captionHi: meta.captionHi,
      captionEn: meta.captionEn,
    };
  });
}
`;

fs.writeFileSync(path.join(ROOT, "lib", "crops", "threatGalleryManifest.ts"), outTs, "utf8");
console.log(`Generated lib/crops/threatGalleryManifest.ts with ${Object.keys(manifest).length} threat entries.`);
