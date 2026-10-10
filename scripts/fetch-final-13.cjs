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

const FINAL_13 = [
  // 1. Shoot fly - Atherigona
  { dir: PESTS_DIR, base: "pest-atherigona-soccata", taxon: "Atherigona" },
  // 2. Potato black scurf (Rhizoctonia)
  { dir: DISEASES_DIR, base: "disease-potato-black-scurf", taxon: "Rhizoctonia" },
  // 3. Damping-off (Pythium)
  { dir: DISEASES_DIR, base: "disease-damping-off", taxon: "Pythium" },
  // 4. Little leaf brinjal (Cicadellidae / Hishimonus)
  { dir: DISEASES_DIR, base: "disease-phytoplasma-leafhopper-vector", taxon: "Cicadellidae" },
  // 5. Mealybug (Maconellicoccus / Pseudococcidae)
  { dir: PESTS_DIR, base: "pest-maconellicoccus-hirsutus", taxon: "Pseudococcidae" },
  // 6. Top borer (Scirpophaga / Crambidae)
  { dir: PESTS_DIR, base: "pest-scirpophaga-excerptalis", taxon: "Scirpophaga" },
  // 7. Termite
  { dir: PESTS_DIR, base: "pest-odontotermes-spp", taxon: "Odontotermes" },
  // 8. Sugarcane red rot
  { dir: DISEASES_DIR, base: "disease-colletotrichum-falcatum", taxon: "Colletotrichum" },
  // 9. Sugarcane grassy shoot
  { dir: DISEASES_DIR, base: "disease-phytoplasma-grassy-shoot", taxon: "Saccharum" },
  // 10. Sugarcane rust (Puccinia)
  { dir: DISEASES_DIR, base: "disease-puccinia-melanocephala", taxon: "Puccinia" },
  // 11. Melon fruit fly (Bactrocera)
  { dir: PESTS_DIR, base: "pest-bactrocera-cucurbitae", taxon: "Bactrocera cucurbitae" },
  // 12. Rhizoctonia bataticola (Macrophomina)
  { dir: DISEASES_DIR, base: "disease-rhizoctonia-bataticola", taxon: "Macrophomina phaseolina" },
  // 13. Macrophomina phaseolina
  { dir: DISEASES_DIR, base: "disease-macrophomina-phaseolina", taxon: "Macrophomina phaseolina" }
];

async function main() {
  console.log("Downloading final 13 threats...");
  let count = 0;
  for (const item of FINAL_13) {
    const f2 = path.join(item.dir, `${item.base}-2.jpg`);
    const f3 = path.join(item.dir, `${item.base}-3.jpg`);
    const need2 = !fs.existsSync(f2) || fs.statSync(f2).size < 12000;
    const need3 = !fs.existsSync(f3) || fs.statSync(f3).size < 12000;
    if (!need2 && !need3) continue;

    process.stdout.write(`Processing ${item.base} ... `);
    const photos = await getInaturalistPhotos(item.taxon, 4);
    if (!photos.length) {
      console.log("none");
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
    console.log(`OK (saved ${saved})`);
    count += saved;
    await new Promise(r => setTimeout(r, 350));
  }
  console.log(`Final 13 complete. Total saved: ${count}`);
}

main().catch(console.error);
