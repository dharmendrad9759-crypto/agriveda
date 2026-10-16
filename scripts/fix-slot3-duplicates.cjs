const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DISEASES_DIR = path.join(ROOT, "public", "images", "diseases");
const UA = "Agriveda/3.0";

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
  // 1. Begomovirus leaf curl distinct slot 3
  const inatBegomovirus = "https://static.inaturalist.org/photos/746947614/large.jpg";
  try {
    await saveImage(inatBegomovirus, path.join(DISEASES_DIR, "disease-begomovirus-leaf-curl-3.jpg"));
  } catch(e) {
    console.log("Leaf curl 3 failed:", e.message);
  }

  // 2. Potato Black scurf distinct slot 3
  const inatPotato = "https://inaturalist-open-data.s3.amazonaws.com/photos/484892558/large.jpeg";
  try {
    await saveImage(inatPotato, path.join(DISEASES_DIR, "disease-potato-black-scurf-3.jpg"));
  } catch(e) {
    console.log("Potato scurf 3 failed:", e.message);
  }
}

run().catch(console.error);
