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
  console.log("Saving Tomato Fusarium Wilt photos from EPPO...");
  await saveImage("https://gd.eppo.int/media/data/taxon/F/FUSALC/pics/1024x0/765.jpg", path.join(DISEASES_DIR, "disease-fusarium-lycopersici.jpg"));
  await saveImage("https://gd.eppo.int/media/data/taxon/F/FUSALC/pics/1024x0/774.jpg", path.join(DISEASES_DIR, "disease-fusarium-lycopersici-2.jpg"));
  await saveImage("https://gd.eppo.int/media/data/taxon/F/FUSALC/pics/1024x0/770.jpg", path.join(DISEASES_DIR, "disease-fusarium-lycopersici-3.jpg"));
  console.log("Tomato Fusarium Wilt photos updated with 100% authentic field photography from EPPO Global Database!");
}

run().catch(console.error);
