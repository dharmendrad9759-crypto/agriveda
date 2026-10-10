const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const pdPath = path.join(ROOT, "data", "pest-disease.ts");
const pdContent = fs.readFileSync(pdPath, "utf8");

// Also check crop-protection dossiers and crop-curative-problems
const diseasesDir = path.join(ROOT, "public", "images", "diseases");
const pestsDir = path.join(ROOT, "public", "images", "pests");

// Let's import the threatSpeciesImages resolver logic
const tsiPath = path.join(ROOT, "lib", "pests", "threatSpeciesImages.ts");
const tsiContent = fs.readFileSync(tsiPath, "utf8");

// Parse all crops from pest-disease.ts
const cropBlocks = [];
const regex = /([a-z0-9-]+):\s*\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
let m;
while ((m = regex.exec(pdContent)) !== null) {
  cropBlocks.push({ slug: m[2], name: m[3] });
}

console.log(`Found ${cropBlocks.length} crops in pest-disease.ts`);

// Audit what images are referenced and if they exist
const missingPests = new Set();
const missingDiseases = new Set();

// Let's check each crop by fetching its diseases and pests pages from localhost
async function audit() {
  const allDiseases = new Map();
  const allPests = new Map();

  for (const crop of cropBlocks) {
    try {
      // diseases
      const dRes = await fetch(`http://127.0.0.1:3000/crops/${crop.slug}/care/diseases`);
      if (dRes.ok) {
        const dHtml = await dRes.text();
        const dImgs = [...dHtml.matchAll(/src="(\/images\/diseases\/[^"]+)"/g)].map(x => x[1]);
        for (const img of dImgs) {
          const filePath = path.join(ROOT, "public", img);
          if (!fs.existsSync(filePath)) {
            missingDiseases.add(`${crop.slug}: ${img}`);
          }
        }
      }

      // pests
      const pRes = await fetch(`http://127.0.0.1:3000/crops/${crop.slug}/care/pests`);
      if (pRes.ok) {
        const pHtml = await pRes.text();
        const pImgs = [...pHtml.matchAll(/src="(\/images\/pests\/[^"]+)"/g)].map(x => x[1]);
        for (const img of pImgs) {
          const filePath = path.join(ROOT, "public", img);
          if (!fs.existsSync(filePath)) {
            missingPests.add(`${crop.slug}: ${img}`);
          }
        }
      }
    } catch (e) {
      console.error(`Error auditing ${crop.slug}:`, e.message);
    }
  }

  console.log(`\n--- AUDIT RESULTS ---`);
  console.log(`Missing disease images (${missingDiseases.size}):`);
  for (const d of missingDiseases) console.log("  -", d);

  console.log(`\nMissing pest images (${missingPests.size}):`);
  for (const p of missingPests) console.log("  -", p);
}

audit();
