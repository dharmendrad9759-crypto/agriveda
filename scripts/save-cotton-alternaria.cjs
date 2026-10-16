const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DISEASES_DIR = path.join(ROOT, "public", "images", "diseases");
const UA = "AgrivedaAcademicResearch/3.0 (https://agriveda-theta.vercel.app; authentic field agriculture photography)";

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
  console.log("Saving authentic Cotton Alternaria photos...");
  await saveImage("https://gd.eppo.int/media/data/taxon/A/ALTEMC/pics/1024x0/17295.jpg", path.join(DISEASES_DIR, "disease-alternaria-macrospora.jpg"));
  await saveImage("https://gd.eppo.int/media/data/taxon/A/ALTEMC/pics/1024x0/17296.jpg", path.join(DISEASES_DIR, "disease-alternaria-macrospora-2.jpg"));
  await saveImage("https://agritech.tnau.ac.in/crop_protection/cotton_diseases/Alternaria%20-%20Boll%20Infection.jpg", path.join(DISEASES_DIR, "disease-alternaria-macrospora-3.jpg"));
  console.log("Cotton Alternaria photos updated with 100% authentic field photography from EPPO & TNAU!");
}

run().catch(console.error);
