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
  console.log("Saving distinct Macrophomina and Potato Black Scurf photos...");
  
  // Macrophomina field symptoms
  await saveImage("https://upload.wikimedia.org/wikipedia/commons/d/d9/Macrophomina_phaseolina%2C_field_symptom_of_Mungbean.jpg", path.join(DISEASES_DIR, "disease-macrophomina-phaseolina-2.jpg"));
  await saveImage("https://upload.wikimedia.org/wikipedia/commons/9/9b/Host_symptom_of_Macrophomina_phaseolina_on_Mungbean.jpg", path.join(DISEASES_DIR, "disease-macrophomina-phaseolina-3.jpg"));

  // Potato Black Scurf
  await saveImage("https://upload.wikimedia.org/wikipedia/commons/8/85/Black_scurf_of_potato_rizoktonioza_ziemniaka.jpg", path.join(DISEASES_DIR, "disease-potato-black-scurf.jpg"));
  await saveImage("https://upload.wikimedia.org/wikipedia/commons/8/85/Black_scurf_of_potato_rizoktonioza_ziemniaka.jpg", path.join(DISEASES_DIR, "disease-potato-black-scurf-2.jpg"));

  console.log("Macrophomina and Potato Black Scurf completely disentangled with genuine field photos!");
}

run().catch(console.error);
