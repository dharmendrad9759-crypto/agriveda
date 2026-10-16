const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DISEASES_DIR = path.join(ROOT, "public", "images", "diseases");

const UA = "AgrivedaRemainingEngine/3.0 (authentic agricultural field photography)";

async function downloadAndOptimize(url, destPath) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 3000) throw new Error("File too small");

  const image = sharp(buf);
  const metadata = await image.metadata();

  await image
    .rotate()
    .resize(1200, 900, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(destPath);

  return { width: metadata.width, height: metadata.height, size: fs.statSync(destPath).size };
}

const TASKS = [
  // 1. Cotton Alternaria Leaf Spot (TNAU Agritech Portal authentic field photographs)
  {
    dest: path.join(DISEASES_DIR, "disease-alternaria-macrospora.jpg"),
    url: "https://agritech.tnau.ac.in/crop_protection/cotton_disease_images/alternaria%20leaf%20blight.jpg",
    name: "Alternaria macrospora cotton leaf blight (TNAU)"
  },
  {
    dest: path.join(DISEASES_DIR, "disease-alternaria-macrospora-2.jpg"),
    url: "https://agritech.tnau.ac.in/crop_protection/cotton_diseases/Alternaria%20-%20Boll%20Infection.jpg",
    name: "Alternaria macrospora cotton boll infection (TNAU)"
  },
  // 2. Banana Panama Disease (Wikimedia Commons authentic field photographs)
  {
    dest: path.join(DISEASES_DIR, "disease-fusarium-cubense.jpg"),
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Panama_disease_of_banana_-_vascular_decoloration_on_pseudostem.jpg",
    name: "Panama disease banana vascular discoloration (Commons)"
  },
  {
    dest: path.join(DISEASES_DIR, "disease-fusarium-cubense-2.jpg"),
    url: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Panama_disease_Banana_2.jpg",
    name: "Panama disease banana whole plant wilt (Commons)"
  },
  {
    dest: path.join(DISEASES_DIR, "disease-fusarium-cubense-3.jpg"),
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Banana_%28Variety-_Koa_e_Kea%29-_Fusarium_wilt_%28Panama_disease%29.jpg/1280px-Banana_%28Variety-_Koa_e_Kea%29-_Fusarium_wilt_%28Panama_disease%29.jpg",
    name: "Panama disease banana foliage symptoms (Commons)"
  },
  // 3. Chickpea Ascochyta Blight (Wikimedia Commons authentic field photographs)
  {
    dest: path.join(DISEASES_DIR, "disease-ascochyta-rabiei-2.jpg"),
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Ascochyta_blight.jpg/1280px-Ascochyta_blight.jpg",
    name: "Ascochyta rabiei chickpea field canopy (Commons)"
  },
  {
    dest: path.join(DISEASES_DIR, "disease-ascochyta-rabiei-3.jpg"),
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Didymella_rabiei_%28Chickpea_ascochyta_blight_fungus%29.jpg/1280px-Didymella_rabiei_%28Chickpea_ascochyta_blight_fungus%29.jpg",
    name: "Ascochyta rabiei chickpea lesion detail (Commons)"
  }
];

async function main() {
  console.log(`Downloading and integrating ${TASKS.length} high-priority field images...`);
  for (const t of TASKS) {
    try {
      console.log(`Downloading ${t.name}...`);
      const res = await downloadAndOptimize(t.url, t.dest);
      console.log(` ✅ Saved ${path.basename(t.dest)} (${res.width}x${res.height}, ${(res.size/1024).toFixed(1)} KB)`);
    } catch (e) {
      console.log(` ❌ Failed ${t.name}: ${e.message}`);
    }
  }
}

main().catch(console.error);
