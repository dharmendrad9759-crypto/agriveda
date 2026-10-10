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

const BATCH2 = [
  // Aulacophora (Red pumpkin beetle)
  { dir: PESTS_DIR, base: "pest-aulacophora-foveicollis", taxon: "Aulacophora" },

  // Aphis gossypii (Cotton aphid)
  { dir: PESTS_DIR, base: "pest-aphis-gossypii", taxon: "Aphis gossypii" },

  // Aphis craccivora (Pulse aphid)
  { dir: PESTS_DIR, base: "pest-aphis-craccivora", taxon: "Aphis craccivora" },

  // Bactrocera dorsalis (Mango fruit fly)
  { dir: PESTS_DIR, base: "pest-bactrocera-dorsalis", taxon: "Bactrocera dorsalis" },

  // Bagrada hilaris (Mustard painted bug)
  { dir: PESTS_DIR, base: "pest-bagrada-hilaris", taxon: "Bagrada hilaris" },

  // Callosobruchus chinensis (Gram pulse beetle)
  { dir: PESTS_DIR, base: "pest-callosobruchus-chinensis", taxon: "Callosobruchus chinensis" },

  // Sclerotium rolfsii / Athelia rolfsii (Collar rot)
  { dir: DISEASES_DIR, base: "disease-sclerotium-rolfsii", taxon: "Athelia rolfsii" },

  // Groundnut Rust
  { dir: DISEASES_DIR, base: "disease-puccinia-arachidis", taxon: "Puccinia" },

  // Cercospora sojina (Frogeye leaf spot)
  { dir: DISEASES_DIR, base: "disease-cercospora-sojina", taxon: "Cercospora" },

  // Alternaria brassicae (Mustard Alternaria)
  { dir: DISEASES_DIR, base: "disease-alternaria-brassicae", taxon: "Alternaria" },

  // Alternaria porri (Onion purple blotch)
  { dir: DISEASES_DIR, base: "disease-alternaria-porri", taxon: "Alternaria" },

  // Potato virus Y / Potyvirus
  { dir: DISEASES_DIR, base: "disease-potato-virus-y", taxon: "Potyvirus" },

  // Okra YVMV / Begomovirus
  { dir: DISEASES_DIR, base: "disease-bhendi-yvmv", taxon: "Begomovirus" },

  // Mungbean YMV / Begomovirus
  { dir: DISEASES_DIR, base: "disease-mungbean-yellow-mosaic-virus", taxon: "Begomovirus" },

  // Banana Bunchy Top / Babuvirus
  { dir: DISEASES_DIR, base: "disease-banana-bunchy-top-virus", taxon: "Musa" },

  // Botrytis cinerea (Grey mould)
  { dir: DISEASES_DIR, base: "disease-botrytis-cinerea", taxon: "Botrytis cinerea" },

  // Elsinoe ampelina (Grape anthracnose)
  { dir: DISEASES_DIR, base: "disease-elsinoe-ampelina", taxon: "Elsinoe" },

  // Aphis glycines (Soybean aphid)
  { dir: PESTS_DIR, base: "pest-aphis-glycines", taxon: "Aphis glycines" },

  // Aproaerema modicella (Groundnut leaf miner)
  { dir: PESTS_DIR, base: "pest-aproaerema-modicella", taxon: "Gelechiidae" },

  // Flea beetle / Altica
  { dir: PESTS_DIR, base: "pest-altica-spp", taxon: "Altica" },

  // Agrotis spp
  { dir: PESTS_DIR, base: "pest-agrotis-spp", taxon: "Agrotis" },

  // Shoot fly / Atherigona
  { dir: PESTS_DIR, base: "pest-atherigona-approximata", taxon: "Atherigona" },

  // Woolly aphid / Ceratovacuna
  { dir: PESTS_DIR, base: "pest-ceratovacuna-lanigera", taxon: "Aphididae" },

  // Chilo infuscatellus (Early shoot borer)
  { dir: PESTS_DIR, base: "pest-chilo-infuscatellus", taxon: "Chilo" }
];

async function main() {
  console.log(`Downloading authentic photos for batch 2 (${BATCH2.length} items)...`);
  let ok = 0;
  for (const item of BATCH2) {
    const f2 = path.join(item.dir, `${item.base}-2.jpg`);
    const f3 = path.join(item.dir, `${item.base}-3.jpg`);
    const need2 = !fs.existsSync(f2) || fs.statSync(f2).size < 12000;
    const need3 = !fs.existsSync(f3) || fs.statSync(f3).size < 12000;
    if (!need2 && !need3) continue;

    process.stdout.write(`Processing ${item.base} ... `);
    const photos = await getInaturalistPhotos(item.taxon, 3);
    if (!photos.length) {
      console.log("No photos found");
      continue;
    }

    let saved = 0;
    if (need2 && photos[0]) {
      try {
        await downloadAndOptimize(photos[0].url, f2);
        saved++;
      } catch (e) {}
    }
    if (need3 && photos[1]) {
      try {
        await downloadAndOptimize(photos[1].url, f3);
        saved++;
      } catch (e) {}
    }
    console.log(`OK! (saved ${saved})`);
    ok += saved;
    await new Promise(r => setTimeout(r, 350));
  }
  console.log(`Batch 2 complete. Saved ${ok} new field photos.`);
}

main().catch(console.error);
