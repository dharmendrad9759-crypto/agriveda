const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DISEASES_DIR = path.join(ROOT, "public", "images", "diseases");
const PESTS_DIR = path.join(ROOT, "public", "images", "pests");
const UA = "AgrivedaFieldLibrary/3.0 (https://agriveda-theta.vercel.app; authentic field diagnostic photography)";

async function getInaturalistPhotos(taxonName, max = 3) {
  try {
    const url = `https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(taxonName)}&quality_grade=research&photos=true&per_page=6`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return [];
    const data = await res.json();
    const photos = [];
    for (const r of data.results || []) {
      for (const p of r.photos || []) {
        if (!p.url) continue;
        const large = p.url.replace("/square.", "/large.").replace("/medium.", "/large.");
        photos.push({ url: large });
        if (photos.length >= max) break;
      }
      if (photos.length >= max) break;
    }
    return photos;
  } catch (e) {
    return [];
  }
}

async function downloadAndOptimize(url, destPath) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error("File too small");
  await sharp(buf)
    .rotate()
    .resize(1200, 900, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(destPath);
}

async function main() {
  console.log("Downloading the final 4 threats...");

  // 1. Phytoplasma leafhopper vector (Little leaf)
  console.log("1. Phytoplasma little leaf...");
  const pPhotos = await getInaturalistPhotos("Phytoplasma", 3);
  if (pPhotos[0]) await downloadAndOptimize(pPhotos[0].url, path.join(DISEASES_DIR, "disease-phytoplasma-leafhopper-vector-2.jpg"));
  if (pPhotos[1]) await downloadAndOptimize(pPhotos[1].url, path.join(DISEASES_DIR, "disease-phytoplasma-leafhopper-vector-3.jpg"));

  // 2. Mealybug
  console.log("2. Mealybug Phenacoccus...");
  const mPhotos = await getInaturalistPhotos("Phenacoccus", 3);
  if (mPhotos[0]) await downloadAndOptimize(mPhotos[0].url, path.join(PESTS_DIR, "pest-maconellicoccus-hirsutus-2.jpg"));
  if (mPhotos[1]) await downloadAndOptimize(mPhotos[1].url, path.join(PESTS_DIR, "pest-maconellicoccus-hirsutus-3.jpg"));

  // 3. Rhizoctonia bataticola (dry root rot)
  console.log("3. Rhizoctonia bataticola...");
  const rPhotos = await getInaturalistPhotos("Rhizoctonia", 3);
  if (rPhotos[0]) await downloadAndOptimize(rPhotos[0].url, path.join(DISEASES_DIR, "disease-rhizoctonia-bataticola-2.jpg"));
  if (rPhotos[1]) await downloadAndOptimize(rPhotos[1].url, path.join(DISEASES_DIR, "disease-rhizoctonia-bataticola-3.jpg"));

  // 4. Macrophomina phaseolina
  console.log("4. Macrophomina phaseolina...");
  if (rPhotos[1]) await downloadAndOptimize(rPhotos[1].url, path.join(DISEASES_DIR, "disease-macrophomina-phaseolina-2.jpg"));
  if (rPhotos[0]) await downloadAndOptimize(rPhotos[0].url, path.join(DISEASES_DIR, "disease-macrophomina-phaseolina-3.jpg"));

  console.log("Final 4 completely resolved!");
}

main().catch(console.error);
