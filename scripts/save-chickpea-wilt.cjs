const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DISEASES_DIR = path.join(ROOT, "public", "images", "diseases");
const UA = "AgrivedaAcademicResearch/3.0 (https://agriveda-theta.vercel.app; authentic plant health photography)";

async function saveImage(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .rotate()
    .resize(1200, 900, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(dest);
  console.log(`Saved ${path.basename(dest)}: ${(fs.statSync(dest).size/1024).toFixed(1)} KB`);
}

async function run() {
  console.log("Saving chickpea-specific fusarium wilt photos...");
  await saveImage("https://upload.wikimedia.org/wikipedia/commons/1/18/Symptoms_of_stunting_in_chickpea_plants_caused_by_Fusarium_equiseti.jpg", path.join(DISEASES_DIR, "disease-fusarium-ciceri-2.jpg"));
  await saveImage("https://inaturalist-open-data.s3.amazonaws.com/photos/727101012/large.jpg", path.join(DISEASES_DIR, "disease-fusarium-ciceri-3.jpg"));
  console.log("Chickpea wilt photos updated with chickpea-specific plant photos!");
}

run().catch(console.error);
