const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

// Import or replicate the resolvers
const tsiPath = path.join(ROOT, "lib", "pests", "threatSpeciesImages.ts");
const tsiCode = fs.readFileSync(tsiPath, "utf8");

// We can require the compiled or transpile or directly evaluate the logic
// Or create a clean evaluator for getPestSpeciesImage and getDiseaseSpeciesImage
const pdContent = fs.readFileSync(path.join(ROOT, "data", "pest-disease.ts"), "utf8");

// Extract cropPestDiseaseData object
// Let's parse all pests, diseases, weeds per crop
const crops = [];
const cropRegex = /([a-z0-9-]+):\s*\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*emoji:\s*"([^"]+)",\s*pests:\s*\[([\s\S]*?)\],\s*diseases:\s*\[([\s\S]*?)\],\s*weeds:\s*\[([\s\S]*?)\]\s*\}/g;

let match;
while ((match = cropRegex.exec(pdContent)) !== null) {
  const cropKey = match[1];
  const slug = match[2];
  const name = match[3];
  const emoji = match[4];
  const pestsRaw = match[5];
  const diseasesRaw = match[6];
  const weedsRaw = match[7];

  const pestItems = [];
  const pMatch = pestsRaw.matchAll(/\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*scientificName:\s*"([^"]+)"/g);
  for (const p of pMatch) {
    pestItems.push({ id: p[1], name: p[2], scientificName: p[3] });
  }

  const diseaseItems = [];
  const dMatch = diseasesRaw.matchAll(/\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*pathogen:\s*"([^"]+)"/g);
  for (const d of dMatch) {
    diseaseItems.push({ id: d[1], name: d[2], pathogen: d[3] });
  }

  const weedItems = [];
  const wMatch = weedsRaw.matchAll(/\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",[\s\S]*?scientificName:\s*"([^"]+)"/g);
  for (const w of wMatch) {
    weedItems.push({ id: w[1], name: w[2], scientificName: w[3] });
  }

  crops.push({
    cropKey,
    slug,
    name,
    emoji,
    pests: pestItems,
    diseases: diseaseItems,
    weeds: weedItems
  });
}

console.log(`Parsed ${crops.length} crops from data/pest-disease.ts:`);
let totalPests = 0;
let totalDiseases = 0;
let totalWeeds = 0;

crops.forEach(c => {
  totalPests += c.pests.length;
  totalDiseases += c.diseases.length;
  totalWeeds += c.weeds.length;
});

console.log(`Total Pests: ${totalPests}, Diseases: ${totalDiseases}, Weeds: ${totalWeeds}`);
fs.writeFileSync(path.join(ROOT, "scripts", "catalog-dump.json"), JSON.stringify(crops, null, 2), "utf8");
