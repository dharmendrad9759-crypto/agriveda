const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DISEASES_DIR = path.join(ROOT, "public", "images", "diseases");
const UA = "AgrivedaAcademicResearch/3.0 (https://agriveda-theta.vercel.app; authentic plant health photography)";

async function saveImage(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .rotate()
    .resize(1200, 900, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(dest);
  console.log(`Saved ${path.basename(dest)}: ${(fs.statSync(dest).size/1024).toFixed(1)} KB`);
}

async function run() {
  console.log("Saving distinct Mungbean field photos...");
  await saveImage("https://inaturalist-open-data.s3.amazonaws.com/photos/748518485/large.jpg", path.join(DISEASES_DIR, "disease-mungbean-yellow-mosaic-virus-2.jpg"));
  await saveImage("https://inaturalist-open-data.s3.amazonaws.com/photos/748518297/large.jpg", path.join(DISEASES_DIR, "disease-mungbean-yellow-mosaic-virus-3.jpg"));
  console.log("Mungbean yellow mosaic photos disentangled and updated with distinct Vigna radiata photos!");
}

run().catch(console.error);
